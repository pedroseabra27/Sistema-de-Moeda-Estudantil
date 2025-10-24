<script lang="ts">
	import { Wallet } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="container mx-auto p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Meu Saldo</h1>
		<p class="text-gray-600">Acompanhe seu saldo de moedas estudantis.</p>
	</div>

	<!-- Card Principal de Saldo -->
	<div class="flex justify-center">
		<div
			class="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl w-full max-w-2xl"
		>
			<div class="card-body items-center text-center p-12">
				<Wallet class="w-24 h-24 mb-6" />
				<h2 class="card-title text-3xl mb-4">Saldo Disponível</h2>
				<p class="text-7xl font-bold mb-4">{data.aluno.saldo}</p>
				<p class="text-xl opacity-80">moedas estudantis</p>
			</div>
		</div>
	</div>
</div>
