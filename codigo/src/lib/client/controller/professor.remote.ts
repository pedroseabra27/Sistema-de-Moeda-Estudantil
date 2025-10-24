import { command, query } from '$app/server';
import { z } from 'zod';

import { professorModel } from '$lib/server/db/professor/model';
import { alunoModel } from '$lib/server/db/aluno/model';
import { transacaoModel } from '$lib/server/db/transacao/model';
import type { SelectAluno } from '$lib/server/db/aluno/schema';

export const listarProfessores = query(async () => {
	
	return await professorModel.listar();
});

export const listarAlunosParaTransferencia = query(async () => {
	return (await alunoModel.listar()) as SelectAluno[];
});

export const getProfessorData = query(
	z.string().min(1, 'CPF é obrigatório'),
	async (cpf) => {
		const data = await professorModel.buscarPorCpf(cpf);
		if (!data) throw new Error('Professor não encontrado');

		return {
			...data,
			ultimaAtualizacao: new Date()
		};
	}
);


export const getHistoricoProfessor = query(
	z.string().min(1, 'CPF é obrigatório'),
	async (cpf) => {
		const transacoes = await transacaoModel.listarPorProfessor(cpf);
		return transacoes.map((t) => ({
			...t,
			data: new Date(t.data) 
		}));
	}
);


export const enviarMoedas = command(
	z.object({
		professorCpf: z.string().min(1, 'CPF do professor é obrigatório'),
		alunoId: z.number().min(1, 'Aluno é obrigatório'),
		quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
		motivo: z.string().min(1, 'Motivo é obrigatório')
	}),
	async (data) => {
		
		await transacaoModel.realizarTransferencia({
			professorCpf: data.professorCpf,
			alunoId: data.alunoId,
			valor: data.quantidade,
			motivo: data.motivo
		});

		
		await getProfessorData(data.professorCpf).refresh();
		await getHistoricoProfessor(data.professorCpf).refresh();
	}
);