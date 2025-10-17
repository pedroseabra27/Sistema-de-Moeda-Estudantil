import { command, query } from '$app/server';
import { empresaModel } from '$lib/server/db/empresa/model';
import type { InsertEmpresa } from '$lib/server/db/schema';
import z from 'zod';

export const listarEmpresas = query(async () => {
	return await empresaModel.listar();
});

export const inserirEmpresa = command(z.custom<InsertEmpresa>(), async (info) => {
	await empresaModel.criar(info);
	await listarEmpresas().refresh();
});

export const editarEmpresa = command(
	z.object({
		id: z.number(),
		info: z.object({
			nome: z.string().optional(),
			cnpj: z.string().optional(),
			saldo: z.number().optional()
		})
	}),
	async ({ id, info }) => {
		await empresaModel.atualizar(id, info);
		await listarEmpresas().refresh();
	}
);

export const excluirEmpresa = command(z.number(), async (id) => {
	await empresaModel.deletar(id);
	await listarEmpresas().refresh();
});
