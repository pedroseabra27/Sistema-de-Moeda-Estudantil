import { eq } from 'drizzle-orm';
import { db } from '..';
import { alunoT, type InsertAluno, type SelectAluno } from './schema';

export const alunoModel = {
	listar: async () => {
		return await db.query.alunoT.findMany();
	},
	criar: async (info: InsertAluno) => {
		return await db.insert(alunoT).values(info);
	},
	atualizar: async (id: SelectAluno['id'], newInfo: Partial<InsertAluno>) => {
		return await db.update(alunoT).set(newInfo).where(eq(alunoT.id, id));
	},
	deletar: async (id: SelectAluno['id']) => {
		return await db.delete(alunoT).where(eq(alunoT.id, id));
	}
};
