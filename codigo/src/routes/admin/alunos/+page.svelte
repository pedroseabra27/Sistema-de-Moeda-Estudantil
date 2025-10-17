<script lang="ts">
	import { editarAluno, excluirAluno, listarAlunos } from '$lib/client/controller/aluno.remote';
	import type { SelectAluno } from '$lib/server/db/schema';
	import { Pencil, Trash, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { fade, fly } from 'svelte/transition';

	let editingAluno: SelectAluno = $state({
		id: 0,
		cpf: '',
		curso: '',
		user_id: '',
		saldo: 0,
		endereco: null
	});

	let searchTerm = $state('');
	let isLoading = $state(false);
	let deleteConfirmId = $state<number | null>(null);

	function openEditModal(aluno: any) {
		editingAluno = { ...aluno };
		const modal = document.getElementById('edit_modal') as HTMLDialogElement;
		modal.showModal();
	}

	function closeEditModal() {
		const modal = document.getElementById('edit_modal') as HTMLDialogElement;
		modal.close();
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		const toastId = toast.loading('Editando aluno...');

		try {
			await editarAluno({
				id: editingAluno.id,
				info: editingAluno
			});

			toast.success('Aluno editado com sucesso!', {
				id: toastId
			});
		} catch (error) {
			toast.error('Erro ao editar aluno', { id: toastId });
		} finally {
			isLoading = false;
			closeEditModal();
		}
	}

	function openDeleteConfirm(id: number) {
		deleteConfirmId = id;
	}

	function closeDeleteConfirm() {
		deleteConfirmId = null;
	}

	async function confirmDelete(id: number) {
		isLoading = true;
		const toastId = toast.loading('Excluindo aluno');
		try {
			await excluirAluno(id);
			toast.success('Aluno excluído com sucesso!', { id: toastId });
			closeDeleteConfirm();
		} catch (error) {
			toast.error('Erro ao excluir aluno', { id: toastId });
		} finally {
			isLoading = false;
		}
	}

	function formatCPF(cpf: string) {
		return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	const filteredAlunos = (alunos: SelectAluno[] = []) => {
		if (!searchTerm) return alunos;
		return alunos.filter(
			(aluno) =>
				aluno.cpf.includes(searchTerm) ||
				aluno.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(aluno.endereco && aluno.endereco.toLowerCase().includes(searchTerm.toLowerCase()))
		);
	};
</script>

<div class="container mx-auto p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Gerenciamento de Alunos</h1>
		<p class="text-gray-600">Visualize, edite e gerencie todos os alunos cadastrados no sistema.</p>
	</div>

	{#await listarAlunos()}
		<div class="flex min-h-[300px] items-center justify-center">
			<div class="loading loading-spinner loading-lg text-primary"></div>
		</div>
	{:then alunos}
		<div class="bg-base-100 border-base-300 border rounded-lg p-6 shadow-lg" transition:fly={{ y: 20, duration: 300 }}>
			<div class="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div class="form-control w-full sm:max-w-xs">
					<div class="input-group">
						<input
							type="text"
							placeholder="Buscar alunos..."
							class="input input-bordered focus:outline-primary w-full"
							bind:value={searchTerm}
						/>
					</div>
				</div>

				<div class="badge badge-lg">Total: {alunos.length} alunos</div>
			</div>

			<div class="overflow-x-auto">
				<table class="table-zebra table w-full">
					<thead>
						<tr class="bg-base-200">
							<th class="rounded-tl-lg">CPF</th>
							<th>Curso</th>
							<th>Endereço</th>
							<th>Saldo</th>
							<th class="rounded-tr-lg text-center">Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredAlunos(alunos) as aluno (aluno.id)}
							<tr class="hover:bg-base-200 transition-colors duration-150">
								<td class="font-medium">{formatCPF(aluno.cpf)}</td>
								<td>{aluno.curso}</td>
								<td>{aluno.endereco || 'Não informado'}</td>
								<td
									class={aluno.saldo > 0
										? 'text-success font-semibold'
										: 'text-error font-semibold'}
								>
									{formatCurrency(aluno.saldo)}
								</td>
								<td class="flex justify-center gap-2">
									<button
										class="btn btn-sm btn-outline btn-primary"
										onclick={() => openEditModal(aluno)}
									>
										<Pencil class="w-4 h-4"/>
										Editar
									</button>
									<button
										class="btn btn-sm btn-outline btn-error"
										onclick={() => openDeleteConfirm(aluno.id)}
									>
										<Trash class="w-4 h-4"/>
										Excluir
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
		</div>
	{:catch error}
		<div class="alert alert-error shadow-lg" transition:fly={{ y: 20, duration: 300 }}>
			<X class="w-4 h-4"/>
			<div>
				<h3 class="font-bold">Erro ao carregar alunos</h3>
				<div class="text-xs">{error.message || 'Tente novamente mais tarde'}</div>
			</div>
		</div>
	{/await}
</div>

<dialog id="edit_modal" class="modal">
	<div class="modal-box max-w-2xl">
		<h3 class="text-primary mb-6 text-xl font-bold">Editar Aluno</h3>
		<form method="dialog" onsubmit={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="form-control">
					<label class="label" for="cpf">
						<span class="label-text font-medium">CPF</span>
					</label>
					<input
						type="text"
						id="cpf"
						class="input input-bordered focus:input-primary"
						bind:value={editingAluno.cpf}
						required
					/>
				</div>
				<div class="form-control">
					<label class="label" for="curso">
						<span class="label-text font-medium">Curso</span>
					</label>
					<input
						type="text"
						id="curso"
						class="input input-bordered focus:input-primary"
						bind:value={editingAluno.curso}
						required
					/>
				</div>
				<div class="form-control">
					<label class="label" for="endereco">
						<span class="label-text font-medium">Endereço</span>
					</label>
					<input
						type="text"
						id="endereco"
						class="input input-bordered focus:input-primary"
						bind:value={editingAluno.endereco}
						placeholder="Informe o endereço"
					/>
				</div>
				<div class="form-control">
					<label class="label" for="saldo">
						<span class="label-text font-medium">Saldo</span>
					</label>
					<input
						type="number"
						id="saldo"
						class="input input-bordered focus:input-primary"
						bind:value={editingAluno.saldo}
						required
					/>
				</div>
			</div>

			<div class="modal-action mt-8">
				<button type="button" class="btn btn-outline" onclick={closeEditModal} disabled={isLoading}>
					Cancelar
				</button>
				<button type="submit" class="btn btn-primary" disabled={isLoading}>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Salvar alterações
				</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

{#if deleteConfirmId !== null}
	<div class="modal modal-open">
		<div class="modal-box max-w-md">
			<h3 class="text-error text-lg font-bold">Confirmar exclusão</h3>
			<p class="py-4">
				Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
			</p>
			<div class="modal-action">
				<button class="btn btn-outline" onclick={closeDeleteConfirm} disabled={isLoading}>
					Cancelar
				</button>
				<button
					class="btn btn-error"
					onclick={() => confirmDelete(deleteConfirmId!)}
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Excluir
				</button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={closeDeleteConfirm}></div>
	</div>
{/if}
