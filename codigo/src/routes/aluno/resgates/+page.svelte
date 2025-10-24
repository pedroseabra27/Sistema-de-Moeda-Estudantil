<script lang="ts">
	import { listarResgatesAluno } from '$lib/client/controller/transacao.remote';
	import type { SelectTransacao } from '$lib/server/db/transacao/schema';
	import { Gift, Calendar, Coins, Package } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let alunoId = $derived(data.aluno.id);
	let resgates = $state<SelectTransacao[]>([]);
	let isLoading = $state(false);

	$effect(() => {
		carregarResgates();
	});

	async function carregarResgates() {
		isLoading = true;
		try {
			resgates = await listarResgatesAluno(alunoId);
		} catch (error) {
			toast.error('Erro ao carregar vantagens resgatadas');
		} finally {
			isLoading = false;
		}
	}

	function formatarData(data: Date): string {
		return new Date(data).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function extrairDescricaoVantagem(motivo: string): string {
		// Remove "Resgate de vantagem: " do início
		return motivo.replace(/^Resgate de vantagem:\s*/i, '');
	}

	const totalGasto = $derived(resgates.reduce((sum, r) => sum + r.valor, 0));
</script>

<div class="p-4">
	<div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">Minhas Vantagens Resgatadas</h1>
			<p class="text-gray-600">Veja todas as vantagens que você já resgatou.</p>
		</div>
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-figure text-primary">
					<Package class="w-8 h-8" />
				</div>
				<div class="stat-title">Total de Resgates</div>
				<div class="stat-value text-primary">{resgates.length}</div>
				<div class="stat-desc">{totalGasto} moedas gastas</div>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="flex justify-center items-center min-h-[400px]">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	{:else if resgates.length === 0}
		<div class="text-center py-12">
			<Gift class="w-16 h-16 mx-auto text-gray-300 mb-4" />
			<p class="text-gray-500 text-lg mb-2">Você ainda não resgatou nenhuma vantagem</p>
			<p class="text-gray-400 text-sm mb-6">
				Visite a página de vantagens para trocar suas moedas por benefícios exclusivos.
			</p>
			<a href="/aluno/vantagens" class="btn btn-primary">
				<Gift class="w-5 h-5" />
				Ver Vantagens Disponíveis
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each resgates as resgate}
				<div class="card border border-base-200 bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
					<div class="card-body">
						<!-- Ícone e Badge -->
						<div class="flex items-start justify-between mb-3">
							<div class="rounded-full bg-primary/10 p-3">
								<Gift class="w-6 h-6 text-primary" />
							</div>
							<div class="badge badge-error badge-lg">
								-{resgate.valor} <Coins class="w-4 h-4 ml-1" />
							</div>
						</div>

						<!-- Descrição da Vantagem -->
						<h3 class="card-title text-base mb-2">
							{extrairDescricaoVantagem(resgate.motivo)}
						</h3>

						<!-- Data de Resgate -->
						<div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
							<Calendar class="w-4 h-4" />
							<span>{formatarData(resgate.data)}</span>
						</div>

						<!-- Detalhes -->
						<div class="divider my-2"></div>
						
						<div class="space-y-1 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-500">ID da Transação:</span>
								<span class="font-mono text-xs">{resgate.id.slice(0, 8)}...</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-500">Custo:</span>
								<span class="font-semibold text-error">{resgate.valor} moedas</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Resumo -->
		<div class="mt-8">
			<div class="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-info shrink-0 w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<div>
					<h3 class="font-bold">Resumo</h3>
					<p class="text-sm">
						Você já resgatou <strong>{resgates.length}</strong>
						{resgates.length === 1 ? 'vantagem' : 'vantagens'}, gastando um total de
						<strong>{totalGasto}</strong> moedas.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
