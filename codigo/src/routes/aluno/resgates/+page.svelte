<script lang="ts">
	import Loading from '$lib/client/components/Loading.svelte';
	import { listarResgatesAluno } from '$lib/client/controller/transacao.remote';
	import { formatDate } from '$lib/client/utils';
	import { Gift, Calendar, Coins, Package, AlertTriangle } from '@lucide/svelte';

	let { data } = $props();

	let alunoId = $derived(data.aluno.id);

	function extrairDescricaoVantagem(motivo: string): string {
		// Remove "Resgate de vantagem: " do início
		return motivo.replace(/^Resgate de vantagem:\s*/i, '');
	}
</script>

<div class="p-4">
	{#await listarResgatesAluno(alunoId)}
		<Loading />
	{:then resgates}
		{@const totalGasto = resgates.reduce((sum, r) => sum + r.transacao.valor, 0)}
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-primary mb-2 text-3xl font-bold">Minhas Vantagens Resgatadas</h1>
				<p class="text-gray-600">Veja todas as vantagens que você já resgatou.</p>
			</div>
			<div class="stats shadow">
				<div class="stat">
					<div class="stat-figure text-primary">
						<Package class="h-8 w-8" />
					</div>
					<div class="stat-title">Total de Resgates</div>
					<div class="stat-value text-primary">{resgates.length}</div>
					<div class="stat-desc">{totalGasto} moedas gastas</div>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each resgates as resgate}
				<div
					class="card border-base-200 bg-base-100 border shadow-lg transition-shadow hover:shadow-xl"
				>
					<div class="card-body">
						<div class="mb-3 flex items-start justify-between">
							<div class="bg-primary/10 rounded-full p-3">
								<Gift class="text-primary h-6 w-6" />
							</div>
							<div class="badge badge-error badge-lg">
								-{resgate.transacao.valor}
								<Coins class="ml-1 h-4 w-4" />
							</div>
						</div>

						<h3 class="card-title mb-2 text-base">
							{extrairDescricaoVantagem(resgate.transacao.motivo)}
						</h3>

						<div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
							<Calendar class="h-4 w-4" />
							<span>{formatDate(resgate.resgatada_em)}</span>
						</div>

						<div class="divider my-2"></div>

						<div class="space-y-1 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-500">ID da Transação:</span>
								<span class="font-mono text-xs">{resgate.transacao.id.slice(0, 8)}...</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-500">Custo:</span>
								<span class="text-error font-semibold">{resgate.transacao.valor} moedas</span>
							</div>
						</div>
					</div>
				</div>
			{:else}
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
			{/each}
		</div>

		<div class="mt-8">
			<div class="alert">
				<AlertTriangle class="h-6 w-6 shrink-0 stroke-current" />
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
	{/await}
</div>
