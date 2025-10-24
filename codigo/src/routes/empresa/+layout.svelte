<script lang="ts">
	import SidebarEmpresa from '$lib/client/components/SidebarEmpresa.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let isSidebarOpen = $state(false);
</script>

<SidebarEmpresa bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px]">
	{@render children()}
</div>

