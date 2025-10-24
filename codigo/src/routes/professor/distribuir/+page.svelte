<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import type { SelectAluno } from '$lib/server/db/aluno/schema';
	import {
		enviarMoedas,
		listarAlunosParaTransferencia,
		type AlunoWithUser
	} from '$lib/client/controller/professor.remote';
	import type { PageData } from './$types';
	import { Info, X } from '@lucide/svelte';
	import { formatCPF, formatCurrency } from '$lib/client/utils';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let isLoading = $state(false);
	let alunoSelecionado: SelectAluno | null = $state(null);
	let quantidade: number = $state(1);
	let motivo: string = $state('');
	let searchTerm: string = $state('');

	let isModalOpen: HTMLDialogElement | null = $state(null);

	function openModal(aluno: SelectAluno) {
		alunoSelecionado = aluno;
		quantidade = 1;
		motivo = '';
		isModalOpen?.showModal();
	}

	function closeModal() {
		isModalOpen?.close();
		alunoSelecionado = null;
		quantidade = 1;
		motivo = '';
	}

	async function handleEnviarMoedas(event: SubmitEvent) {
		event.preventDefault();
		if (!alunoSelecionado) {
			toast.error('Selecione um aluno');
			return;
		}

		if (quantidade > data.professor.saldo) {
			toast.error('Saldo insuficiente');
			return;
		}

		if (!motivo.trim()) {
			toast.error('O motivo é obrigatório');
			return;
		}

		isLoading = true;
		const toastId = toast.loading('Enviando moedas...');

		try {
			await enviarMoedas({
				professorId: data.professor.id,
				alunoId: alunoSelecionado.id,
				quantidade: quantidade,
				motivo: motivo
			});

			await invalidateAll();
			toast.success('Moedas enviadas com sucesso!', { id: toastId });
			closeModal();
		} catch (error: any) {
			toast.error(error.message || 'Falha ao enviar moedas', { id: toastId });
		} finally {
			isLoading = false;
		}
	}

	function filterAlunos(alunos: AlunoWithUser[]) {
		if (!searchTerm) return alunos;
		const term = searchTerm.toLowerCase();
		return alunos.filter(
			(aluno) => aluno.cpf.includes(term) || aluno.curso.toLowerCase().includes(term)
		);
	}
</script>

<div class=" min-h-screen p-4 md:p-6">
	<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div class="flex w-full items-center justify-between">
			<div>
				<h1 class="card-title text-3xl text-primary">Distribuição de Moedas</h1>
				<p class="mt-2 opacity-90">Professor: {data.professor.cpf}</p>
				<p class="text-sm opacity-80">Departamento: {data.professor.departamento}</p>
			</div>
			<div class="stats bg-secondary text-primary-content shadow">
				<div class="stat">
					<div class="stat-title text-primary-content opacity-80">Saldo Disponível</div>
					<div class="stat-value">{data.professor.saldo}</div>
					<div class="stat-desc text-primary-content opacity-80">moedas</div>
				</div>
			</div>
		</div>
	</div>

	<div class="card border-base-200 bg-base-100 border shadow-xl">
		<div class="card-body">
			<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<h2 class="card-title text-2xl">Alunos Disponíveis</h2>
				<div class="form-control">
					<div class="input-group">
						<input
							type="text"
							bind:value={searchTerm}
							placeholder="Buscar por CPF ou curso..."
							class="input input-bordered w-full md:w-80"
						/>
					</div>
				</div>
			</div>

			{#await listarAlunosParaTransferencia()}
				<div class="flex items-center justify-center py-12">
					<div class="text-center">
						<span class="loading loading-spinner loading-lg text-primary"></span>
						<p class="mt-4">Carregando alunos...</p>
					</div>
				</div>
			{:then alunos}
				<div class="overflow-x-auto">
					<table class="table-zebra table w-full">
						<thead>
							<tr class="bg-base-200">
								<th>Aluno</th>
								<th>CPF</th>
								<th>Curso</th>
								<th>Endereço</th>
								<th class="text-center">Saldo</th>
								<th class="text-center">Ação</th>
							</tr>
						</thead>
						<tbody>
							{#each filterAlunos(alunos) as aluno (aluno.id)}
								<tr class="hover:bg-base-200 transition-colors duration-150">
									<td>{aluno.user?.name}</td>
									<td class="font-medium">{formatCPF(aluno.cpf)}</td>
									<td>{aluno.curso}</td>
									<td>{aluno.endereco || 'Não informado'}</td>
									<td
										class=" text-center {aluno.saldo > 0
											? 'text-success font-semibold'
											: 'text-error font-semibold'}"
									>
										{formatCurrency(aluno.saldo)}
									</td>
									<td class="flex justify-center gap-2">
										<button
											type="button"
											onclick={() => openModal(aluno)}
											class="btn btn-primary btn-sm"
										>
											Enviar Moedas
										</button>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="text-center py-8 text-gray-500">
										{searchTerm
											? 'Nenhum aluno encontrado para a busca realizada.'
											: 'Nenhum aluno cadastrado.'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:catch error}
				<div class="alert alert-error">
					<X />
					<div>
						<div class="font-bold">Erro ao carregar alunos</div>
						<div class="text-xs">{error.message}</div>
					</div>
				</div>
			{/await}
		</div>
	</div>
</div>

{#if alunoSelecionado}
	<dialog class="modal modal-open" bind:this={isModalOpen} transition:fade={{ duration: 200 }}>
		<div class="modal-box max-w-md">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-2xl font-bold">Enviar Moedas</h3>
				<button
					aria-label="Fechar"
					type="button"
					onclick={closeModal}
					class="btn btn-circle btn-ghost btn-sm"
					disabled={isLoading}
				>
					<X />
				</button>
			</div>

			<div class="alert alert-info mb-6">
				<Info class="mr-2 inline-block" />
				<div>
					<div class="text-sm font-medium">Destinatário</div>
					<div class="text-lg font-bold">{alunoSelecionado.cpf}</div>
					<div class="text-sm">{alunoSelecionado.curso}</div>
				</div>
			</div>

			<form onsubmit={handleEnviarMoedas} class="space-y-4">
				<div class="form-control">
					<label for="quantidade" class="label">
						<span class="label-text font-medium">Quantidade de Moedas</span>
					</label>
					<input
						type="number"
						id="quantidade"
						bind:value={quantidade}
						min="1"
						max={data.professor.saldo}
						class="input input-bordered w-full"
						required
						disabled={isLoading}
					/>
					<label class="label" for="quantidade">
						<span class="label-text-alt">Máximo: {data.professor.saldo} moedas disponíveis</span>
					</label>
				</div>

				<div class="form-control flex flex-col">
					<label for="motivo" class="label">
						<span class="label-text font-medium">
							Motivo <span class="text-error">*</span>
						</span>
					</label>
					<textarea
						id="motivo"
						bind:value={motivo}
						rows="4"
						placeholder="Descreva o motivo da transferência..."
						class="textarea textarea-bordered w-full"
						required
						disabled={isLoading}
					></textarea>
				</div>

				<div class="modal-action">
					<button type="button" onclick={closeModal} class="btn btn-ghost" disabled={isLoading}>
						Cancelar
					</button>
					<button type="submit" class="btn btn-primary" disabled={isLoading}>
						{#if isLoading}
							<span class="loading loading-spinner loading-sm"></span>
							Enviando...
						{:else}
							Confirmar Envio
						{/if}
					</button>
				</div>
			</form>
		</div>
		<div class="modal-backdrop" onclick={closeModal}></div>
	</dialog>
{/if}
