import { requireAuth } from '$lib/server/auth-helper';
import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await requireAuth(event);

	const aluno = await db.query.alunoT.findFirst({
		where: eq(alunoT.user_id, session.user.id)
	});

	if (!aluno) {
		throw redirect(302, '/login');
	}

	return {
		user: session.user,
		aluno
	};
};
