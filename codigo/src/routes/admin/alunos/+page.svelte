<script lang="ts">
	import { editarAluno, excluirAluno, listarAlunos, getExtratoAluno } from '$lib/client/controller/aluno.remote';
	import type { SelectAluno } from '$lib/server/db/schema';
	import { Pencil, Trash, X, Receipt, Coins, Calendar } from '@lucide/svelte';
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
	let extratoAluno = $state<{ cpf: string; nome: string; curso: string; saldo: number } | null>(null);
	let extratoTransacoes = $state<any[]>([]);

	function openEditModal(aluno: SelectAluno) {
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
				info: {
					cpf: editingAluno.cpf,
					curso: editingAluno.curso,
					endereco: editingAluno.endereco,
					saldo: editingAluno.saldo
				}
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

	async function openExtratoModal(aluno: SelectAluno) {
		extratoAluno = {
			cpf: aluno.cpf,
			nome: aluno.cpf, // Se você tiver o nome, use aqui
			curso: aluno.curso,
			saldo: aluno.saldo
		};

		try {
			extratoTransacoes = await getExtratoAluno(aluno.cpf);
			const modal = document.getElementById('extrato_modal') as HTMLDialogElement;
			modal.showModal();
		} catch (error) {
			toast.error('Erro ao carregar extrato do aluno');
			extratoAluno = null;
			extratoTransacoes = [];
		}
	}

	function closeExtratoModal() {
		const modal = document.getElementById('extrato_modal') as HTMLDialogElement;
		modal.close();
		extratoAluno = null;
		extratoTransacoes = [];
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

	function calcularTotalRecebido(transacoes: any[]): number {
		return transacoes.reduce((total, t) => total + t.valor, 0);
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
										class="btn btn-sm btn-outline btn-info"
										onclick={() => openExtratoModal(aluno)}
										title="Ver Extrato"
									>
										<Receipt class="w-4 h-4"/>
										Extrato
									</button>
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

<!-- Modal de Extrato -->
<dialog id="extrato_modal" class="modal">
	<div class="modal-box max-w-4xl">
		{#if extratoAluno}
			<h3 class="text-primary mb-6 text-2xl font-bold flex items-center gap-2">
				<Receipt class="w-6 h-6" />
				Extrato do Aluno
			</h3>

			<!-- Card com informações do aluno -->
			<div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 mb-6 text-white">
				<div class="flex justify-between items-start">
					<div>
						<p class="text-blue-100 text-sm mb-1">CPF</p>
						<p class="text-xl font-bold mb-3">{formatCPF(extratoAluno.cpf)}</p>
						<p class="text-blue-100 text-sm">Curso</p>
						<p class="font-semibold">{extratoAluno.curso}</p>
					</div>
					<div class="text-right">
						<p class="text-blue-100 text-sm mb-1">Saldo Atual</p>
						<div class="flex items-center gap-2 justify-end">
							<Coins class="w-8 h-8" />
							<span class="text-4xl font-bold">{extratoAluno.saldo}</span>
						</div>
						<p class="text-blue-100 text-xs mt-1">moedas</p>
					</div>
				</div>
			</div>

			<!-- Estatísticas -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div class="bg-base-200 rounded-lg p-4">
					<div class="flex items-center gap-3">
						<div class="bg-success bg-opacity-20 p-3 rounded-full">
							<Coins class="w-5 h-5 text-success" />
						</div>
						<div>
							<p class="text-xs opacity-70">Total Recebido</p>
							<p class="text-2xl font-bold">{calcularTotalRecebido(extratoTransacoes)}</p>
						</div>
					</div>
				</div>

				<div class="bg-base-200 rounded-lg p-4">
					<div class="flex items-center gap-3">
						<div class="bg-info bg-opacity-20 p-3 rounded-full">
							<Receipt class="w-5 h-5 text-info" />
						</div>
						<div>
							<p class="text-xs opacity-70">Transações</p>
							<p class="text-2xl font-bold">{extratoTransacoes.length}</p>
						</div>
					</div>
				</div>

				<div class="bg-base-200 rounded-lg p-4">
					<div class="flex items-center gap-3">
						<div class="bg-secondary bg-opacity-20 p-3 rounded-full">
							<Calendar class="w-5 h-5 text-secondary" />
						</div>
						<div>
							<p class="text-xs opacity-70">Última Transação</p>
							<p class="text-sm font-semibold">
								{extratoTransacoes.length > 0 ? formatarData(extratoTransacoes[0].data).split(' ')[0] : 'N/A'}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Tabela de transações -->
			{#if extratoTransacoes.length === 0}
				<div class="text-center py-12">
					<Coins class="w-16 h-16 mx-auto mb-4 opacity-30" />
					<p class="text-lg font-semibold opacity-70">Nenhuma transação encontrada</p>
					<p class="text-sm opacity-50 mt-2">
						Este aluno ainda não recebeu moedas de nenhum professor
					</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="table table-zebra w-full">
						<thead>
							<tr class="bg-base-200">
								<th>Data</th>
								<th>Professor</th>
								<th>Departamento</th>
								<th>Motivo</th>
								<th class="text-right">Valor</th>
							</tr>
						</thead>
						<tbody>
							{#each extratoTransacoes as transacao (transacao.id)}
								<tr transition:fade={{ duration: 150 }}>
									<td class="text-sm">
										<div class="flex items-center gap-2">
											<Calendar class="w-4 h-4 opacity-50" />
											{formatarData(transacao.data)}
										</div>
									</td>
									<td class="font-medium">{transacao.professorCPF || 'N/A'}</td>
									<td>{transacao.professorDepartamento || 'N/A'}</td>
									<td class="max-w-xs truncate" title={transacao.motivo}>
										{transacao.motivo}
									</td>
									<td class="text-right">
										<div class="flex items-center justify-end gap-2">
											<span class="text-lg font-bold text-success">
												+{transacao.valor}
											</span>
											<Coins class="w-4 h-4 text-success" />
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Rodapé com total -->
				<div class="bg-base-200 mt-4 p-4 rounded-lg flex justify-between items-center">
					<span class="text-sm opacity-70">
						Total de {extratoTransacoes.length} {extratoTransacoes.length === 1 ? 'transação' : 'transações'}
					</span>
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium">Total Recebido:</span>
						<span class="text-xl font-bold text-success">{calcularTotalRecebido(extratoTransacoes)}</span>
						<Coins class="w-5 h-5 text-success" />
					</div>
				</div>
			{/if}

			<div class="modal-action mt-6">
				<button class="btn btn-outline" onclick={closeExtratoModal}>
					Fechar
				</button>
			</div>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
