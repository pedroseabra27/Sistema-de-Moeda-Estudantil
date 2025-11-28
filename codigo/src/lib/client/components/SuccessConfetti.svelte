<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		trigger?: boolean;
		duration?: number;
	}

	let { trigger = false, duration = 3000 }: Props = $props();

	type Confetti = {
		id: number;
		left: number;
		size: number;
		color: string;
		delay: number;
		duration: number;
		rotation: number;
	};

	let confettiPieces: Confetti[] = $state([]);
	let showConfetti = $state(false);

	const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#fb7185'];
	const rand = (min: number, max: number) => Math.random() * (max - min) + min;

	$effect(() => {
		if (trigger) {
			showConfetti = true;
			confettiPieces = Array.from({ length: 40 }).map((_, i) => ({
				id: i,
				left: rand(0, 100),
				size: rand(8, 16),
				color: colors[Math.floor(rand(0, colors.length))],
				delay: rand(0, 0.5),
				duration: rand(2, 3.5),
				rotation: rand(0, 360)
			}));

			setTimeout(() => {
				showConfetti = false;
			}, duration);
		}
	});
</script>

{#if showConfetti}
	<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
		{#each confettiPieces as piece (piece.id)}
			<div
				class="confetti-fall absolute"
				style="left:{piece.left}%; width:{piece.size}px; height:{piece.size}px; background:{piece.color}; animation-delay:{piece.delay}s; animation-duration:{piece.duration}s; transform:rotate({piece.rotation}deg);"
			></div>
		{/each}
	</div>
{/if}

<style>
	.confetti-fall {
		animation: confettiFall linear forwards;
		border-radius: 2px;
	}

	@keyframes confettiFall {
		0% {
			top: -10%;
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
		100% {
			top: 110%;
			opacity: 0;
			transform: translateY(0) rotate(720deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.confetti-fall {
			animation: none !important;
			display: none;
		}
	}
</style>
