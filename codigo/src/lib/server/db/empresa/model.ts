import { eq } from 'drizzle-orm';
import { db } from '..';
import { empresaT, type InsertEmpresa, type SelectEmpresa } from './schema';

export const empresaModel = {
	listar: async () => {
		return await db.query.empresaT.findMany();
	},
	criar: async (info: InsertEmpresa) => {
		return await db.insert(empresaT).values(info);
	},
	atualizar: async (id: SelectEmpresa['id'], newInfo: Partial<InsertEmpresa>) => {
		return await db.update(empresaT).set(newInfo).where(eq(empresaT.id, id));
	},
	deletar: async (id: SelectEmpresa['id']) => {
		return await db.delete(empresaT).where(eq(empresaT.id, id));
	}
};
