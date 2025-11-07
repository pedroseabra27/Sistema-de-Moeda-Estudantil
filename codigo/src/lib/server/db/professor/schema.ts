import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';
import { transacaoT } from '../schema';

export const professorT = pgTable('professor', {
	cpf: text('cpf').notNull(),
	id: serial('id').notNull().primaryKey(),
	departamento: text('departamento').notNull(),
	saldo: integer('saldo').default(1000).notNull(),
	userId: text('user_id')
		.references(() => user.id)
});

export const professorRelations = relations(professorT, ({ many, one }) => ({
	user: one(user, {
		fields: [professorT.userId],
		references: [user.id]
	}),
	transacoes: many(transacaoT)
}));

export type SelectProfessor = typeof professorT.$inferSelect;
export type InsertProfessor = typeof professorT.$inferInsert;