<script lang="ts">
	import SidebarAluno from '$lib/client/components/SidebarAluno.svelte';
	import type { LayoutProps } from './$types';
	import SparkleEffect from '$lib/client/components/SparkleEffect.svelte';

	let { data, children }: LayoutProps = $props();

	let isSidebarOpen = $state(false);
</script>


<div class="fixed inset-0 pointer-events-none z-0">
	<SparkleEffect count={8} />
</div>

<SidebarAluno bind:isOpen={isSidebarOpen} />

<div class="transition-all duration-300 md:ml-[280px]">
	{@render children()}
</div>
