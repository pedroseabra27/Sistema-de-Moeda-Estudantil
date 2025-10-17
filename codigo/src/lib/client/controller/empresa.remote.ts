import { command, query } from '$app/server';
import { empresaModel } from '$lib/server/db/empresa/model';
import type { InsertEmpresa } from '$lib/server/db/schema';
import z from 'zod';

export const listarEmpresa = query(async () => {
	return await empresaModel.listar();
});

export const criarEmpresa = command(z.custom<InsertEmpresa>(), async (info) => {
	return await empresaModel.criar(info);
});

export const empresaController = query(() => ({
	listar: query(async () => {
		return await empresaModel.listar();
	}),
	criar: command(z.custom<InsertEmpresa>(), async (info) => {
		return await empresaModel.criar(info);
	}),
	atualizar: command(
		z.object({
			id: z.number(),
			info: z.custom<Partial<InsertEmpresa>>()
		}),
		async (info) => {
			return await empresaModel.atualizar(info.id, info);
		}
	),
	deletar: command(z.number(), async (id) => {
		return await empresaModel.deletar(id);
	})
}));
