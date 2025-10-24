import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { alunoT, professorT } from '../schema';

export const transacaoT = pgTable('transacao', {
	id: text('id').primaryKey(),
	motivo: text('motivo').notNull(),
	data: timestamp('data').defaultNow().notNull(),
	valor: integer('valor').notNull().default(1000),
	professorId: integer('professor_id').references(() => professorT.id),
	alunoId: integer('aluno_id').references(() => alunoT.id)
});


export type SelectTransacao = typeof transacaoT.$inferSelect;
export type InsertTransacao = typeof transacaoT.$inferInsert;