<script lang="ts">
	let { data } = $props();
</script>

<div class=" p-4">
	<div class="mb-8">
		<h1 class="text-primary mb-2 text-3xl font-bold">Portal da Empresa</h1>
		<p class="text-gray-600">Bem-vindo(a), {data.user.name || data.user.email}!</p>
		<p class="text-gray-500 text-sm mt-1">CNPJ: {data.empresa.cnpj}</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="card border border-base-200 bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Minhas Vantagens</h2>
				<p>Cadastre e gerencie as vantagens oferecidas aos alunos.</p>
				<div class="card-actions justify-end">
					<a href="/empresa/vantagens" class="btn btn-primary">Acessar</a>
				</div>
			</div>
		</div>

		<!-- <div class="card border border-base-200 bg-base-100 shadow-lg">
			<div class="card-body">
				<h2 class="card-title">Histórico</h2>
				<p>Visualize o histórico de resgates das suas vantagens.</p>
				<div class="card-actions justify-end">
					<a href="/empresa/historico" class="btn btn-primary">Acessar</a>
				</div>
			</div>
		</div> -->
	</div>
</div>
