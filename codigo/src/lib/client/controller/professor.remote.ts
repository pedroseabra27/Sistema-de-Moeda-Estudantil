import { command, query } from '$app/server';
import { z } from 'zod';

import { professorModel } from '$lib/server/db/professor/model';
import { alunoModel } from '$lib/server/db/aluno/model';
import { transacaoModel } from '$lib/server/db/transacao/model';

export const listarProfessores = query(async () => {
	return await professorModel.listar();
});

export const listarAlunosParaTransferencia = query(async () => {
	return await alunoModel.listar()
});

export type AlunoWithUser = Awaited<ReturnType<typeof listarAlunosParaTransferencia>>[number];

export const getProfessorData = query(
	z.number().min(1, 'ID é obrigatório'),
	async (cpf) => {
		const data = await professorModel.buscarPorId(cpf);
		if (!data) throw new Error('Professor não encontrado');

		return data
	}
);


export const getHistoricoProfessor = query(
	z.number().min(1, 'CPF é obrigatório'),
	async (cpf) => {
		const transacoes = await transacaoModel.listarPorProfessor(cpf);
		return transacoes
	}
);

export const enviarMoedas = command(
	z.object({
		professorId: z.number().min(1, 'ID do professor é obrigatório'),
		alunoId: z.number().min(1, 'Aluno é obrigatório'),
		quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
		motivo: z.string().min(1, 'Motivo é obrigatório')
	}),
	async (data) => {

		await transacaoModel.realizarTransferencia({
			professorId: data.professorId,
			alunoId: data.alunoId,
			valor: data.quantidade,
			motivo: data.motivo
		});


		await listarAlunosParaTransferencia().refresh();
	}
);