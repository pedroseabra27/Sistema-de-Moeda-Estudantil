import { requireAuth } from '$lib/server/auth-helper';
import { db } from '$lib/server/db';
import { empresaT } from '$lib/server/db/empresa/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await requireAuth(event);

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
