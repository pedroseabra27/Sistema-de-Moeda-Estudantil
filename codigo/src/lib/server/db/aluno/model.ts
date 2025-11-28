import { eq } from 'drizzle-orm';
import { db } from '..';
import { alunoT, type InsertAluno, type SelectAluno } from './schema';
import { user } from '../auth-schema';

export const alunoModel = {
	listar: async () => {
		return await db.query.alunoT.findMany({
			with: {
				user: true
			},
			orderBy: (t, { desc }) => [desc(t.saldo)]
		});
	},
	buscarPorId: async (id: SelectAluno['id']) => {
		return await db.query.alunoT.findFirst({
			where: eq(alunoT.id, id)
		});
	},
	criar: async (info: InsertAluno) => {
		return await db.transaction(async (tx) => {
			await tx.insert(alunoT).values(info).returning();

			return await tx.update(user).set({ role: 'estudante' }).where(eq(user.id, info.user_id)).returning();
		})
	},
	atualizar: async (id: SelectAluno['id'], newInfo: Partial<InsertAluno>) => {
		return await db.update(alunoT).set(newInfo).where(eq(alunoT.id, id));
	},
	deletar: async (id: SelectAluno['id']) => {
		return await db.delete(alunoT).where(eq(alunoT.id, id));
	}
};
