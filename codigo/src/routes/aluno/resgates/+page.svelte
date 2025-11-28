<script lang="ts">
	import Loading from '$lib/client/components/Loading.svelte';
	import { listarResgatesAluno } from '$lib/client/controller/transacao.remote';
	import { formatDate } from '$lib/client/utils';
	import { base64ToImageUrl } from '$lib/client/utils/image';
	import { Gift, Calendar, Coins, Package, AlertTriangle } from '@lucide/svelte';

	let { data } = $props();

	let alunoId = $derived(data.aluno.id);
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
			<div class="stats bg-primary shadow">
				<div class="stat text-white ">
					<div class="stat-figure ">
						<Package class="h-8 w-8" />
					</div>
					<div class="stat-title text-white">Total de Resgates</div>
					<div class="stat-value y">{resgates.length}</div>
					<div class="stat-desc text-white">{totalGasto} moedas gastas</div>
				</div>
			</div>
		</div>
		<div class="{resgates.length > 0 ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4' : ''}">
			{#each resgates as resgate}
				<div
					class="card border-base-300 bg-base-100 border shadow-lg transition-shadow hover:shadow-xl overflow-hidden"
				>
					<figure class="w-full h-60 bg-base-200 overflow-hidden">
						<img 
							src={base64ToImageUrl(resgate.vantagem.image)} 
							alt={resgate.vantagem.descricao}
							class="w-full h-full object-cover"
						/>
					</figure>

					<div class="card-body">
						<h3 class="card-title mb-2 text-base">
							{resgate.vantagem.descricao}
						</h3>

						<div class="flex items-center gap-2 text-sm text-gray-500">
							<Calendar class="h-4 w-4" />
							<span>{formatDate(resgate.resgatada_em)}</span>
						</div>

						<div class="divider my-0"></div>

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
