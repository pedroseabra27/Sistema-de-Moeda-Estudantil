<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: {data:PageData} = $props();
</script>

<div class="p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Portal do Professor</h1>
		<p class="text-gray-600">Bem-vindo(a), {data.user.name || data.user.email}!</p>
	</div>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div
			class="card border-base-200 from-primary to-primary-focus text-primary-content border bg-gradient-to-br shadow-lg transition-shadow hover:shadow-xl"
		>
			<div class="card-body">
				<h2 class="card-title text-lg">Saldo Disponível</h2>
				<p class="text-4xl font-bold">{data.professor.saldo}</p>
				<p class="text-sm opacity-80">moedas estudantis</p>
			</div>
		</div>

		<div class="card border-base-200 bg-base-100 border shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Alunos</h2>
				<p>Gerencie seus alunos e suas vantagens.</p>
				<div class="card-actions justify-end">
					<a href="/professor/alunos" class="btn btn-primary">Ver Alunos</a>
				</div>
			</div>
		</div>

		<div class="card border-base-200 bg-base-100 border shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Histórico</h2>
				<p>Acompanhe suas transações.</p>
				<div class="card-actions justify-end">
					<a href="/professor/historico" class="btn btn-primary">Ver Histórico</a>
				</div>
			</div>
		</div>
	</div>
</div>
