<script lang="ts">
	let { data } = $props();
</script>

<div class="p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Portal do Aluno</h1>
		<p class="text-gray-600">Bem-vindo(a), {data.user.name || data.user.email}!</p>
		<p class="text-gray-500 text-sm mt-1">Curso: {data.aluno.curso}</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<div class="card border border-base-200 bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg hover:shadow-xl transition-shadow">
			<div class="card-body">
				<h2 class="card-title text-lg">Saldo Disponível</h2>
				<p class="text-4xl font-bold">{data.aluno.saldo}</p>
				<p class="text-sm opacity-80">moedas estudantis</p>
			</div>
		</div>

		<div class="card border border-base-200 bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Vantagens</h2>
				<p>Troque suas moedas por benefícios exclusivos.</p>
				<div class="card-actions justify-end">
					<a href="/aluno/vantagens" class="btn btn-primary">Ver Vantagens</a>
				</div>
			</div>
		</div>

		<div class="card border border-base-200 bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Meus Resgates</h2>
				<p>Veja as vantagens que você já resgatou.</p>
				<div class="card-actions justify-end">
					<a href="/aluno/resgates" class="btn btn-primary">Ver Resgates</a>
				</div>
			</div>
		</div>

		<div class="card border border-base-200 bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Histórico</h2>
				<p>Acompanhe suas transações e resgates.</p>
				<div class="card-actions justify-end">
					<a href="/aluno/historico" class="btn btn-primary">Ver Histórico</a>
				</div>
			</div>
		</div>
	</div>
</div>
