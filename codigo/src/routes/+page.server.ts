import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const user = locals.session?.user;

    if (!user) {
        throw redirect(303, '/login');
    }

    if (user.role === 'professor') {
        throw redirect(303, '/professor');
    }
    if (user.role === 'estudante') {
        throw redirect(303, '/aluno');
    }
    if (user.role === 'empresa') {
        throw redirect(303, '/empresa');
    }

    return {};
}) satisfies PageServerLoad;