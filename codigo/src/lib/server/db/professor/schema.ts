import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';

export const professor = pgTable('professor', {
  cpf: text('cpf').primaryKey(),
  departamento: text('departamento').notNull(),
  saldo: integer('saldo').default(1000).notNull(),
  userId: text('user_id').references(() => user.id).notNull(),
});

export const transacao = pgTable('transacao', {
  id: text('id').primaryKey(),
  motivo: text('motivo').notNull(),
  data: timestamp('data').defaultNow().notNull(),
  valor: integer('valor').notNull(),
  professorCPF: text('professor_cpf').references(() => professor.cpf),
  alunoCPF: text('aluno_cpf')
});