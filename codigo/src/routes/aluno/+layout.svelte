<script lang="ts">
	import SidebarAluno from '$lib/client/components/SidebarAluno.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let isSidebarOpen = $state(false);
</script>

<SidebarAluno bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px]">
	{@render children()}
</div>
