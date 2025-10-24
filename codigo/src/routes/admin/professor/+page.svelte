<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import type { SelectAluno } from '$lib/server/db/aluno/schema';
	import {
		enviarMoedas,
		getHistoricoProfessor,
		getProfessorData,
		listarAlunosParaTransferencia,
		listarProfessores
	} from '$lib/client/controller/professor.remote';

	// =================================================================
	// Carregamento de Dados (Método Clássico)
	// =================================================================

	// 1. Carrega as listas estáticas (Professores e Alunos) UMA VEZ.
	const professoresDataPromise = listarProfessores();
	const alunosDataPromise = listarAlunosParaTransferencia();

	// 2. Estado do componente
	let selectedProfessorCpf = ''; // O CPF que o Admin seleciona no <select>
	let isLoading = false;

	// 3. Dados Dinâmicos (Reatividade com '$:')
	// Estas são as promessas que serão recarregadas
	let professorDetailsPromise: ReturnType<typeof getProfessorData> | null = null;
	let transacoesHistoryPromise: ReturnType<typeof getHistoricoProfessor> | null = null;

	// O "coração" da reatividade:
	// Esta função roda AUTOMATICAMENTE sempre que 'selectedProfessorCpf' mudar.
	$: if (selectedProfessorCpf) {
		// Busca os novos dados do professor selecionado
		professorDetailsPromise = getProfessorData(selectedProfessorCpf);
		transacoesHistoryPromise = getHistoricoProfessor(selectedProfessorCpf);
		// Limpa o formulário
		alunoSelecionado = '';
		quantidade = 1;
		motivo = '';
	} else {
		// Limpa os dados se nenhum professor estiver selecionado
		professorDetailsPromise = null;
		transacoesHistoryPromise = null;
	}

	// Tipo para o objeto 'professor' quando ele for resolvido
	type ProfessorData = {
		ultimaAtualizacao: Date;
		cpf: string;
		departamento: string;
		saldo: number;
		userId: string;
	};

	// =================================================================
	// Formulário de Transferência
	// =================================================================
	let alunoSelecionado: number | '' = '';
	let quantidade: number = 1;
	let motivo: string = '';

	// Esta função recebe o objeto 'professor' resolvido do bloco {:then}
	async function handleEnviarMoedas(event: SubmitEvent, professor: ProfessorData) {
		event.preventDefault();
		if (alunoSelecionado === '') {
			toast.error('Selecione um aluno');
			return;
		}

		if (quantidade > professor.saldo) {
			toast.error('Saldo do professor selecionado é insuficiente');
			return;
		}

		isLoading = true;
		const toastId = toast.loading('Enviando moedas...');

		try {
			await enviarMoedas({
				professorCpf: selectedProfessorCpf,
				alunoId: Number(alunoSelecionado),
				quantidade: quantidade,
				motivo: motivo
			});

			toast.success('Moedas enviadas com sucesso!', { id: toastId });
			// Limpa o formulário
			alunoSelecionado = '';
			quantidade = 1;
			motivo = '';
		} catch (error: any) {
			toast.error(error.message || 'Falha ao enviar moedas', { id: toastId });
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- 
  Este é o layout da sua imagem, mas para um ADMIN.
  O Admin primeiro seleciona o professor.
-->
<div class="container mx-auto p-4">
	<!-- 1. SELETOR DE PROFESSOR (Necessário para o Admin) -->
	{#await professoresDataPromise}
		<div class="mb-6">
			<!-- Você pode adicionar um spinner/loading aqui -->
			<p>Carregando professores...</p>
		</div>
	{:then professores}
		<div class="mb-6 p-6 bg-white rounded-lg shadow-lg">
			<label for="professor-select" class="block text-xl font-bold mb-4">
				Gerenciar Transferências
			</label>
			<select
				id="professor-select"
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
				bind:value={selectedProfessorCpf}
			>
				<option value="" disabled>Selecione um professor para gerenciar...</option>
				{#each professores as prof (prof.cpf)}
					<!-- NOTA: 'listarProfessores' precisa de JOIN com 'user' para mostrar o nome -->
					<option value={prof.cpf}>{prof.cpf} ({prof.departamento})</option>
				{/each}
			</select>
		</div>
	{:catch error}
		<!-- MUDANÇA AQUI: Mostra o erro completo para depuração -->
		<div class="alert alert-error">
			<div>
				<h3 class="font-bold">Erro ao carregar professores:</h3>
				<div class="text-xs">{error.message}</div>
				<pre class="text-xs whitespace-pre-wrap mt-2">{JSON.stringify(error, null, 2)}</pre>
			</div>
		</div>
	{/await}

	<!-- 
    2. PAINEL DINÂMICO (Idêntico à sua imagem)
    Só aparece DEPOIS que o Admin seleciona um professor.
  -->
	{#if selectedProfessorCpf}
		<!-- Este 'await' usa a promessa REATIVA 'professorDetailsPromise' -->
		{#await professorDetailsPromise}
			<div class="text-center py-8">
				<p>Carregando dados do professor...</p>
			</div>
		{:then professor}
			<!-- 
        CORREÇÃO APLICADA AQUI: 
        Adicionamos um {#if professor} para garantir que o objeto não é nulo 
        antes de tentar acessar suas propriedades.
      -->
			{#if professor}
				<!-- 'professor' é o objeto resolvido -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Card "Seu Saldo" (agora "Saldo do Professor") -->
					<div class="bg-white rounded-lg shadow-lg p-6">
						<h2 class="text-2xl font-bold mb-4">Saldo do Professor</h2>
						<div class="text-4xl font-bold text-blue-600">
							{professor.saldo}
							<span class="text-base font-normal">moedas</span>
						</div>
						<p class="text-sm text-gray-500 mt-2">
							Última atualização: {new Date(professor.ultimaAtualizacao).toLocaleDateString()}
						</p>
					</div>

					<!-- Formulário de Transferência -->
					<div class="bg-white rounded-lg shadow-lg p-6">
						<h2 class="text-2xl font-bold mb-4">Transferir Moedas</h2>
						{#await alunosDataPromise}
							<p>Carregando alunos...</p>
						{:then alunos}
							<!-- Passa o objeto 'professor' resolvido para o handler -->
							<form on:submit|preventDefault={(e) => handleEnviarMoedas(e, professor)} class="space-y-4">
								<div>
									<label for="aluno" class="block text-sm font-medium text-gray-700">
										Selecione o Aluno (Destino)
									</label>
									<select
										id="aluno"
										bind:value={alunoSelecionado}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
										required
										disabled={isLoading}
									>
										<option value="" disabled>Selecione um aluno</option>
										{#each alunos as aluno (aluno.id)}
											<!-- NOTA: 'listarAlunos' precisa de JOIN com 'user' para mostrar o nome -->
											<option value={aluno.id}>{aluno.cpf}</option>
										{/each}
									</select>
								</div>
								<div>
									<label for="quantidade" class="block text-sm font-medium text-gray-700">
										Quantidade de Moedas
									</label>
									<input
										type="number"
										id="quantidade"
										bind:value={quantidade}
										min="1"
										max={professor.saldo}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
										required
										disabled={isLoading}
									/>
								</div>
								<div>
									<label for="motivo" class="block text-sm font-medium text-gray-700">
										Motivo (obrigatório)
									</label>
									<textarea
										id="motivo"
										bind:value={motivo}
										rows="3"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
										required
										disabled={isLoading}
									></textarea>
								</div>
								<button
									type="submit"
									class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
									disabled={isLoading}
								>
									{#if isLoading}
										<span class="loading loading-spinner loading-sm"></span> Enviando...
									{:else}
										Enviar Moedas
									{/if}
								</button>
							</form>
						{:catch error}
							<div class="alert alert-error">
								<p>Erro ao carregar alunos: {error.message}</p>
							</div>
						{/await}
					</div>
				</div>

				<!-- Histórico de Transações -->
				<div class="mt-8 bg-white rounded-lg shadow-lg p-6">
					<h2 class="text-2xl font-bold mb-4">Histórico de Transações (Professor)</h2>
					<!-- Este 'await' usa a promessa REATIVA 'transacoesHistoryPromise' -->
					{#await transacoesHistoryPromise}
						<p>Carregando histórico...</p>
					{:then transacoes}
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Data
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Aluno (CPF)
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Quantidade
										</th>
										<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Motivo
										</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each transacoes as transacao (transacao.id)}
										<tr transition:fade>
											<td class="px-6 py-4 whitespace-nowrap">
												{transacao.data.toLocaleDateString()}
											</td>
											<td class="px-6 py-4 whitespace-nowrap">
												{transacao.alunoCPF}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-red-600 font-medium">
												- {transacao.valor}
											</td>
											<td class="px-6 py-4">
												{transacao.motivo}
											</td>
										</tr>
									{:else}
										<tr>
											<td colspan="4" class="text-center py-4 text-gray-500">
												Nenhuma transação encontrada para este professor.
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:catch error}
						<div class="alert alert-error">
							<p>Erro ao carregar histórico: {error.message}</p>
						</div>
					{/await}
				</div>
			{/if}
		{:catch error}
			<div class="alert alert-error shadow-lg">
				<div>
					<h3 class="font-bold">Erro ao carregar dados do professor</h3>
					<div class="text-xs">{error.message}</div>
				</div>
			</div>
		{/await}
	{/if}
</div>
