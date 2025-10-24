import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ locals }) => {

    if (!locals.session) {
        throw redirect(303, '/login');
    }

    const user = locals.session?.user;

    // if (user.role !== 'professor') {
    //     console.error('User is not a professor:', user);
    //     throw redirect(303, '/');
    // }

    const professor = await db.query.professorT.findFirst({
        where: (professor, { eq }) => eq(professor.userId, user.id),
    })

    if (!professor) {
        console.error('Professor not found for user id:', user.id);
        throw redirect(303, '/');
    }

    return { professor,user };
}) satisfies LayoutServerLoad;