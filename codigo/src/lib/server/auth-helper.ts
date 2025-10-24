import { auth } from '$lib/server/auth';
import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (!session) {
		throw redirect(302, '/login');
	}

	return session;
}
