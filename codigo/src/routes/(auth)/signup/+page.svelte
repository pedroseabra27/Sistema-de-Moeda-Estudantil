<script lang="ts">
	import Form from '$lib/client/components/Form.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Form
	title="Moeda estudantil"
	badgeText="Criar Conta"
	dividerText="ou cadastre-se com"
	footerLinkText="Entrar"
	footerLinkHref="/login"
	footerQuestion="Já possui uma conta?"
>
	<p class="text-base-content/70 mb-4 text-center text-xl">
		Tipo de usuário:
		<a class="link link-primary" href="/signup/estudante">estudante</a>,
		<a class="link link-secondary" href="/signup/empresa">empresa</a>
	</p>
</Form>
