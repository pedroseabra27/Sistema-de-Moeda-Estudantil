import { query } from '$app/server';
import { transacaoModel } from '$lib/server/db/transacao/model';
import z from 'zod';

export const listarExtratoAluno = query(z.number(), async (alunoId) => {
	return await transacaoModel.listarExtratoAluno(alunoId);
});

export const listarResgatesAluno = query(z.number(), async (alunoId) => {
	return await transacaoModel.listarResgatesPorAluno(alunoId);
});
