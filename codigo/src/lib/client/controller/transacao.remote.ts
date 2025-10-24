import { query } from "$app/server";
import { transacaoModel } from "$lib/server/db/transacao/model";
import z from "zod";

export const listarTransacoes = query(async () => {
    return await transacaoModel.listar();
});

export const listarTransacoesPorProfessor = query(z.number(), async (id: number) => {
    return await transacaoModel.listarPorProfessor(id);
});

export const listarTransacoesPorAluno = query(z.number(), async (id: number) => {
	return await transacaoModel.listarPorAluno(id);
});

export const listarResgatesAluno = query(z.number(), async (id: number) => {
	return await transacaoModel.listarResgatesPorAluno(id);
});