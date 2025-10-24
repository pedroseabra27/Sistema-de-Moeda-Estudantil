<script lang="ts">
	import CommonForm from '$lib/client/components/CommonForm.svelte';
	import { inserirEmpresa } from '$lib/client/controller/empresa.remote';
	import type { PageProps } from './$types';
			import { authClient } from '$lib/client/auth-client';

	let { data }: PageProps = $props();

	let formData = $state({
		nome: '',
		email: '',
		senha: '',
		confirmarSenha: '',
		cnpj: '',
		endereco: '',
		curso: ''
	});

	function maskCNPJ(value: string) {
		return value
			.replace(/\D/g, '')
			.replace(/^(\d{2})(\d)/, '$1.$2')
			.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
			.replace(/\.(\d{3})(\d)/, '.$1/$2')
			.replace(/(\d{4})(\d)/, '$1-$2')
			.replace(/(-\d{2})\d+?$/, '$1');
	}

	function handleCNPJinput(event: Event) {
		const target = event.target as HTMLInputElement;
		formData.cnpj = maskCNPJ(target.value);
	}

	async function handleCreate(userId: string) {
		try {
			await inserirEmpresa({
				cnpj: formData.cnpj,
				user_id: userId
			});

			// const user = await authClient.admin.setRole({
			// 	userId,
			// 	role: 'empresa'
			// });

			// console.log('Empresa criada com sucesso:', user);
		} catch (error) {
			throw new Error('Erro ao criar empresa');
		}
	}
</script>

<CommonForm
redirect={"/empresa"}
	bind:formData
	handleCreate={async (uId) => {
		await handleCreate(uId);
	}}
	title={'para empresa'}
>
	<label class="input input-bordered flex w-full items-center gap-2">
		<input
			type="text"
			name="nome"
			class="grow"
			placeholder="CNPJ"
			required
			bind:value={formData.cnpj}
			oninput={handleCNPJinput}
		/>
	</label>
	{#snippet other()}
		<p class="text-base-content/70 text-sm">
			Criar como
			<a href="/signup/estudante" class="link link-primary link-hover font-medium">estudante</a>
		</p>
	{/snippet}
</CommonForm>
