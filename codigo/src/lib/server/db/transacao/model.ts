import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { professorT } from '$lib/server/db/professor/schema';
import { transacaoT } from '$lib/server/db/transacao/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { vantagemResgatadaT, vantagemT } from '../schema';
import { transporter } from '$lib/server/mail';
import { env } from '$env/dynamic/private';

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
		return await db.query.vantagemResgatadaT.findMany({
			where: and(eq(vantagemResgatadaT.aluno_id, id)),
			with: {
				vantagem: true,
				transacao: true
			},
			orderBy: (t, { desc }) => [desc(t.resgatada_em)]
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

		const resultado = await db.transaction(async (tx) => {
			const aluno = await tx.query.alunoT.findFirst({
				where: eq(alunoT.id, info.alunoId),
				with: {
					user: true
				},
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
				.where(and(eq(professorT.id, info.professorId), sql`${professorT.saldo} >= ${info.valor}`))
				.returning({ saldo: professorT.saldo });

			const profData = await tx.query.professorT.findFirst({
				where: eq(professorT.id, info.professorId),
				with: {
					user: {
						columns: {
							email: true
						}
					}
				}
			});

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
				alunoEmail: aluno.user.email,
				professorEmail: profData?.user ? profData.user.email : ''
			};
		});

		await transporter.sendMail({
			from: `"BNP Coin" <${env.GMAIL_USER}>`,
			to: resultado.alunoEmail,
			subject: '💰 Você recebeu BNP Coins!',
			text: `Parabéns! Você recebeu ${info.valor} BNP Coins. Motivo: ${info.motivo}`,
			html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;"><div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;"><h1 style="margin: 0; font-size: 24px;">💰 BNP Coin</h1></div><div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;"><h2 style="color: #1e40af; margin-top: 0;">Parabéns!</h2><p style="font-size: 16px; color: #333;">Você recebeu <strong style="color: #1e40af; font-size: 20px;">${info.valor} BNP Coins</strong></p><div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0;"><p style="margin: 0; color: #1e40af;"><strong>Motivo:</strong> ${info.motivo}</p></div><p style="color: #666; font-size: 14px;">Continue se dedicando para ganhar mais moedas!</p></div></div>`
		});

		if (resultado.professorEmail) {
			await transporter.sendMail({
				from: `"BNP Coin" <${env.GMAIL_USER}>`,
				to: resultado.professorEmail,
				subject: '🔔 Transferência de BNP Coins Realizada',
				text: `Você realizou uma transferência de ${info.valor} BNP Coins. Motivo: ${info.motivo}`,
				html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;"><div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;"><h1 style="margin: 0; font-size: 24px;">💰 BNP Coin</h1></div><div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;"><h2 style="color: #1e40af; margin-top: 0;">Transferência Realizada</h2><p style="font-size: 16px; color: #333;">Você transferiu <strong style="color: #1e40af; font-size: 20px;">${info.valor} BNP Coins</strong></p><div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0;"><p style="margin: 0; color: #1e40af;"><strong>Motivo:</strong> ${info.motivo}</p></div><p style="color: #666; font-size: 14px;">Seu saldo atual: <strong>${resultado.novoSaldoProfessor} BNP Coins</strong></p></div></div>`
			});
		}

		return {
			novoSaldoProfessor: resultado.novoSaldoProfessor,
			message: 'Transferência realizada com sucesso!'
		};
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
				valor: -valorVantagem,
				alunoId: alunoId,
				professorId: null
			};

			const [transacaoInserida] = await tx.insert(transacaoT).values(novaTransacao).returning();

			await tx.insert(vantagemResgatadaT).values({
				aluno_id: alunoId,
				vantagem_id: vantagemId,
				transacao_id: transacaoInserida.id
			})

			return {
				message: 'Vantagem resgatada com sucesso!',
				novoSaldo: aluno.saldo - valorVantagem
			};
		});
	}
};
