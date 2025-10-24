import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { professor } from '$lib/server/db/professor/schema';
import { transacao } from '$lib/server/db/professor/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

// Tipo para criar uma nova transação (baseado no seu schema.ts)
export type InsertTransacao = InferInsertModel<typeof transacao>;

export const transacaoModel = {
	/**
	 * Lista as transações de um professor específico.
	 */
	async listarPorProfessor(cpf: string) {
		// NOTA: Para exibir o NOME do aluno, você precisará de um JOIN
		// com a tabela 'user' através da 'alunoT'.
		// Por enquanto, retornamos o CPF do aluno.
		return await db.query.transacao.findMany({
			where: eq(transacao.professorCPF, cpf),
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},

	/**
	 * Realiza a transferência de moedas do professor para o aluno
	 * de forma atômica (ou tudo funciona, ou nada é salvo).
	 */
	async realizarTransferencia(info: {
		professorCpf: string;
		alunoId: number; // O formulário envia o ID do aluno (serial)
		valor: number;
		motivo: string;
	}) {
		if (info.valor <= 0) {
			throw new Error('O valor da transferência deve ser positivo.');
		}

		// 'db.transaction' garante que as 4 etapas seguintes
		// só sejam salvas se TODAS derem certo.
		return await db.transaction(async (tx) => {
			// 1. Busca o aluno pelo ID (serial) para pegar seu CPF e saldo
			const aluno = await tx.query.alunoT.findFirst({
				where: eq(alunoT.id, info.alunoId),
				columns: { cpf: true, saldo: true }
			});

			if (!aluno) {
				throw new Error('Aluno não encontrado.');
			}

			// 2. Trava e ATUALIZA o saldo do professor
			// A cláusula 'where' aqui é a parte mais importante:
			// Ela só atualiza SE o saldo for suficiente (>= valor).
			const [profAtualizado] = await tx
				.update(professor)
				.set({
					saldo: sql`${professor.saldo} - ${info.valor}`
				})
				.where(
					and(
						eq(professor.cpf, info.professorCpf),
						sql`${professor.saldo} >= ${info.valor}` // Garante saldo suficiente
					)
				)
				.returning({ saldo: professor.saldo });

			// 3. Se 'profAtualizado' for nulo, significa que a condição WHERE falhou
			if (!profAtualizado) {
				throw new Error('Saldo insuficiente para realizar a transferência.');
			}

			// 4. ATUALIZA o saldo do aluno
			await tx
				.update(alunoT)
				.set({
					saldo: sql`${alunoT.saldo} + ${info.valor}`
				})
				.where(eq(alunoT.id, info.alunoId));

			// 5. REGISTRA a transação
			const novaTransacao: InsertTransacao = {
				id: crypto.randomUUID(), // Gera um ID único
				motivo: info.motivo,
				valor: info.valor,
				professorCPF: info.professorCpf,
				alunoCPF: aluno.cpf // Usa o CPF do aluno que buscamos
				// 'data' terá o valor default (defaultNow())
			};
			await tx.insert(transacao).values(novaTransacao);

			// Retorna sucesso
			return {
				novoSaldoProfessor: profAtualizado.saldo,
				message: 'Transferência realizada com sucesso!'
			};
		});
	}
};