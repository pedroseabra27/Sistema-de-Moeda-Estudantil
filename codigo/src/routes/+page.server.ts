import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const user = locals.session?.user;

    if (!user) {
        throw redirect(303, '/login');
    }

    if (user.role === 'professor') {
        throw redirect(303, '/professor');
    } else if (user.role === 'estudante') {
        throw redirect(303, '/aluno');
    } else if (user.role === 'empresa') {
        throw redirect(303, '/empresa');
    } else if (user.role === 'admin' || user.role === 'user') {
        throw redirect(303, '/admin/alunos');
    }

    return {};
}) satisfies PageServerLoad;