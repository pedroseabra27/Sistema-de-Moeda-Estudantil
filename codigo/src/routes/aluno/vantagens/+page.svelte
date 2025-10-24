<script lang="ts">
	import { listarVantagens, resgatarVantagem } from '$lib/client/controller/vantagem.remote';
	import type { SelectVantagem } from '$lib/server/db/vantagem/schema';
	import { Gift, Coins, Building2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let alunoId = $derived(data.aluno.id);
	let saldoAtual = $state(data.aluno.saldo);

	let vantagens = $state<SelectVantagem[]>([]);
	let isLoading = $state(false);
	let selectedVantagem = $state<SelectVantagem | null>(null);

	$effect(() => {
		carregarVantagens();
	});

	async function carregarVantagens() {
		isLoading = true;
		try {
			vantagens = await listarVantagens();
		} catch (error) {
			toast.error('Erro ao carregar vantagens');
		} finally {
			isLoading = false;
		}
	}

	function openConfirmModal(vantagem: SelectVantagem) {
		selectedVantagem = vantagem;
		const modal = document.getElementById('confirm_modal') as HTMLDialogElement;
		modal.showModal();
	}

	function closeModal() {
		const modal = document.getElementById('confirm_modal') as HTMLDialogElement;
		modal.close();
		selectedVantagem = null;
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
			
			saldoAtual -= valorVantagem;
			toast.success('Vantagem resgatada com sucesso!', { id: toastId });
			closeModal();
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

<div class="container mx-auto p-4">
	<div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">Vantagens Disponíveis</h1>
			<p class="text-gray-600">Troque suas moedas por benefícios exclusivos.</p>
		</div>
		<div class="card bg-primary text-primary-content shadow-md">
			<div class="card-body p-4 flex flex-row items-center gap-3">
				<Coins class="w-8 h-8" />
				<div>
					<p class="text-sm opacity-80">Seu saldo</p>
					<p class="text-2xl font-bold">{saldoAtual}</p>
				</div>
			</div>
		</div>
	</div>

	{#if isLoading}
		<div class="flex justify-center items-center min-h-[400px]">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	{:else if vantagens.length === 0}
		<div class="text-center py-12">
			<Gift class="w-16 h-16 mx-auto text-gray-300 mb-4" />
			<p class="text-gray-500 text-lg">Nenhuma vantagem disponível no momento.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each vantagens as vantagem}
				{@const podePagar = canAfford(vantagem.valor)}
				<div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow {!podePagar ? 'opacity-60' : ''}">
					<div class="card-body">
						<div class="flex items-start justify-between mb-2">
							<Gift class="w-8 h-8 text-primary" />
							<div class="badge badge-primary badge-lg">
								{vantagem.valor} <Coins class="w-4 h-4 ml-1" />
							</div>
						</div>
						
						<p class="text-base-content text-sm mb-3">{vantagem.descricao}</p>
						
						{#if vantagem.empresa}
							<div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
								<Building2 class="w-4 h-4" />
								<span>Empresa ID: {vantagem.empresa_id}</span>
							</div>
						{/if}
						
						<div class="card-actions justify-end">
							{#if podePagar}
								<button 
									class="btn btn-primary w-full" 
									onclick={() => openConfirmModal(vantagem)}
									disabled={isLoading}
								>
									Resgatar
								</button>
							{:else}
								<button class="btn btn-disabled w-full">
									Saldo insuficiente
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal de Confirmação -->
<dialog id="confirm_modal" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Confirmar Resgate</h3>
		
		{#if selectedVantagem}
			<div class="space-y-3">
				<p class="text-base-content"><strong>Vantagem:</strong> {selectedVantagem.descricao}</p>
				<p class="text-base-content"><strong>Custo:</strong> {selectedVantagem.valor} moedas</p>
				<p class="text-base-content"><strong>Saldo atual:</strong> {saldoAtual} moedas</p>
				<p class="text-base-content"><strong>Saldo após resgate:</strong> {saldoAtual - parseInt(selectedVantagem.valor)} moedas</p>
			</div>

			<div class="alert alert-info mt-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
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
