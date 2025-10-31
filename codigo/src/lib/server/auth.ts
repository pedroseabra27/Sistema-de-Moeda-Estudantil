import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { admin as adminPlugin } from 'better-auth/plugins';
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { createAccessControl } from 'better-auth/plugins/access';

const statement = {
	...defaultStatements,
	order: ['create', 'share', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
	order: ['create', 'share', 'update', 'delete'],
	...adminAc.statements,
})

export const estudante = ac.newRole({
	order: ['create', 'share', 'update', 'delete'],
})


export const professor = ac.newRole({
	order: ['create', 'share', 'update', 'delete'],
})

export const empresa = ac.newRole({
	order: ['create', 'share', 'update', 'delete'],
})

export const roles = {
	estudante,
	professor,
	empresa,
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: { ...schema, users: schema.user }
	}),
	plugins: [adminPlugin({
		ac: ac,
		roles

	}), sveltekitCookies(getRequestEvent)],
	emailAndPassword: {
		enabled: true
	},
	advanced: {
		disableCSRFCheck: true
	}
});
