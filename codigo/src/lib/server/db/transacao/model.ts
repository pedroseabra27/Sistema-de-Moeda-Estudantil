import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { professorT } from '$lib/server/db/professor/schema';
import { transacaoT } from '$lib/server/db/transacao/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';
import { vantagemResgatadaT, vantagemT } from '../schema';
import { transporter } from '$lib/server/mail';
import { env } from '$env/dynamic/private';
import { transferToAlunoHtml, transferToProfessorHtml, resgateAlunoHtml, resgateEmpresaHtml } from '$lib/client/utils/emails';
import QRCode from 'qrcode';

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
					html: transferToAlunoHtml(info.valor, info.motivo)
		});

		if (resultado.professorEmail) {
			await transporter.sendMail({
				from: `"BNP Coin" <${env.GMAIL_USER}>`,
				to: resultado.professorEmail,
				subject: '🔔 Transferência de BNP Coins Realizada',
				text: `Você realizou uma transferência de ${info.valor} BNP Coins. Motivo: ${info.motivo}`,
						html: transferToProfessorHtml(info.valor, info.motivo, resultado.novoSaldoProfessor)
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
				where: eq(alunoT.id, alunoId),
				with: {
					user: true
				}
			});

			if (!aluno) {
				throw new Error('Aluno não encontrado.');
			}

			const vantagem = await tx.query.vantagemT.findFirst({
				where: eq(vantagemT.id, vantagemId),
				with: {
					empresa: {
						with: {
							user: {
								columns: {
									email: true
								}
							}
						}
					}
				}
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

			const [resgate] = await tx.insert(vantagemResgatadaT).values({
				aluno_id: alunoId,
				vantagem_id: vantagemId,
				transacao_id: transacaoInserida.id,
				codigo_resgate: crypto.randomUUID()
			}).returning()

			const qrCodeBuffer = await QRCode.toBuffer(resgate.codigo_resgate, {
				width: 200,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#FFFFFF'
				}
			});

			await transporter.sendMail({
				from: `"BNP Coin" <${env.GMAIL_USER}>`,
				to: aluno.user.email,
				subject: '🎉 Resgate de Vantagem Realizado!',
				text: `Resgate realizado com sucesso! Código de resgate: ${resgate.codigo_resgate}`,
				html: resgateAlunoHtml(vantagem.descricao, valorVantagem, resgate.codigo_resgate),
				attachments: [
					{
						filename: 'qrcode.png',
						content: qrCodeBuffer,
						cid: 'qrcode'
					}
				]
			});


			if (!vantagem.empresa.user) {
				throw new Error('Empresa vinculada à vantagem não possui um usuário associado.');
			}

			await transporter.sendMail({
				from: `"BNP Coin" <${env.GMAIL_USER}>`,
				to: vantagem.empresa.user.email,
				subject: '📦 Vantagem Resgatada - Ação Necessária',
				text: `Uma vantagem foi resgatada! Código de resgate: ${resgate.codigo_resgate}`,
				html: resgateEmpresaHtml(vantagem.descricao, valorVantagem, resgate.codigo_resgate)
			});

			return {
				message: 'Vantagem resgatada com sucesso!',
				novoSaldo: aluno.saldo - valorVantagem
			};
		});
	}
};
