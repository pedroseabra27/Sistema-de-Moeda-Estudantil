<script lang="ts">
	import { listarAlunos } from '$lib/client/controller/aluno.remote';

	let editingAluno: any = $state({});

	function openEditModal(aluno: any) {
		editingAluno = { ...aluno };
		const modal = document.getElementById('edit_modal') as HTMLDialogElement;
		modal.showModal();
	}

	function closeEditModal() {
		const modal = document.getElementById('edit_modal') as HTMLDialogElement;
		modal.close();
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		// Função para editar aluno (não faz nada por enquanto)
		console.log('Editando aluno:', editingAluno);
		closeEditModal();
	}

	function confirmDelete(id: number) {
		if (confirm('Tem certeza que deseja excluir este aluno?')) {
			// Função para excluir aluno (não faz nada por enquanto)
			console.log('Excluindo aluno ID:', id);
		}
	}
</script>

{#await listarAlunos()}
	Carregando...
{:then alunos}
	<div class="overflow-x-auto">
		<table class="table-zebra table">
			<thead>
				<tr>
					<th>CPF</th>
					<th>Curso</th>
					<th>Endereço</th>
					<th>Saldo</th>
					<th>Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each alunos as aluno (aluno.id)}
					<tr class="hover">
						<td>{aluno.cpf}</td>
						<td>{aluno.curso}</td>
						<td>{aluno.endereco || 'Não informado'}</td>
						<td>{aluno.saldo}</td>
						<td class="flex gap-2">
							<button class="btn btn-sm btn-primary" onclick={() => openEditModal(aluno)}
								>Editar</button
							>
							<button class="btn btn-sm btn-error" onclick={() => confirmDelete(aluno.id)}
								>Excluir</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:catch error}
	{error}
{/await}

<dialog id="edit_modal" class="modal">
	<div class="modal-box">
		<h3 class="mb-4 text-lg font-bold">Editar Aluno</h3>
		<form method="dialog" onsubmit={handleSubmit}>
			<div class="form-control mb-3">
				<label class="label" for="cpf">CPF</label>
				<input type="text" id="cpf" class="input input-bordered" bind:value={editingAluno.cpf} />
			</div>
			<div class="form-control mb-3">
				<label class="label" for="curso">Curso</label>
				<input
					type="text"
					id="curso"
					class="input input-bordered"
					bind:value={editingAluno.curso}
				/>
			</div>
			<div class="form-control mb-3">
				<label class="label" for="endereco">Endereço</label>
				<input
					type="text"
					id="endereco"
					class="input input-bordered"
					bind:value={editingAluno.endereco}
				/>
			</div>
			<div class="form-control mb-3">
				<label class="label" for="saldo">Saldo</label>
				<input
					type="number"
					id="saldo"
					class="input input-bordered"
					bind:value={editingAluno.saldo}
				/>
			</div>
			<div class="modal-action">
				<button type="button" class="btn btn-outline" onclick={closeEditModal}>Cancelar</button>
				<button type="submit" class="btn btn-primary">Salvar</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	.modal {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
