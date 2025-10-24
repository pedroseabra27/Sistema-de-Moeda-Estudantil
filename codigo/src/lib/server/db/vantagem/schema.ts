import { pgTable, serial, text, integer, decimal } from 'drizzle-orm/pg-core';
import { empresaT } from '../empresa/schema';

export const vantagemT = pgTable('vantagem', {
	id: serial('id').primaryKey().notNull(),
	descricao: text('descricao').notNull(),
	valor: decimal('valor', { precision: 10, scale: 2 }).notNull(), 
	empresa_id: integer('empresa_id').references(() => empresaT.id).notNull()
});

export type SelectVantagem = typeof vantagemT.$inferSelect;
export type InsertVantagem = typeof vantagemT.$inferInsert;