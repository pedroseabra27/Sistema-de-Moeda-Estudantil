<script lang="ts">
	import CommonForm from '$lib/client/components/CommonForm.svelte';
	import { alunoController } from '$lib/client/controller/aluno.remote';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let formData = $state({
		nome: '',
		email: '',
		senha: '',
		confirmarSenha: '',
		cpf: '',
		endereco: '',
		curso: ''
	});

	function maskCPF(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	}

	function handleCPFInput(event: Event) {
		const target = event.target as HTMLInputElement;
		formData.cpf = maskCPF(target.value);
	}

	async function handleCreate(userId: string) {
		try {
			await alunoController().then((c) =>
				c.criar({
					cpf: formData.cpf,
					user_id: userId,
					curso: formData.curso,
					endereco: formData.endereco
				})
			);
		} catch (error) {
			throw new Error('Erro ao criar aluno');
		}
	}
</script>

<CommonForm
	bind:formData
	handleCreate={async (uId) => {
		await handleCreate(uId);
	}}
	title={'de estudante'}
>
	<label class="input input-bordered flex w-full items-center gap-2">
		<input
			type="text"
			name="nome"
			class="grow"
			placeholder="CPF"
			required
			bind:value={formData.cpf}
			oninput={handleCPFInput}
		/>
	</label>
	<label class="input input-bordered flex w-full items-center gap-2">
		<input
			type="text"
			name="nome"
			class="grow"
			placeholder="Endereço"
			required
			bind:value={formData.endereco}
		/>
	</label>
	<label class="input input-bordered flex w-full items-center gap-2">
		<input
			type="text"
			name="nome"
			class="grow"
			placeholder="Curso"
			required
			bind:value={formData.curso}
		/>
	</label>

	{#snippet other()}
		<p class="text-base-content/70 text-sm">
			Criar como
			<a href="/signup/empresa" class="link link-primary link-hover font-medium">empresa</a>
		</p>
	{/snippet}
</CommonForm>
