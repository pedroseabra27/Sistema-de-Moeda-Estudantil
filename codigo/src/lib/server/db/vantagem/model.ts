import { eq } from 'drizzle-orm';
import { db } from '..';
import { vantagemT, type InsertVantagem, type SelectVantagem } from './schema';

export const vantagemModel = {
	listar: async () => {
		return await db.query.vantagemT.findMany({
			with: {
				empresa: {
					with: {
						user: {
							columns: {
								name: true
							}
						}
					}
				}
			},
			orderBy: (v, { asc }) => [asc(v.valor)]
		});
	},
	listarPorEmpresa: async (empresaId: number) => {
		return await db.query.vantagemT.findMany({
			where: eq(vantagemT.empresa_id, empresaId),
			with: {
				empresa: true
			}
		});
	},
	criar: async (info: InsertVantagem) => {
		return await db.insert(vantagemT).values(info);
	},
	atualizar: async (id: SelectVantagem['id'], newInfo: Partial<InsertVantagem>) => {
		return await db.update(vantagemT).set(newInfo).where(eq(vantagemT.id, id));
	},
	deletar: async (id: SelectVantagem['id']) => {
		return await db.delete(vantagemT).where(eq(vantagemT.id, id));
	}
};