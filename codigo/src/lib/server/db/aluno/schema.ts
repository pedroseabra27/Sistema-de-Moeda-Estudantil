import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const alunoT = pgTable("alunoT", {
    id: serial("id").primaryKey().notNull(),
    cpf: text("cpf").unique().notNull(),
    endereco: text("endereco"),
    curso: text("curso").notNull(),
    saldo: integer("saldo").default(0),
})

export type SelectAluno = typeof alunoT.$inferSelect
export type InsertAluno = typeof alunoT.$inferInsert