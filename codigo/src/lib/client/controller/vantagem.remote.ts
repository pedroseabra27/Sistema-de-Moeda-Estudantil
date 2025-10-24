import { command, query } from '$app/server';
import { vantagemModel } from '$lib/server/db/vantagem/model';
import { transacaoModel } from '$lib/server/db/transacao/model';
import type { InsertVantagem } from '$lib/server/db/vantagem/schema';
import z from 'zod';

export const listarVantagens = query(async () => {
	return await vantagemModel.listar();
});

export const listarVantagensPorEmpresa = query(z.number(), async (empresaId) => {
	return await vantagemModel.listarPorEmpresa(empresaId);
});

export const inserirVantagem = command(z.custom<InsertVantagem>(), async (info) => {
	await vantagemModel.criar(info);
	await listarVantagens().refresh();
});

export const editarVantagem = command(
	z.object({
		id: z.number(),
		info: z.object({
			descricao: z.string().optional(),
			valor: z.string().optional()
		})
	}),
	async ({ id, info }) => {
		await vantagemModel.atualizar(id, info);
		await listarVantagens().refresh();
	}
);

export const excluirVantagem = command(z.number(), async (id) => {
	await vantagemModel.deletar(id);
	await listarVantagens().refresh();
});

export const resgatarVantagem = command(
	z.object({
		alunoId: z.number(),
		vantagemId: z.number()
	}),
	async ({ alunoId, vantagemId }) => {
		await transacaoModel.resgatarVantagem(alunoId, vantagemId);
		await listarVantagens().refresh();
	}
);
