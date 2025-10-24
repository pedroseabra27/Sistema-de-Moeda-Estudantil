import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { professor } from '$lib/server/db/professor/schema';
import { transacao } from '$lib/server/db/professor/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

export type InsertTransacao = InferInsertModel<typeof transacao>;

export const transacaoModel = {
	async listarPorProfessor(cpf: string) {
		return await db.query.transacao.findMany({
			where: eq(transacao.professorCPF, cpf),
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},
	async listarExtratoAluno(cpfAluno: string) {
		return await db
			.select({
				id: transacao.id,
				motivo: transacao.motivo,
				data: transacao.data,
				valor: transacao.valor,
				professorCPF: transacao.professorCPF,
				professorDepartamento: professor.departamento
			})
			.from(transacao)
			.leftJoin(professor, eq(transacao.professorCPF, professor.cpf))
			.where(eq(transacao.alunoCPF, cpfAluno))
			.orderBy(sql`${transacao.data} DESC`);
	},

	async realizarTransferencia(info: {
		professorCpf: string;
		alunoId: number; 
		valor: number;
		motivo: string;
	}) {
		if (info.valor <= 0) {
			throw new Error('O valor da transferência deve ser positivo.');
		}

		return await db.transaction(async (tx) => {
			const aluno = await tx.query.alunoT.findFirst({
				where: eq(alunoT.id, info.alunoId),
				columns: { cpf: true, saldo: true }
			});

			if (!aluno) {
				throw new Error('Aluno não encontrado.');
			}

			const [profAtualizado] = await tx
				.update(professor)
				.set({
					saldo: sql`${professor.saldo} - ${info.valor}`
				})
				.where(
					and(
						eq(professor.cpf, info.professorCpf),
						sql`${professor.saldo} >= ${info.valor}` 
					)
				)
				.returning({ saldo: professor.saldo });

			if (!profAtualizado) {
				throw new Error('Saldo insuficiente para realizar a transferência.');
			}

			
			await tx
				.update(alunoT)
				.set({
					saldo: sql`${alunoT.saldo} + ${info.valor}`
				})
				.where(eq(alunoT.id, info.alunoId));

			const novaTransacao: InsertTransacao = {
				id: crypto.randomUUID(), 
				motivo: info.motivo,
				valor: info.valor,
				professorCPF: info.professorCpf,
				alunoCPF: aluno.cpf 
			};
			await tx.insert(transacao).values(novaTransacao);

			return {
				novoSaldoProfessor: profAtualizado.saldo,
				message: 'Transferência realizada com sucesso!'
			};
		});
	}
};