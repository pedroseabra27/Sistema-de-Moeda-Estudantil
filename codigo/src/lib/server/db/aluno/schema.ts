import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

export const alunoT = pgTable('alunoT', {
	id: serial('id').primaryKey().notNull(),
	cpf: text('cpf').unique().notNull(),
	endereco: text('endereco'),
	curso: text('curso').notNull(),
	saldo: integer('saldo').default(0).notNull(),
	user_id: text('user_id')
		.references(() => user.id)
		.notNull()
});

export const alunoRelations = relations(alunoT, ({ one }) => ({
	user: one(user, {
		fields: [alunoT.user_id],
		references: [user.id]
	})
}));

export type SelectAluno = typeof alunoT.$inferSelect;
export type InsertAluno = typeof alunoT.$inferInsert;
