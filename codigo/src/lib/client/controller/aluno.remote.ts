import { command, query } from '$app/server';
import { alunoModel } from '$lib/server/db/aluno/model';
import type { InsertAluno } from '$lib/server/db/schema';
import z from 'zod';

export const alunoController = query(() => ({
	listar: query(() => {
		return alunoModel.listar();
	}),
	criar: command(z.custom<InsertAluno>(), (info) => {
		return alunoModel.criar(info);
	}),
	atualizar: command(
		z.object({
			id: z.number(),
			info: z.custom<Partial<InsertAluno>>()
		}),
		(info) => {
			return alunoModel.atualizar(info.id, info);
		}
	),
	deletar: command(z.number(), (id) => {
		return alunoModel.deletar(id);
	})
}))