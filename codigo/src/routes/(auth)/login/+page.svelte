<script lang="ts">
	import { authClient } from '$lib/client/auth-client';
	import AuthLayout from '$lib/client/components/AuthLayout.svelte';
	import { Eye, EyeOff, Mail, Lock, LogIn } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let isLoading = $state(false);
	let showPassword = $state(false);

	let email = $state('');
	let password = $state('');
	let remember = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
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

<AuthLayout>
	<div class="space-y-6">
		<div class="animate-in slide-in-up space-y-2 text-center duration-700">
			<h1 class="text-3xl font-bold" style="color: var(--color-base-content);">
				Bem-vindo de volta!
			</h1>
			<p style="color: var(--color-base-content); opacity: 0.7;">
				Acesse sua conta para começar a ganhar moedas
			</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-4">
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

			<div class="flex flex-col">
				<button
					type="submit"
					class="btn btn-primary animate-in slide-in-up btn-gamified mt-6 w-full gap-2 font-bold text-white delay-300 duration-700"
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="loading loading-spinner loading-xs"></span>
						Entrando...
					{:else}
						<LogIn class="h-4 w-4" />
						Entrar
					{/if}
				</button>
			</div>
		</form>

		<p
			class="animate-in slide-in-up delay-400 text-center text-sm duration-700"
			style="color: var(--color-base-content); opacity: 0.7;"
		>
			Não tem uma conta? <a href="/signup" class="link link-primary link-hover font-semibold"
				>Registre-se</a
			>
		</p>
	</div>
</AuthLayout>
