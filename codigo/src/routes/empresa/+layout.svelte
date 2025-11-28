<script lang="ts">
	import SidebarEmpresa from '$lib/client/components/SidebarEmpresa.svelte';
	import SparkleEffect from '$lib/client/components/SparkleEffect.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let isSidebarOpen = $state(false);
</script>

<div class="fixed inset-0 pointer-events-none z-0">
	<SparkleEffect count={8} />
</div>

<SidebarEmpresa bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px] relative z-10">
	{@render children()}
</div>

