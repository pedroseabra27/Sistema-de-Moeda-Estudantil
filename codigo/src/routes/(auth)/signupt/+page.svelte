<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth-client';
	import Form from '$lib/client/components/Form.svelte';
	import { Eye, EyeOff, Mail, Lock, User, Home, AlertCircle, CheckCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let isLoading = $state(false);

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	let formData = $state({
		nome: '',
		email: '',
		senha: '',
		confirmarSenha: ''
	});

	let errors = $state({
		senha: '',
		confirmarSenha: ''
	});

	let passwordStrength = $state({
		score: 0,
		message: 'Senha fraca',
		color: 'error'
	});

	function validatePassword() {
		if (formData.senha.length < 8) {
			errors.senha = 'A senha deve ter no mínimo 8 caracteres';
			passwordStrength.score = 0;
			passwordStrength.message = 'Senha fraca';
			passwordStrength.color = 'error';
			return false;
		}

		let score = 0;
		if (formData.senha.length >= 8) score++;
		if (formData.senha.match(/[A-Z]/)) score++;
		if (formData.senha.match(/[0-9]/)) score++;
		if (formData.senha.match(/[^A-Za-z0-9]/)) score++;

		passwordStrength.score = score;

		if (score <= 1) {
			passwordStrength.message = 'Senha fraca';
			passwordStrength.color = 'error';
		} else if (score === 2) {
			passwordStrength.message = 'Senha média';
			passwordStrength.color = 'warning';
		} else if (score === 3) {
			passwordStrength.message = 'Senha boa';
			passwordStrength.color = 'info';
		} else {
			passwordStrength.message = 'Senha forte';
			passwordStrength.color = 'success';
		}

		errors.senha = '';
		return true;
	}

	function validateConfirmPassword() {
		if (formData.senha !== formData.confirmarSenha) {
			errors.confirmarSenha = 'As senhas não coincidem';
			return false;
		}

		errors.confirmarSenha = '';
		return true;
	}

	async function handleSubmit() {
		// const validPassword = validatePassword();
		const validConfirmPassword = validateConfirmPassword();

		const toastId = toast.loading('Criando sua conta...');
		if (validConfirmPassword) {
			isLoading = true;
			try {
				const { data, error } = await authClient.signUp.email(
					{
						email: formData.email,
						password: formData.senha,
						name: formData.nome
					},
					{
						onSuccess: (ctx) => {
							toast.success('Conta criada com sucesso!', { id: toastId });
						},
						onError: (ctx) => {
							toast.error(ctx.error.message, { id: toastId });
						}
					}
				);

				if (!error) {
					await goto('/');
				}

				console.log('SignUp data:', data);
				console.log('SignUp error:', error);
			} catch (error) {
				toast.error('Ocorreu um erro ao criar sua conta.', { id: toastId });
			} finally {
				isLoading = false;
			}
		}
	}
</script>

<Form
	title="Aluguel de carros"
	badgeText="Criar Conta"
	dividerText="ou cadastre-se com"
	footerLinkText="Entrar"
	footerLinkHref="/login"
	footerQuestion="Já possui uma conta?"
>
	<label class="input input-bordered flex w-full items-center gap-2" data-theme="light">
		<User class="h-4 w-4 opacity-70" />
		<input
			type="text"
			name="nome"
			class="grow"
			placeholder="Nome completo"
			required
			bind:value={formData.nome}
		/>
	</label>

	<label class="input input-bordered flex w-full items-center gap-2" data-theme="light">
		<Mail class="h-4 w-4 opacity-70" />
		<input
			type="email"
			name="email"
			class="grow"
			placeholder="Seu melhor e-mail"
			required
			bind:value={formData.email}
		/>
	</label>

	<div>
		<label class="input input-bordered flex w-full items-center gap-2" data-theme="light">
			<Lock class="h-4 w-4 opacity-70" />
			<input
				type={showPassword ? 'text' : 'password'}
				name="senha"
				class="grow"
				placeholder="Crie uma senha forte"
				required
				bind:value={formData.senha}
				oninput={validatePassword}
				onblur={validatePassword}
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

		<!-- {#if formData.senha}
			<div class="mt-2">
				<div class="mb-1 flex items-center justify-between">
					<span class="text-xs text-{passwordStrength.color}">{passwordStrength.message}</span>
					<span class="text-xs">{passwordStrength.score}/4</span>
				</div>
				<progress
					class="progress progress-{passwordStrength.color} h-1 w-full"
					value={passwordStrength.score}
					max="4"
				></progress>

				<div class="mt-2 grid grid-cols-2 gap-1">
					<div class="flex items-center gap-1">
						<div
							class={`size-3 rounded-full ${formData.senha.length >= 8 ? 'bg-success' : 'bg-base-300'}`}
						></div>
						<span class="text-xs">8+ caracteres</span>
					</div>
					<div class="flex items-center gap-1">
						<div
							class={`size-3 rounded-full ${formData.senha.match(/[A-Z]/) ? 'bg-success' : 'bg-base-300'}`}
						></div>
						<span class="text-xs">Maiúsculas</span>
					</div>
					<div class="flex items-center gap-1">
						<div
							class={`size-3 rounded-full ${formData.senha.match(/[0-9]/) ? 'bg-success' : 'bg-base-300'}`}
						></div>
						<span class="text-xs">Números</span>
					</div>
					<div class="flex items-center gap-1">
						<div
							class={`size-3 rounded-full ${formData.senha.match(/[^A-Za-z0-9]/) ? 'bg-success' : 'bg-base-300'}`}
						></div>
						<span class="text-xs">Caracteres especiais</span>
					</div>
				</div>
			</div>
		{/if} -->

		{#if errors.senha}
			<div class="text-error mt-1 flex items-center gap-1 text-xs">
				<AlertCircle class="h-3 w-3" />
				{errors.senha}
			</div>
		{/if}
	</div>

	<div>
		<label class="input input-bordered flex w-full items-center gap-2" data-theme="light">
			<Lock class="h-4 w-4 opacity-70" />
			<input
				type={showConfirmPassword ? 'text' : 'password'}
				name="confirmarSenha"
				class="grow"
				placeholder="Confirme sua senha"
				required
				bind:value={formData.confirmarSenha}
				onblur={validateConfirmPassword}
			/>
			<button
				type="button"
				class="btn btn-ghost btn-sm btn-circle"
				onclick={() => (showConfirmPassword = !showConfirmPassword)}
			>
				{#if showConfirmPassword}
					<EyeOff class="h-4 w-4" />
				{:else}
					<Eye class="h-4 w-4" />
				{/if}
			</button>
		</label>
		{#if errors.confirmarSenha}
			<div class="text-error mt-1 flex items-center gap-1 text-xs">
				<AlertCircle class="h-3 w-3" />
				{errors.confirmarSenha}
			</div>
		{:else if formData.senha && formData.confirmarSenha && formData.senha === formData.confirmarSenha}
			<div class="text-success mt-1 flex items-center gap-1 text-xs">
				<CheckCircle class="h-3 w-3" />
				As senhas coincidem
			</div>
		{/if}
	</div>

	<button class="btn btn-primary mt-2 w-full" disabled={isLoading} onclick={handleSubmit}>
		{#if isLoading}
			<span class="loading loading-spinner loading-xs"></span>
			Criando conta...
		{:else}
			Criar conta
		{/if}
	</button>
</Form>
