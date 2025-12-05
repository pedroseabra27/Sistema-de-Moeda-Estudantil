<script lang="ts">
	import illustrationUrl from '$lib/client/assets/puc.jpeg';
	import logoUrl from '$lib/client/assets/logo.png';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col md:flex-row">
	<!-- Left side - Illustration -->
	<div
		class="hidden items-center justify-center overflow-hidden md:flex md:w-1/2"
		style="background: var(--color-primary)"
	>
		<div class="animate-slide-in-left relative h-full w-full duration-1000">
			<img src={illustrationUrl} alt="Auth illustration" class="h-full w-full object-cover" />
		</div>
	</div>

	<!-- Right side - Form -->
	<div
		class="flex w-full flex-col items-center justify-center p-4 md:w-1/2 md:p-8"
		style="background: var(--color-base-100)"
	>
		<!-- Logo -->
		<a href="/" class="zoom-in mb-8 duration-700">
			<img src={logoUrl} alt="BNP - Portal" class="logo-coin h-12 w-12" />
		</a>

		<!-- Form content -->
		<div class="animate-slide-in-right w-full max-w-sm duration-1000">
			{@render children()}
		</div>
	</div>
</div>
