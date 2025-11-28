import { command, query } from '$app/server';
import { vantagemModel } from '$lib/server/db/vantagem/model';
import { transacaoModel } from '$lib/server/db/transacao/model';
import type { InsertVantagem } from '$lib/server/db/vantagem/schema';
import z from 'zod';

export const listarVantagens = query(async () => {
	return await vantagemModel.listar();
});

export type ListarVantagesWithEmpresa = Awaited<ReturnType<typeof listarVantagens>>[number];

export const listarVantagensPorEmpresa = query(z.number(), async (empresaId) => {
	return await vantagemModel.listarPorEmpresa(empresaId);
});

export const inserirVantagem = command(z.custom<InsertVantagem>(), async (info) => {

	await vantagemModel.criar(info);
	await listarVantagensPorEmpresa(info.empresa_id).refresh();
});

export const editarVantagem = command(
	z.object({
		id: z.number(),
		info: z.custom<Partial<InsertVantagem>>()
	}),
	async ({ id, info }) => {
		if (!info.empresa_id) {
			throw new Error('empresa_id é obrigatório para editar uma vantagem.');
		}
		await vantagemModel.atualizar(id, info);
		await listarVantagensPorEmpresa(info.empresa_id).refresh();
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
