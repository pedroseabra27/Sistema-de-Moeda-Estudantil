import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';


import * as authSchema from './auth-schema';
import * as alunoSchema from './aluno/schema';
import * as professorSchema from './professor/schema';
import * as empresaSchema from './empresa/schema';
import * as vantagemSchema from './vantagem/schema'; 

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}


const schema = {
	...authSchema,
	...alunoSchema,
	...professorSchema,
	...empresaSchema,
	...vantagemSchema
};

const client = postgres(env.DATABASE_URL);


export const db = drizzle(client, { schema, logger: true });