<script lang="ts">
	import { editarEmpresa, excluirEmpresa, listarEmpresas } from '$lib/client/controller/empresa.remote';
	import type { SelectEmpresa } from '$lib/server/db/schema';
	import { Pencil, Trash, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { fade, fly } from 'svelte/transition';

	let editingEmpresa: SelectEmpresa = $state({
		id: 0,
		nome: '',
		cnpj: '',
		user_id: '',
		saldo: 0
	});

	let searchTerm = $state('');
	let isLoading = $state(false);
	let deleteConfirmId = $state<number | null>(null);

	function openEditModal(empresa: SelectEmpresa) {
		editingEmpresa = { ...empresa };
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
		const toastId = toast.loading('Editando empresa...');

		try {
			await editarEmpresa({
				id: editingEmpresa.id,
				info: {
					cnpj: editingEmpresa.cnpj,
				}
			});

			toast.success('Empresa editada com sucesso!', {
				id: toastId
			});
		} catch (error) {
			toast.error('Erro ao editar empresa', { id: toastId });
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
		const toastId = toast.loading('Excluindo empresa');
		try {
			await excluirEmpresa(id);
			toast.success('Empresa excluída com sucesso!', { id: toastId });
			closeDeleteConfirm();
		} catch (error) {
			toast.error('Erro ao excluir empresa', { id: toastId });
		} finally {
			isLoading = false;
		}
	}

	function formatCNPJ(cnpj: string) {
		return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
	}

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	const filteredEmpresas = (empresas: SelectEmpresa[] = []) => {
		if (!searchTerm) return empresas;
		return empresas.filter(
			(empresa) =>
				empresa.cnpj.includes(searchTerm)
				// empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};
</script>

<div class="container mx-auto p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Gerenciamento de Empresas</h1>
		<p class="text-gray-600">Visualize, edite e gerencie todas as empresas cadastradas no sistema.</p>
	</div>

	{#await listarEmpresas()}
		<div class="flex min-h-[300px] items-center justify-center">
			<div class="loading loading-spinner loading-lg text-primary"></div>
		</div>
	{:then empresas}
		<div class="bg-base-100 border-base-300 border rounded-lg p-6 shadow-lg" transition:fly={{ y: 20, duration: 300 }}>
			<div class="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div class="form-control w-full sm:max-w-xs">
					<div class="input-group">
						<input
							type="text"
							placeholder="Buscar empresas..."
							class="input input-bordered focus:outline-primary w-full"
							bind:value={searchTerm}
						/>
					</div>
				</div>

				<div class="badge badge-lg">Total: {empresas.length} empresas</div>
			</div>

			<div class="overflow-x-auto">
				<table class="table-zebra table w-full">
					<thead>
						<tr class="bg-base-200">
							<!-- <th class="rounded-tl-lg">Nome</th> -->
							<th>CNPJ</th>
							<!-- <th>Saldo</th> -->
							<th class="rounded-tr-lg text-center">Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredEmpresas(empresas) as empresa (empresa.id)}
							<tr class="hover:bg-base-200 transition-colors duration-150">
								<!-- <td class="font-medium">{empresa.nome}</td> -->
								<td>{formatCNPJ(empresa.cnpj)}</td>
								<!-- <td
									class={empresa.saldo > 0
										? 'text-success font-semibold'
										: 'text-error font-semibold'}
								>
									{formatCurrency(empresa.saldo)}
								</td> -->
								<td class="flex justify-center gap-2">
									<button
										class="btn btn-sm btn-outline btn-primary"
										onclick={() => openEditModal(empresa)}
									>
										<Pencil class="w-4 h-4"/>
										Editar
									</button>
									<button
										class="btn btn-sm btn-outline btn-error"
										onclick={() => openDeleteConfirm(empresa.id)}
									>
										<Trash class="w-4 h-4"/>
										Excluir
									</button>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="text-center py-8 text-gray-500">
									{searchTerm
										? 'Nenhuma empresa encontrada para a busca realizada.'
										: 'Nenhuma empresa cadastrada.'}
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
				<h3 class="font-bold">Erro ao carregar empresas</h3>
				<div class="text-xs">{error.message || 'Tente novamente mais tarde'}</div>
			</div>
		</div>
	{/await}
</div>

<dialog id="edit_modal" class="modal">
	<div class="modal-box max-w-2xl">
		<h3 class="text-primary mb-6 text-xl font-bold">Editar Empresa</h3>
		<form method="dialog" onsubmit={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- <div class="form-control">
					<label class="label" for="nome">
						<span class="label-text font-medium">Nome</span>
					</label>
					<input
						type="text"
						id="nome"
						class="input input-bordered focus:input-primary"
						bind:value={editingEmpresa.nome}
						required
					/>
				</div> -->
				<div class="form-control">
					<label class="label" for="cnpj">
						<span class="label-text font-medium">CNPJ</span>
					</label>
					<input
						type="text"
						id="cnpj"
						class="input input-bordered focus:input-primary"
						bind:value={editingEmpresa.cnpj}
						required
					/>
				</div>
				<!-- <div class="form-control md:col-span-2">
					<label class="label" for="saldo">
						<span class="label-text font-medium">Saldo</span>
					</label>
					<input
						type="number"
						id="saldo"
						class="input input-bordered focus:input-primary"
						bind:value={editingEmpresa.saldo}
						required
					/>
				</div> -->
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
				Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
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