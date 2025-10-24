import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { professorT, type InsertProfessor } from './schema';

export const professorModel = {
	async buscarPorCpf(cpf: string){
		const result = await db.select().from(professorT).where(eq(professorT.cpf, cpf)).limit(1);
		return result[0];
	},

	async listar() {
		return await db.select().from(professorT);
	},

	async criar(info: InsertProfessor){
		await db.insert(professorT).values(info);
	},

	async atualizar(cpf: string, info: Partial<InsertProfessor>) {
		if (Object.keys(info).length === 0) return;
		await db.update(professorT).set(info).where(eq(professorT.cpf, cpf));
	},

	async deletar(cpf: string): Promise<void> {
		await db.delete(professorT).where(eq(professorT.cpf, cpf));
	}
};