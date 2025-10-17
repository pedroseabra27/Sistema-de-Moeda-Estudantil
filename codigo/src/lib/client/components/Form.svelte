<script lang="ts">
	import { Home } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		title: string;
		badgeText: string;
		dividerText: string;
		footerLinkText: string;
		footerLinkHref: string;
		footerQuestion: string;
	};

	let {
		children,
		title = 'Aluguel de carros',
		badgeText = 'Criar Conta',
		dividerText = 'ou cadastre-se com',
		footerLinkText = 'Entrar',
		footerLinkHref = '/login',
		footerQuestion = 'Já possui uma conta?'
	}: Props = $props();
</script>

<div
	class="from-primary/10 to-base-100 flex min-h-screen items-center justify-center bg-gradient-to-br p-4"
>
	<div class="card bg-base-100 w-full max-w-md shadow-xl">
		<div class="card-body">
			<div class="mb-4 flex flex-col items-center gap-2">
				<div class="avatar avatar-placeholder">
					<div class="bg-primary/20 w-16 rounded-full">
						<Home class="text-primary" />
					</div>
				</div>
				<h1 class="card-title text-center text-2xl font-bold">{title}</h1>
				<div class="badge badge-primary badge-outline">{badgeText}</div>
			</div>

			<div class="divider">Preencha seus dados</div>

			<div class="form-control flex flex-col gap-3">
				{@render children()}
			</div>

			<div class="divider text-base-content/60 text-xs">{dividerText}</div>

			
			<div class="mt-4 text-center">
				<p class="text-base-content/70 text-sm">
					{footerQuestion}
					<a href={footerLinkHref} class="link link-primary link-hover font-medium"
						>{footerLinkText}</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
