import { db } from '$lib/server/db';
import { empresaT } from '$lib/server/db/empresa/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = locals.session

	if (!session) {
		throw redirect(302, '/login');
	}
	const empresa = await db.query.empresaT.findFirst({
		where: eq(empresaT.user_id, session.user.id)
	});

	if (!empresa) {
		throw redirect(302, '/login');
	}

	return {
		user: session.user,
		empresa
	};
};
