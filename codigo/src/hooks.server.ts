import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleUser: Handle = async ({ event, resolve }) => {
	const { request } = event;

	console.log(`${request.method}: ${new URL(request.url).pathname}`);

	try {
		const session = await auth.api.getSession({ headers: request.headers });

		if (session) {
			event.locals.session = session;
		}
	} catch (error) {
		console.error(error);
	}
	return resolve(event);
};

const authHandler: Handle = ({ event, resolve }) =>
	svelteKitHandler({ event, resolve, auth, building });

const handleCors: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set(
		'Access-Control-Allow-Origin',
		'https://sistema-de-aluguel-de-carros-production.up.railway.app'
	);
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.set('Access-Control-Allow-Credentials', 'true');
	return response;
};

export const handle = sequence(handleCors, authHandler, handleUser);
