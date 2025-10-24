import { db } from '$lib/server/db';
import { professor } from './schema';
import { eq } from 'drizzle-orm';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

type Professor = InferSelectModel<typeof professor>;
type ProfessorInsert = InferInsertModel<typeof professor>;
type ProfessorUpdate = Partial<Omit<ProfessorInsert, 'cpf'>>;

export const professorModel = {
	async buscarPorCpf(cpf: string): Promise<Professor | undefined> {
		const result = await db.select().from(professor).where(eq(professor.cpf, cpf)).limit(1);
		return result[0];
	},

	async listar(): Promise<Professor[]> {
		return await db.select().from(professor);
	},

	async criar(info: ProfessorInsert): Promise<void> {
		await db.insert(professor).values(info);
	},

	async atualizar(cpf: string, info: ProfessorUpdate): Promise<void> {
		if (Object.keys(info).length === 0) return;
		await db.update(professor).set(info).where(eq(professor.cpf, cpf));
	},

	async deletar(cpf: string): Promise<void> {
		await db.delete(professor).where(eq(professor.cpf, cpf));
	}
};