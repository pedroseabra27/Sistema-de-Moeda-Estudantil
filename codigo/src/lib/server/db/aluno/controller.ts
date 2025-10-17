import { alunoModel } from './model';
import type { InsertAluno, SelectAluno } from './schema';

export const alunoController = {
	listarTodos: async () => {
		return await alunoModel.listar();
	},
	criarAluno: async (info: InsertAluno) => {
		return await alunoModel.criar(info);
	},
	atualizarAluno: async (id: SelectAluno['id'], newInfo: Partial<InsertAluno>) => {
		return await alunoModel.atualizar(id, newInfo);
	},
	deletarAluno: async (id: SelectAluno['id']) => {
		return await alunoModel.deletar(id);
	}
};
