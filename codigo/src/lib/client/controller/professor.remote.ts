import { command, query } from '$app/server';
import { z } from 'zod';

// Importa os MODELS do servidor
import { professorModel } from '$lib/server/db/professor/model';
import { alunoModel } from '$lib/server/db/aluno/model';
import { transacaoModel } from '$lib/server/db/transacao/model';
import type { SelectAluno } from '$lib/server/db/aluno/schema';

// =================================================================
// QUERIES (Busca de dados)
// =================================================================

/**
 * (Query) Busca TODOS os professores (para o Admin selecionar).
 */
export const listarProfessores = query(async () => {
	// NOTA: Para exibir o NOME do professor no <select>,
	// 'professorModel.listar()' precisa de um JOIN com a tabela 'user'.
	return await professorModel.listar();
});

/**
 * (Query) Busca TODOS os alunos (para o formulário de transferência).
 */
export const listarAlunosParaTransferencia = query(async () => {
	return (await alunoModel.listar()) as SelectAluno[];
});

/**
 * (Query) Busca os dados de um professor específico.
 */
export const getProfessorData = query(
	z.string().min(1, 'CPF é obrigatório'),
	async (cpf) => {
		const data = await professorModel.buscarPorCpf(cpf);
		if (!data) throw new Error('Professor não encontrado');

		return {
			...data,
			// Adicionamos isso para corresponder à sua UI
			ultimaAtualizacao: new Date()
		};
	}
);

/**
 * (Query) Busca o histórico de transações de um professor específico.
 */
export const getHistoricoProfessor = query(
	z.string().min(1, 'CPF é obrigatório'),
	async (cpf) => {
		const transacoes = await transacaoModel.listarPorProfessor(cpf);
		return transacoes.map((t) => ({
			...t,
			data: new Date(t.data) // Converte string de data para objeto Date
		}));
	}
);

// =================================================================
// COMMAND (Ação de escrita)
// =================================================================

/**
 * (Command) Executa a transferência de moedas.
 */
export const enviarMoedas = command(
	z.object({
		professorCpf: z.string().min(1, 'CPF do professor é obrigatório'),
		alunoId: z.number().min(1, 'Aluno é obrigatório'),
		quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
		motivo: z.string().min(1, 'Motivo é obrigatório')
	}),
	async (data) => {
		// A lógica de transação segura está no model
		await transacaoModel.realizarTransferencia({
			professorCpf: data.professorCpf,
			alunoId: data.alunoId,
			valor: data.quantidade,
			motivo: data.motivo
		});

		// Invalida os caches das queries reativas.
		await getProfessorData(data.professorCpf).refresh();
		await getHistoricoProfessor(data.professorCpf).refresh();
	}
);