import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';
import { admin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: { ...schema, users: schema.user }
	}),
	plugins: [admin(), sveltekitCookies(getRequestEvent)],
	emailAndPassword: {
		enabled: true
	},
	advanced: {
		disableCSRFCheck: true
	}
});
