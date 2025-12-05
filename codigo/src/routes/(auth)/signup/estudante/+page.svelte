<script lang="ts">
	import AuthLayout from '$lib/client/components/AuthLayout.svelte';
	import { inserirAluno } from '$lib/client/controller/aluno.remote';
	import type { PageProps } from './$types';
	import { authClient } from '$lib/client/auth-client';
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

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

	let isLoading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	let errors = $state({
		senha: '',
		confirmarSenha: ''
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

	function validateConfirmPassword() {
		if (formData.senha !== formData.confirmarSenha) {
			errors.confirmarSenha = 'As senhas não coincidem';
			return false;
		}
		errors.confirmarSenha = '';
		return true;
	}

	async function handleCreate(userId: string) {
		try {
			await inserirAluno({
				cpf: formData.cpf,
				user_id: userId,
				curso: formData.curso,
				endereco: formData.endereco
			});
		} catch (error) {
			throw new Error('Erro ao criar aluno');
		}
	}

	async function handleSubmit() {
		const validConfirmPassword = validateConfirmPassword();

		const toastId = toast.loading('Criando sua conta...');
		if (validConfirmPassword) {
			isLoading = true;
			try {
				const { data: authData, error } = await authClient.signUp.email(
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
					await handleCreate(authData.user.id);
					await goto('/aluno');
				}
			} catch (error) {
				toast.error('Ocorreu um erro ao criar sua conta.', { id: toastId });
			} finally {
				isLoading = false;
			}
		}
	}

	async function handleSubmitForm(e: Event) {
		e.preventDefault();
		await handleSubmit();
	}
</script>

<AuthLayout>
	<div class="space-y-6">
		<div class="animate-in slide-in-up space-y-2 text-center duration-700">
			<h1 class="text-3xl font-bold" style="color: var(--color-base-content);">
				Criar Conta de Estudante
			</h1>
			<p style="color: var(--color-base-content); opacity: 0.7;">
				Comece sua jornada ganhando moedas
			</p>
		</div>

		<form onsubmit={handleSubmitForm} class="space-y-4">
			<div class="animate-in slide-in-up delay-75 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<User class="h-4 w-4 opacity-70" />
					<input
						type="text"
						name="nome"
						class="grow w-full"
						placeholder="Nome Completo"
						required
						bind:value={formData.nome}
					/>
				</label>
			</div>

			<div class="animate-in slide-in-up delay-100 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<Mail class="h-4 w-4 opacity-70" />
					<input
						type="email"
						name="email"
						class="grow w-full"
						placeholder="seu@email.com"
						required
						bind:value={formData.email}
					/>
				</label>
			</div>

			<div class="animate-in slide-in-up delay-125 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<input
						type="text"
						name="cpf"
						class="grow w-full"
						placeholder="CPF (000.000.000-00)"
						required
						bind:value={formData.cpf}
						oninput={handleCPFInput}
					/>
				</label>
			</div>

			<div class="animate-in slide-in-up delay-150 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<input
						type="text"
						name="endereco"
						class="grow w-full"
						placeholder="Endereço"
						required
						bind:value={formData.endereco}
					/>
				</label>
			</div>

			<div class="animate-in slide-in-up delay-175 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<input
						type="text"
						name="curso"
						class="grow w-full"
						placeholder="Curso"
						required
						bind:value={formData.curso}
					/>
				</label>
			</div>

			<div class="animate-in slide-in-up delay-200 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<Lock class="h-4 w-4 opacity-70" />
					<input
						type={showPassword ? 'text' : 'password'}
						name="senha"
						class="grow w-full"
						placeholder="Senha"
						required
						bind:value={formData.senha}
					/>
					<button
						type="button"
						class="btn btn-ghost btn-sm btn-circle"
						onclick={() => (showPassword = !showPassword)}
						tabindex="0"
					>
						{#if showPassword}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
				</label>
			</div>

			<div class="animate-in slide-in-up delay-225 duration-700">
				<label class="input input-bordered w-full flex items-center gap-2">
					<Lock class="h-4 w-4 opacity-70" />
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						name="confirmarSenha"
						class="grow w-full"
						placeholder="Confirmar Senha"
						required
						bind:value={formData.confirmarSenha}
						onblur={validateConfirmPassword}
					/>
					<button
						type="button"
						class="btn btn-ghost btn-sm btn-circle"
						onclick={() => (showConfirmPassword = !showConfirmPassword)}
						tabindex="0"
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

			<button
				type="submit"
				class="btn btn-primary animate-in slide-in-up delay-250 btn-gamified mt-6 w-full font-bold text-white duration-700"
				disabled={isLoading}
			>
				{#if isLoading}
					<span class="loading loading-spinner loading-xs"></span>
					Criando conta...
				{:else}
					Criar Conta
				{/if}
			</button>
		</form>

		<p
			class="animate-in slide-in-up text-center text-sm delay-300 duration-700"
			style="color: var(--color-base-content); opacity: 0.7;"
		>
			Criar como <a href="/signup/empresa" class="link link-primary link-hover font-semibold"
				>empresa</a
			>?
		</p>
		<p
			class="animate-in slide-in-up text-center text-sm delay-300 duration-700"
			style="color: var(--color-base-content); opacity: 0.7;"
		>
			Já tem uma conta? <a href="/login" class="link link-primary link-hover font-semibold"
				>Entrar</a
			>
		</p>
	</div>
</AuthLayout>
