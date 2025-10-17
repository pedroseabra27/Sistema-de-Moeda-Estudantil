import { command, query } from '$app/server';
import { empresaModel } from '$lib/server/db/empresa/model';
import type { InsertEmpresa } from '$lib/server/db/schema';
import z from 'zod';

export const empresaController = query(() => ({
	listar: query(() => {
		return empresaModel.listar();
	}),
	criar: command(z.custom<InsertEmpresa>(), (info) => {
		return empresaModel.criar(info);
	}),
	atualizar: command(
		z.object({
			id: z.number(),
			info: z.custom<Partial<InsertEmpresa>>()
		}),
		(info) => {
			return empresaModel.atualizar(info.id, info);
		}
	),
	deletar: command(z.number(), (id) => {
		return empresaModel.deletar(id);
	})
}))
