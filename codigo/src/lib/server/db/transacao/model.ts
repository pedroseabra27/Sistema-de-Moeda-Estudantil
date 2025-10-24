import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { professorT } from '$lib/server/db/professor/schema';
import { transacaoT } from '$lib/server/db/transacao/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

export type InsertTransacao = InferInsertModel<typeof transacaoT>;

export const transacaoModel = {
	async listarPorProfessor(cpf: string) {
		return await db.query.transacaoT.findMany({
			where: eq(transacaoT.professorCPF, cpf),
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},
	async listarExtratoAluno(cpfAluno: string) {
		return await db
			.select({
				id: transacaoT.id,
				motivo: transacaoT.motivo,
				data: transacaoT.data,
				valor: transacaoT.valor,
				professorCPF: transacaoT.professorCPF,
				professorDepartamento: professorT.departamento
			})
			.from(transacaoT)
			.leftJoin(professorT, eq(transacaoT.professorCPF, professorT.cpf))
			.where(eq(transacaoT.alunoCPF, cpfAluno))
			.orderBy(sql`${transacaoT.data} DESC`);
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
				.update(professorT)
				.set({
					saldo: sql`${professorT.saldo} - ${info.valor}`
				})
				.where(
					and(eq(professorT.cpf, info.professorCpf), sql`${professorT.saldo} >= ${info.valor}`)
				)
				.returning({ saldo: professorT.saldo });

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
			await tx.insert(transacaoT).values(novaTransacao);

			return {
				novoSaldoProfessor: profAtualizado.saldo,
				message: 'Transferência realizada com sucesso!'
			};
		});
	}
};
