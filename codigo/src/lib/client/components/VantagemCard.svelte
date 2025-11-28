<script lang="ts">
	import { Coins, Building2, Sparkles } from '@lucide/svelte';
	import { base64ToImageUrl } from '$lib/client/utils/image';
	import type { ListarVantagesWithEmpresa } from '$lib/client/controller/vantagem.remote';
	import { formatCurrency } from '../utils';
	import SparkleEffect from './SparkleEffect.svelte';

	interface Props {
		vantagem: ListarVantagesWithEmpresa;
		canAfford: boolean;
		isLoading: boolean;
		onResgate: () => void;
	}

	let { vantagem, canAfford, isLoading, onResgate }: Props = $props();

	let imageUrl = base64ToImageUrl(vantagem.image);
</script>

<div class="card border border-base-300 bg-base-100 shadow-lg card-hover-lift card-shine relative {!canAfford ? 'opacity-60 grayscale' : ''}">
	{#if canAfford}
		<SparkleEffect count={4} />
	{/if}
	
	<figure class="relative w-full h-48 bg-base-200 overflow-hidden">
		<img 
			src={imageUrl} 
			alt={vantagem.descricao}
			class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
		/>
		<div class="absolute top-3 right-3 badge-primary badge badge-lg font-bold flex items-center gap-1 px-3">
			<Coins class="w-4 h-4" />
			{formatCurrency(vantagem.valor)}
		</div>
	</figure>

	<div class="card-body">
		<p class="text-base-content text-lg font-semibold flex items-center gap-2">
			{#if canAfford}
				<Sparkles class="w-4 h-4 text-yellow-400" />
			{/if}
			{vantagem.descricao.slice(0, 1).toUpperCase() + vantagem.descricao.slice(1)}
		</p>

		{#if vantagem.empresa}
			<div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
				<Building2 class="w-4 h-4" />
				<span>Empresa: {vantagem.empresa.user?.name}</span>
			</div>
		{/if}

		<div class="card-actions justify-end">
			{#if canAfford}
				<button 
					class="btn btn-primary w-full btn-gamified relative overflow-hidden" 
					onclick={onResgate}
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<Sparkles class="w-4 h-4" />
						Resgatar
					{/if}
				</button>
			{:else}
				<button class="btn btn-disabled w-full">
					Saldo insuficiente
				</button>
			{/if}
		</div>
	</div>
</div>
