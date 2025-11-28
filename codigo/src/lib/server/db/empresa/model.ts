import { eq } from 'drizzle-orm';
import { db } from '..';
import { empresaT, type InsertEmpresa, type SelectEmpresa } from './schema';
import { user } from '../auth-schema';

export const empresaModel = {
	listar: async () => {
		return await db.query.empresaT.findMany();
	},
	criar: async (info: InsertEmpresa) => {
		return await db.transaction(async (tx) => {
			if (!info.user_id) {
				throw new Error('user_id is required to create an empresa');
			}
			await tx.insert(empresaT).values(info).returning();
			return await tx.update(user).set({ role: 'empresa' }).where(eq(user.id, info.user_id)).returning();
		});
	},
	atualizar: async (id: SelectEmpresa['id'], newInfo: Partial<InsertEmpresa>) => {
		return await db.update(empresaT).set(newInfo).where(eq(empresaT.id, id));
	},
	deletar: async (id: SelectEmpresa['id']) => {
		return await db.delete(empresaT).where(eq(empresaT.id, id));
	}
};
