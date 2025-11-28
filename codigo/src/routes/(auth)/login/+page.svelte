<script lang="ts">
	import { authClient } from '$lib/client/auth-client';
	import Form from '$lib/client/components/Form.svelte';
	import { Eye, EyeOff, Mail, Lock } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let isLoading = $state(false);
	let showPassword = $state(false);

	let email = $state('');
	let password = $state('');
	let remember = $state(false);

	async function handleSubmit() {
		isLoading = true;

		const toastId = toast.loading('Logando...');

		try {
			const { data, error } = await authClient.signIn.email(
				{
					email: email,
					password: password,
					callbackURL: '/',
					rememberMe: remember
				},
				{
					onSuccess: (ctx) => {
						toast.success('Login realizado com sucesso!', { id: toastId });
					},
					onError: (ctx) => {
						toast.error(ctx.error.message, { id: toastId });
					}
				}
			);

			if (error) {
				throw new Error(error.message);
			}
			console.log('Login data:', data);
			console.log('Login error:', error);
		} catch (error) {
			toast.error('Ocorreu um erro ao logar.', { id: toastId });
		} finally {
			isLoading = false;
		}
	}
</script>

<Form
	title="Moeda estudantil"
	badgeText="Acesso ao Sistema"
	dividerText="ou continue com"
	footerLinkText="Registrar"
	footerLinkHref="/signup"
	footerQuestion="Não tem uma conta?"
>
	<label class="input input-bordered flex w-full items-center gap-2">
		<Mail class="h-4 w-4 opacity-70" />
		<input
			type="email"
			name="email"
			class="grow"
			placeholder="Seu e-mail"
			required
			bind:value={email}
		/>
	</label>

	<label class="input input-bordered flex w-full items-center gap-2">
		<Lock class="h-4 w-4 opacity-70" />
		<input
			type={showPassword ? 'text' : 'password'}
			name="senha"
			class="grow"
			placeholder="Sua senha"
			required
			bind:value={password}
		/>
		<button
			type="button"
			class="btn btn-ghost btn-sm btn-circle"
			onclick={() => (showPassword = !showPassword)}
		>
			{#if showPassword}
				<EyeOff class="h-4 w-4" />
			{:else}
				<Eye class="h-4 w-4" />
			{/if}
		</button>
	</label>

	<div class="flex items-center justify-between">
		<label class="label cursor-pointer gap-1.5">
			<input
				type="checkbox"
				class="checkbox checkbox-primary checkbox-sm"
				bind:checked={remember}
			/>
			<span class="label-text text-xs">Lembrar-me</span>
		</label>
		<a href="/recuperar-senha" class="link link-primary link-hover text-xs">Esqueceu sua senha?</a>
	</div>

	<button class="btn btn-primary  w-full" disabled={isLoading} onclick={handleSubmit}>
		{#if isLoading}
			<span class="loading loading-spinner loading-xs"></span>
			Entrando...
		{:else}
			Entrar
		{/if}
	</button>
</Form>
