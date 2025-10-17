import { command, query } from '$app/server';
import { alunoModel } from '$lib/server/db/aluno/model';
import type { InsertAluno } from '$lib/server/db/schema';
import z from 'zod';

export const listarAlunos = query(async () => {
	return await alunoModel.listar();
});

export const inserirAluno = command(z.custom<InsertAluno>(), async (info) => {
	await alunoModel.criar(info);
	listarAlunos().refresh();
});

export const editarAluno = command(
	z.object({
		id: z.number(),
		info: z.custom<Partial<InsertAluno>>()
	}),
	async (info) => {
		await alunoModel.atualizar(info.id, info);
		listarAlunos().refresh();
	}
);

export const excluirAluno = command(z.number(), async (id) => {
	await alunoModel.deletar(id);
	listarAlunos().refresh();
});
