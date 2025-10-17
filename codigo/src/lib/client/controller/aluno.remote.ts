import { command, query } from '$app/server';
import { alunoModel } from '$lib/server/db/aluno/model';
import type { InsertAluno } from '$lib/server/db/schema';
import z from 'zod';

export const listarAlunos = query(async () => {
	return await alunoModel.listar();
});

export const inserirAluno = command(z.custom<InsertAluno>(), async (info) => {
	return await alunoModel.criar(info);
});

// export const alunoController = query(() => ({
// 	listar: query(async () => {
// 		return await alunoModel.listar();
// 	}),
// 	criar: command(z.custom<InsertAluno>(), async (info) => {
// 		return await alunoModel.criar(info);
// 	}),
// 	atualizar: command(
// 		z.object({
// 			id: z.number(),
// 			info: z.custom<Partial<InsertAluno>>()
// 		}),
// 		async (info) => {
// 			return await alunoModel.atualizar(info.id, info);
// 		}
// 	),
// 	deletar: command(z.number(), async (id) => {
// 		return await alunoModel.deletar(id);
// 	})
// }));
