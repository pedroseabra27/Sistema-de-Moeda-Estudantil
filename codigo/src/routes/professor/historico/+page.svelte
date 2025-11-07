<script lang="ts">
	import {
		listarTransacoes,
		listarTransacoesPorProfessor
	} from '$lib/client/controller/transacao.remote';
	import { X } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { formatCurrency } from '$lib/client/utils';

	let { data }: PageProps = $props();

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

</script>

<div class="min-h-screenp-4 md:p-6">
	<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">Histórico de Transações</h1>
			<p class="text-gray-600">Visualize todas as transações do sistema</p>
		</div>
	</div>

	<div class="card border border-base-200 bg-base-100 shadow-md">
		<div class="card-body">
			{#await listarTransacoesPorProfessor(data.professor.id)}
				<div class="flex items-center justify-center py-12">
					<div class="text-center">
						<span class="loading loading-spinner loading-lg text-primary"></span>
						<p class="mt-4">Carregando transações...</p>
					</div>
				</div>
			{:then transacoes}
				{#if transacoes.length === 0}
					<div class="alert">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="stroke-info h-6 w-6 shrink-0"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<span>Nenhuma transação encontrada.</span>
					</div>
				{:else}
					<div class="mb-4 flex items-center justify-between">
						<div class="text-sm">
							Mostrando <span class="font-bold">{transacoes.length}</span> transações
						</div>
					</div>

					<div class="overflow-x-auto">
						<table class="table-zebra table w-full">
							<thead>
								<tr class="bg-base-200">
									<th class="rounded-tl-lg">ID</th>
									<th>Data</th>
									<th>Valor</th>
									<th>Motivo</th>
									<!-- <th class="rounded-tr-lg text-center">Ações</th> -->
								</tr>
							</thead>
							<tbody>
								{#each transacoes as transacao (transacao.id)}
									<tr class="hover:bg-base-200 transition-colors duration-150">
										<td class="font-medium">{transacao.id.slice(0, 8)}...</td>
										<td>{formatDate(transacao.data)}</td>
										<td>
											<p class="badge badge-success">
												{formatCurrency(transacao.valor)}
											</p>
										</td>
										<td>{transacao.motivo}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{:catch error}
				<div class="alert alert-error">
					<X />
					<div>
						<div class="font-bold">Erro ao carregar transações</div>
						<div class="text-xs">{error.message}</div>
					</div>
				</div>
			{/await}
		</div>
	</div>
</div>
