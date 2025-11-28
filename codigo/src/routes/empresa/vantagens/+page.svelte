<script lang="ts">
	import { inserirVantagem, listarVantagensPorEmpresa, editarVantagem, excluirVantagem } from '$lib/client/controller/vantagem.remote';
	import type { SelectVantagem } from '$lib/server/db/vantagem/schema';
	import { Pencil, Trash, Plus, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';
	import { base64ToImageUrl } from '$lib/client/utils/image';

	let { data } = $props();

	let empresaId = $derived(data.empresa.id);
	
	let editingVantagem: SelectVantagem & { imagePreview?: string } = $state({
		id: 0,
		descricao: '',
		valor: '0',
		image: '',
		empresa_id: 0
	});

	let isLoading = $state(false);
	let imageInput: HTMLInputElement | null = $state(null);

	let isVantagemModal: HTMLDialogElement | null = $state(null);

	function openCreateModal() {
		editingVantagem = {
			id: 0,
			descricao: '',
			valor: '0',
			image: '',
			empresa_id: empresaId
		};
		isVantagemModal?.showModal();
	}

	function closeModal() {
		isVantagemModal?.close();
	}

	function handleImageChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast.error('Por favor, selecione um arquivo de imagem válido');
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error('Imagem muito grande. Máximo 5MB');
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const base64 = event.target?.result as string;
			editingVantagem.image = base64;
			editingVantagem.imagePreview = base64;
		};
		reader.onerror = () => {
			toast.error('Erro ao ler a imagem');
		};
		reader.readAsDataURL(file);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isLoading = true;
		const toastId = toast.loading(editingVantagem.id ? 'Editando vantagem...' : 'Criando vantagem...');

		try {
			if (editingVantagem.id) {
				await editarVantagem({
					id: editingVantagem.id,
					info: {
						descricao: editingVantagem.descricao,
						valor: editingVantagem.valor,
						image: editingVantagem.image,
						empresa_id: editingVantagem.empresa_id
					}
				});
				toast.success('Vantagem editada com sucesso!', { id: toastId });
			} else {
				await inserirVantagem({
					descricao: editingVantagem.descricao,
					valor: editingVantagem.valor,
					image: editingVantagem.image,
					empresa_id: editingVantagem.empresa_id
				});
				toast.success('Vantagem criada com sucesso!', { id: toastId });
			}
		} catch (error) {
			toast.error('Erro ao salvar vantagem', { id: toastId });
		} finally {
			isLoading = false;
			closeModal();
		}
	}

	function openEditModal(vantagem: SelectVantagem) {
		editingVantagem = { 
			...vantagem,
			imagePreview: base64ToImageUrl(vantagem.image)
		};
		isVantagemModal?.showModal();
	}

	async function deleteVantagem(id: number) {
		if (!confirm('Tem certeza que deseja excluir esta vantagem?')) return;
		
		isLoading = true;
		const toastId = toast.loading('Excluindo vantagem...');
		try {
			await excluirVantagem(id);
			toast.success('Vantagem excluída com sucesso!', { id: toastId });
		} catch (error) {
			toast.error('Erro ao excluir vantagem', { id: toastId });
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="p-4">
	<div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-primary mb-2 text-3xl font-bold">Minhas Vantagens</h1>
			<p class="text-gray-600">Gerencie as vantagens que você oferece aos alunos.</p>
		</div>
		<button class="btn btn-primary" onclick={openCreateModal}>
			<Plus class="w-5 h-5" />
			Nova Vantagem
		</button>
	</div>

	{#await listarVantagensPorEmpresa(empresaId)}
		<div class="flex min-h-[300px] items-center justify-center">
			<div class="loading loading-spinner loading-lg text-primary"></div>
		</div>
	{:then vantagens}
		<div class="bg-base-100 border-base-300 border rounded-lg p-6 shadow-lg" transition:fly={{ y: 20, duration: 300 }}>
			<div class="mb-4">
				<div class="badge badge-lg badge-primary">Total: {vantagens.length} vantagens</div>
			</div>

			<div class="overflow-x-auto">
				<table class="table-zebra table w-full">
					<thead>
						<tr class="bg-base-200">
							<th>Imagem</th>
							<th>Descrição</th>
							<th>Valor (Moedas)</th>
							<th class="text-center">Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each vantagens as vantagem (vantagem.id)}
							<tr class="hover:bg-base-200 transition-colors duration-150">
								<td>
									<div class="w-24 h-14 bg-base-200 rounded-lg overflow-hidden">
										<img 
											src={base64ToImageUrl(vantagem.image)} 
											alt={vantagem.descricao}
											class="w-full h-full object-cover"
										/>
									</div>
								</td>
								<td class="font-medium">{vantagem.descricao}</td>
								<td class="text-primary font-semibold">{vantagem.valor}</td>
								<td class="flex justify-center gap-2">
									<button
										class="btn btn-sm btn-outline btn-primary"
										onclick={() => openEditModal(vantagem)}
									>
										<Pencil class="w-4 h-4" />
										Editar
									</button>
									<button
										class="btn btn-sm btn-outline btn-error"
										onclick={() => deleteVantagem(vantagem.id)}
									>
										<Trash class="w-4 h-4" />
										Excluir
									</button>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="text-center py-8 text-gray-500">
									Nenhuma vantagem cadastrada. Clique em "Nova Vantagem" para começar.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:catch error}
		<div class="alert alert-error shadow-lg" transition:fly={{ y: 20, duration: 300 }}>
			<X class="w-4 h-4" />
			<div>
				<h3 class="font-bold">Erro ao carregar vantagens</h3>
				<div class="text-xs">{error.message || 'Tente novamente mais tarde'}</div>
			</div>
		</div>
	{/await}
</div>

<dialog bind:this={isVantagemModal} class="modal">
	<div class="modal-box max-w-lg">
		<h3 class="text-primary mb-6 text-xl font-bold">
			{editingVantagem.id ? 'Editar Vantagem' : 'Nova Vantagem'}
		</h3>
		<form method="dialog" onsubmit={handleSubmit} class="space-y-4">
			<div class="form-control flex flex-col">
				<label class="label" for="descricao">
					<span class="label-text font-medium">Descrição da Vantagem</span>
				</label>
				<textarea
					id="descricao"
					class="textarea textarea-bordered w-full"
					rows="4"
					bind:value={editingVantagem.descricao}
					placeholder="Ex: 10% de desconto no restaurante universitário"
					required
				></textarea>
			</div>
			<div class="form-control">
				<label class="label" for="valor">
					<span class="label-text font-medium">Custo em Moedas</span>
				</label>
				<input
					type="number"
					id="valor"
					class="input input-bordered focus:input-primary w-full"
					bind:value={editingVantagem.valor}
					min="1"
					step="1"
					placeholder="Ex: 100"
					required
				/>
				<label class="label" for="valor">
					<span class="label-text-alt">Quantidade de moedas que o aluno precisará para resgatar</span>
				</label>
			</div>

			<!-- Image Upload -->
			<div class="form-control">
				<label class="label" for="image">
					<span class="label-text font-medium">Imagem da Vantagem</span>
				</label>
				<input
					type="file"
					id="image"
					bind:this={imageInput}
					accept="image/*"
					onchange={handleImageChange}
					class="file-input file-input-bordered w-full"
				/>
				<label class="label" for="image">
					<span class="label-text-alt">Selecione uma imagem (máximo 5MB)</span>
				</label>
			</div>

			<!-- Image Preview -->
			{#if editingVantagem.imagePreview}
				<div class="form-control">
					<div class="mb-2">
						<span class="font-medium text-sm">Pré-visualização</span>
					</div>
					<div class="w-full h-60 bg-base-200 rounded-lg overflow-hidden">
						<img 
							src={editingVantagem.imagePreview} 
							alt="preview"
							class="w-full h-full object-cover"
						/>
					</div>
				</div>
			{/if}

			<div class="modal-action mt-8">
				<button type="button" class="btn btn-outline" onclick={closeModal} disabled={isLoading}>
					Cancelar
				</button>
				<button type="submit" class="btn btn-primary" disabled={isLoading}>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					{editingVantagem.id ? 'Salvar Alterações' : 'Cadastrar Vantagem'}
				</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
