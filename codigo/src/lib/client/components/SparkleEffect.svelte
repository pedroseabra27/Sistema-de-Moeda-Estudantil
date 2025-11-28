<script lang="ts">
	import { onMount } from 'svelte';

	export let active = true;
	export let count = 6;

	type Sparkle = {
		id: number;
		left: number;
		top: number;
		delay: number;
		size: number;
	};

	let mounted = false;
	let sparkles: Sparkle[] = [];

	const rand = (min: number, max: number) => Math.random() * (max - min) + min;

	onMount(() => {
		mounted = true;
		if (!active) return;

		sparkles = Array.from({ length: count }).map((_, i) => ({
			id: i,
			left: rand(5, 95),
			top: rand(5, 95),
			delay: rand(0, 2),
			size: rand(4, 10)
		}));
	});
</script>

{#if mounted && active}
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each sparkles as sparkle (sparkle.id)}
			<div
				class="sparkle absolute"
				style="left:{sparkle.left}%; top:{sparkle.top}%; width:{sparkle.size}px; height:{sparkle.size}px; animation-delay:{sparkle.delay}s;"
			>
				<svg viewBox="0 0 24 24" fill="none" class="h-full w-full">
					<path
						d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
						fill="currentColor"
						class="text-yellow-300"
					/>
				</svg>
			</div>
		{/each}
	</div>
{/if}

<style>
	.sparkle {
		animation: sparkleAnim 2s ease-in-out infinite;
		opacity: 0;
	}

	@keyframes sparkleAnim {
		0%,
		100% {
			opacity: 0;
			transform: scale(0) rotate(0deg);
		}
		50% {
			opacity: 1;
			transform: scale(1) rotate(180deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sparkle {
			animation: none !important;
			display: none;
		}
	}
</style>
