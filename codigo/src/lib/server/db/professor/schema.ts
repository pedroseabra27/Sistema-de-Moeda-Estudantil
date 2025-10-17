import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const professorT = pgTable('professor', {
	cpf: text('cpf').notNull(),
	id: serial('id').notNull().primaryKey(),
	departamento: text('departamento').notNull(),
	saldo: integer('saldo').default(0).notNull()
});
