import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { professorT } from '$lib/server/db/professor/schema';
import { transacaoT } from '$lib/server/db/transacao/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { vantagemT } from '../schema';

export type InsertTransacao = InferInsertModel<typeof transacaoT>;

export const transacaoModel = {
	async listar() {
		return await db.query.transacaoT.findMany({
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},
	async listarPorProfessor(id: number) {
		return await db.query.transacaoT.findMany({
			where: eq(transacaoT.professorId, id),
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},
	async listarPorAluno(id: number) {
		return await db.query.transacaoT.findMany({
			where: eq(transacaoT.alunoId, id),
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},
	async listarResgatesPorAluno(id: number) {
		return await db.query.transacaoT.findMany({
			where: and(
				eq(transacaoT.alunoId, id),
				sql`LOWER(${transacaoT.motivo}) LIKE ${'resgate%'}`
			),
			orderBy: (t, { desc }) => [desc(t.data)]
		});
	},
	async listarExtratoAluno(idAluno: number) {
		return await db
			.select({
				id: transacaoT.id,
				motivo: transacaoT.motivo,
				data: transacaoT.data,
				valor: transacaoT.valor,
				professorId: transacaoT.professorId,
				professorDepartamento: professorT.departamento
			})
			.from(transacaoT)
			.leftJoin(professorT, eq(transacaoT.professorId, professorT.id))
			.where(eq(transacaoT.alunoId, idAluno))
			.orderBy(sql`${transacaoT.data} DESC`);
	},

	async realizarTransferencia(info: {
		professorId: number;
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
				columns: { id: true, saldo: true }
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
					and(eq(professorT.id, info.professorId), sql`${professorT.saldo} >= ${info.valor}`)
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
				professorId: info.professorId,
				alunoId: aluno.id
			};
			await tx.insert(transacaoT).values(novaTransacao);

			return {
				novoSaldoProfessor: profAtualizado.saldo,
				message: 'Transferência realizada com sucesso!'
			};
		});
	},
	async resgatarVantagem(alunoId: number, vantagemId: number) {
		return await db.transaction(async (tx) => {
			const aluno = await tx.query.alunoT.findFirst({
				where: eq(alunoT.id, alunoId)
			});

			if (!aluno) {
				throw new Error('Aluno não encontrado.');
			}

			const vantagem = await tx.query.vantagemT.findFirst({
				where: eq(vantagemT.id, vantagemId)
			});

			if (!vantagem) {
				throw new Error('Vantagem não encontrada.');
			}

			const valorVantagem = parseInt(vantagem.valor);

			if (aluno.saldo < valorVantagem) {
				throw new Error('Saldo insuficiente para resgatar esta vantagem.');
			}

			await tx
				.update(alunoT)
				.set({
					saldo: sql`${alunoT.saldo} - ${valorVantagem}`
				})
				.where(eq(alunoT.id, alunoId));

			const novaTransacao: InsertTransacao = {
				id: crypto.randomUUID(),
				motivo: `Resgate de vantagem: ${vantagem.descricao}`,
				valor: valorVantagem,
				alunoId: alunoId,
				professorId: null
			};
			await tx.insert(transacaoT).values(novaTransacao);

			return {
				message: 'Vantagem resgatada com sucesso!',
				novoSaldo: aluno.saldo - valorVantagem
			};
		});
	},
};
