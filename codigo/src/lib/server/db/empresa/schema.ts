import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

export const empresaT = pgTable('empresa', {
	id: serial('id').primaryKey().notNull(),
	cnpj: text('cnpj').notNull(),
	user_id: text('user_id').references(() => user.id)
});

export const empresaRelations = relations(empresaT, ({ one }) => ({
	user: one(user, {
		fields: [empresaT.user_id],
		references: [user.id],
	}),
}));

export type SelectEmpresa = typeof empresaT.$inferSelect;
export type InsertEmpresa = typeof empresaT.$inferInsert;
