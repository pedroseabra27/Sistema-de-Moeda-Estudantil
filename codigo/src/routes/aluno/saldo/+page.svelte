<script lang="ts">
	import { Wallet, TrendingUp, Gift, History as HistoryIcon } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="container mx-auto p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Meu Saldo</h1>
		<p class="text-gray-600">Acompanhe seu saldo de moedas estudantis.</p>
	</div>

	<!-- Card Principal de Saldo -->
	<div class="mb-8">
		<div class="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl">
			<div class="card-body items-center text-center p-8">
				<Wallet class="w-20 h-20 mb-4" />
				<h2 class="card-title text-2xl mb-2">Saldo Disponível</h2>
				<p class="text-6xl font-bold mb-2">{data.aluno.saldo}</p>
				<p class="text-lg opacity-80">moedas estudantis</p>
			</div>
		</div>
	</div>

	<!-- Cards de Informação -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Card Informações do Aluno -->
		<div class="card bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title text-lg mb-3">
					<TrendingUp class="w-5 h-5" />
					Suas Informações
				</h2>
				<div class="space-y-2">
					<div>
						<p class="text-sm text-gray-500">Nome</p>
						<p class="font-semibold">{data.user.name || data.user.email}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Curso</p>
						<p class="font-semibold">{data.aluno.curso}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">CPF</p>
						<p class="font-semibold">{data.aluno.cpf}</p>
					</div>
					{#if data.aluno.endereco}
						<div>
							<p class="text-sm text-gray-500">Endereço</p>
							<p class="font-semibold">{data.aluno.endereco}</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Card Vantagens -->
		<div class="card bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title text-lg mb-3">
					<Gift class="w-5 h-5" />
					Vantagens
				</h2>
				<p class="text-gray-600 mb-4">
					Troque suas moedas por benefícios exclusivos oferecidos pelas empresas parceiras.
				</p>
				<div class="card-actions justify-end mt-auto">
					<a href="/aluno/vantagens" class="btn btn-primary btn-sm">Ver Vantagens</a>
				</div>
			</div>
		</div>

		<!-- Card Histórico -->
		<div class="card bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title text-lg mb-3">
					<HistoryIcon class="w-5 h-5" />
					Histórico
				</h2>
				<p class="text-gray-600 mb-4">
					Acompanhe todas as suas transações, recebimentos de moedas e resgates de vantagens.
				</p>
				<div class="card-actions justify-end mt-auto">
					<a href="/aluno/historico" class="btn btn-primary btn-sm btn-disabled">Em breve</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Dicas -->
	<div class="mt-8">
		<div class="alert alert-info">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<h3 class="font-bold">Como ganhar mais moedas?</h3>
				<p class="text-sm">
					Professores podem reconhecer seu bom desempenho acadêmico transferindo moedas para você.
					Continue se dedicando aos estudos!
				</p>
			</div>
		</div>
	</div>
</div>
