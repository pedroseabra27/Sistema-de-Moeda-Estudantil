import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';

// 1. Importe TODOS os seus ficheiros de schema, um por um
import * as authSchema from './auth-schema';
import * as alunoSchema from './aluno/schema';
import * as professorSchema from './professor/schema';
import * as empresaSchema from './empresa/schema'; // <--- Adicionei este

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

// 2. Junte TODOS os schemas num único objeto
const schema = {
	...authSchema,
	...alunoSchema,
	...professorSchema,
	...empresaSchema // <--- Adicionei este
};

const client = postgres(env.DATABASE_URL);

// 3. Passe o 'schema' completo e ative o 'logger'
export const db = drizzle(client, { schema, logger: true });