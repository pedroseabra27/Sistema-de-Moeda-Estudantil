<script lang="ts">
	import Loading from '$lib/client/components/Loading.svelte';
	import { listarResgatesAluno } from '$lib/client/controller/transacao.remote';
	import { formatDate } from '$lib/client/utils';
	import { base64ToImageUrl } from '$lib/client/utils/image';
	import type { SelectVantagemResgatada } from '$lib/server/db/schema';
	import { Gift, Calendar, Package, AlertTriangle, Eye, Info } from '@lucide/svelte';
	import QRCode from 'qrcode';

	let { data } = $props();

	let alunoId = $derived(data.aluno.id);

	let isModalCodigo = $state<HTMLDialogElement | null>(null);
	let selectedVantagem: SelectVantagemResgatada | null = $state(null);
	let qrDataUrl: string | null = $state(null);

	async function openCodigoModal(vantagem: SelectVantagemResgatada) {
		selectedVantagem = vantagem;
		qrDataUrl = null;
		try {
			qrDataUrl = await QRCode.toDataURL(vantagem.codigo_resgate, {
				width: 200,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#FFFFFF'
				}
			});
		} catch (err) {
			console.error('Erro gerando QR Code:', err);
			qrDataUrl = null;
		}
		isModalCodigo?.showModal();
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
			<div class="stats bg-primary shadow">
				<div class="stat text-white">
					<div class="stat-figure">
						<Package class="h-8 w-8" />
					</div>
					<div class="stat-title text-white">Total de Resgates</div>
					<div class="stat-value y">{resgates.length}</div>
					<div class="stat-desc text-white">{totalGasto} moedas gastas</div>
				</div>
			</div>
		</div>
		<div class={resgates.length > 0 ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4' : ''}>
			{#each resgates as resgate}
				<div
					class="card border-base-300 bg-base-100 overflow-hidden border shadow-lg transition-shadow hover:shadow-xl"
				>
					<div class="absolute right-2 top-2 flex flex-col items-end">
						<button class="btn btn-xs btn-primary" onclick={() => openCodigoModal(resgate)}
							><Eye class="h-4 w-4" />Ver código</button
						>
					</div>
					<figure class="bg-base-200 h-60 w-full overflow-hidden">
						<img
							src={base64ToImageUrl(resgate.vantagem.image)}
							alt={resgate.vantagem.descricao}
							class="h-full w-full object-cover"
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

<dialog bind:this={isModalCodigo} class="modal" onclose={() => { selectedVantagem = null; qrDataUrl = null }}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		{#if selectedVantagem}
			<h3 class="mb-4 text-lg font-bold">Código de Resgate</h3>

			<p class="text-base-content mb-4">
				Aqui está o código para a vantagem resgatada. Apresente este código para resgatar seu
				benefício.
			</p>

			<div class="alert alert-info mb-4">
				<Info class="h-6 w-6 shrink-0 stroke-current" />
				<span class="text-sm">Guarde este código com segurança.</span>
			</div>

			{#if qrDataUrl}
				<div class="flex items-center justify-center mb-4">
					<img src={qrDataUrl} alt="QR Code de Resgate" class="h-48 w-48 rounded-md border p-1" />
				</div>
			{:else}
				<div class="flex items-center justify-center mb-4">
					<span class="text-sm text-gray-500">Gerando QR Code...</span>
				</div>
			{/if}

			<div
				class="flex items-center justify-center rounded-md border bg-gray-100 p-4 font-mono text-lg"
			>
				{selectedVantagem.codigo_resgate}
			</div>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
