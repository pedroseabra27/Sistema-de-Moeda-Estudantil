
import { db } from '$lib/server/db';
import { alunoT } from '$lib/server/db/aluno/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals}) => {
	const session = locals.session

	if (!session) {
		throw redirect(302, '/login');
	}
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
