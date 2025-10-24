import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { alunoT, professorT } from '../schema';

export const transacaoT = pgTable('transacao', {
	id: text('id').primaryKey(),
	motivo: text('motivo').notNull(),
	data: timestamp('data').defaultNow().notNull(),
	valor: integer('valor').notNull().default(1000),
	professorCPF: text('professor_cpf').references(() => professorT.cpf),
	alunoCPF: text('aluno_cpf').references(() => alunoT.cpf)
});


export type SelectTransacao = typeof transacaoT.$inferSelect;
export type InsertTransacao = typeof transacaoT.$inferInsert;