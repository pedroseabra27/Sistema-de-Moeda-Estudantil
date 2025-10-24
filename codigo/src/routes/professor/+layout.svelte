<script lang="ts">
	import SidebarProfessor from '$lib/client/components/SidebarProfessor.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let isSidebarOpen = $state(false);
</script>

<SidebarProfessor bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px]">
	{@render children()}
</div>

