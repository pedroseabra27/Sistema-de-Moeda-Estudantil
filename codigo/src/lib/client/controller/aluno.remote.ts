import { command, query } from '$app/server';
import { alunoModel } from '$lib/server/db/aluno/model';
import type { InsertAluno } from '$lib/server/db/schema';
import z from 'zod';

export const listarAlunos = query(async () => {
	return await alunoModel.listar();
});

export const inserirAluno = command(z.custom<InsertAluno>(), async (info) => {
	await alunoModel.criar(info);
	await listarAlunos().refresh();
});

export const editarAluno = command(
	z.object({
		id: z.number(),
		info: z.object({
			cpf: z.string().optional(),
			curso: z.string().optional(),
			endereco: z.string().nullable().optional(),
			saldo: z.number().optional()
		})
	}),
	async ({ id, info }) => {
		await alunoModel.atualizar(id, info);
		await listarAlunos().refresh();
	}
);

export const excluirAluno = command(z.number(), async (id) => {
	await alunoModel.deletar(id);
	await listarAlunos().refresh();
});
