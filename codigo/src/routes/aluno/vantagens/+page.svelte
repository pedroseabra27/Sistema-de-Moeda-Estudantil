<script lang="ts">
	import {
		listarVantagens,
		resgatarVantagem,
		type ListarVantagesWithEmpresa
	} from '$lib/client/controller/vantagem.remote';
	import type { SelectVantagem } from '$lib/server/db/vantagem/schema';
	import { Gift, Coins, Info } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import VantagemCard from '$lib/client/components/VantagemCard.svelte';
	import { goto } from '$app/navigation';
	import Loading from '$lib/client/components/Loading.svelte';

	let { data } = $props();

	let alunoId = $derived(data.aluno.id);
	let saldoAtual = $derived(data.aluno.saldo);

	let isLoading = $state(false);
	let selectedVantagem = $state<ListarVantagesWithEmpresa | null>(null);

	let isVantagemModal: HTMLDialogElement | null = $state(null);

	function openConfirmModal(vantagem: ListarVantagesWithEmpresa) {
		selectedVantagem = vantagem;
		isVantagemModal?.showModal();
	}

	function closeModal() {
		selectedVantagem = null;
		isVantagemModal?.close();
	}

	async function handleResgate() {
		if (!selectedVantagem) return;

		const valorVantagem = parseInt(selectedVantagem.valor);

		if (saldoAtual < valorVantagem) {
			toast.error('Saldo insuficiente para resgatar esta vantagem!');
			closeModal();
			return;
		}

		isLoading = true;
		const toastId = toast.loading('Resgatando vantagem...');

		try {
			await resgatarVantagem({
				alunoId,
				vantagemId: selectedVantagem.id
			});
			toast.success('Vantagem resgatada com sucesso!', { id: toastId });
			closeModal();
			await goto('/aluno/resgates');
		} catch (error) {
			toast.error('Erro ao resgatar vantagem', { id: toastId });
		} finally {
			isLoading = false;
		}
	}

	function canAfford(valor: string): boolean {
		return saldoAtual >= parseInt(valor);
	}
</script>

<div class=" p-4">
	<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">Vantagens Disponíveis</h1>
			<p class="text-gray-600">Troque suas moedas por benefícios exclusivos.</p>
		</div>
		<div class="card bg-primary text-primary-content shadow-md">
			<div class="card-body flex flex-row items-center gap-3 p-4">
				<Coins class="h-8 w-8" />
				<div>
					<p class="text-sm opacity-80">Seu saldo</p>
					<p class="text-2xl font-bold">{saldoAtual}</p>
				</div>
			</div>
		</div>
	</div>

	{#await listarVantagens()}
		<Loading />
	{:then vantagens}
		{#if vantagens.length === 0}
			<div class="py-12 text-center">
				<Gift class="mx-auto mb-4 h-16 w-16 text-gray-300" />
				<p class="text-lg text-gray-500">Nenhuma vantagem disponível no momento.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each vantagens as vantagem}
					{@const podePagar = canAfford(vantagem.valor)}
					<VantagemCard
						{vantagem}
						canAfford={podePagar}
						{isLoading}
						onResgate={() => openConfirmModal(vantagem)}
					/>
				{/each}
			</div>
		{/if}
	{/await}
</div>

<dialog bind:this={isVantagemModal} class="modal">
	<div class="modal-box">
		<h3 class="mb-4 text-lg font-bold">Confirmar Resgate</h3>

		{#if selectedVantagem}
			<div class="space-y-3">
				<p class="text-base-content"><strong>Vantagem:</strong> {selectedVantagem.descricao}</p>
				<p class="text-base-content"><strong>Custo:</strong> {selectedVantagem.valor} moedas</p>
				<p class="text-base-content"><strong>Saldo atual:</strong> {saldoAtual} moedas</p>
				<p class="text-base-content">
					<strong>Saldo após resgate:</strong>
					{saldoAtual - parseInt(selectedVantagem.valor)} moedas
				</p>
			</div>

			<div class="alert alert-info mt-4">
				<Info class="h-6 w-6 shrink-0 stroke-current" />
				<span class="text-sm">Esta ação não pode ser desfeita.</span>
			</div>
		{/if}

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={closeModal} disabled={isLoading}>Cancelar</button>
			<button class="btn btn-primary" onclick={handleResgate} disabled={isLoading}>
				{#if isLoading}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				Confirmar Resgate
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
