<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		LogOutIcon,
		type Icon as IconType,
		LayoutDashboard,
		Package,
		History
	} from '@lucide/svelte';
	import { page } from '$app/state';
	import { authClient } from '$lib/client/auth-client';
	import { goto } from '$app/navigation';

	type Props = {
		isOpen: boolean;
	};

	let { isOpen = $bindable(false) }: Props = $props();

	type SidebarItem = {
		icon: typeof IconType;
		label: string;
		href?: string;
		disabled?: boolean;
	};

	const navigationItems: SidebarItem[] = [
		{
			icon: LayoutDashboard,
			label: 'Dashboard',
			href: '/empresa'
		},
		{
			icon: Package,
			label: 'Minhas Vantagens',
			href: '/empresa/vantagens'
		},
		// {
		// 	icon: History,
		// 	label: 'Histórico',
		// 	href: '/empresa/historico',
		// 	disabled: true
		// }
	];

	const settingsItems: SidebarItem[] = [{ icon: LogOutIcon, label: 'Sair' }];

	const currentPath = $derived(page.url.pathname);

	const session = authClient.useSession();
</script>

{#if isOpen}
	<button
		type="button"
		aria-label="open-sidebar"
		class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
		onclick={() => (isOpen = false)}
		transition:fade
	></button>
{/if}

<aside
	class="bg-base-100 fixed left-0 border border-r border-base-300 top-0 z-50 flex h-full w-[280px] transform flex-col shadow-xl transition-transform duration-300 {isOpen
		? 'translate-x-0'
		: '-translate-x-full md:translate-x-0'}"
>
	<div class="border-base-200 border-b p-4">
		<div class="flex items-center">
			<span class="mx-3 text-lg font-bold">Portal Empresa</span>
		</div>
	</div>

	<nav class="flex-1 p-4">
		<div class="space-y-1">
			{#each navigationItems as item}
				{@render button(item)}
			{/each}
		</div>
	</nav>

	<div class="border-base-200 border-t p-3">
		{#if $session?.data?.user}
			<div class="mb-2 flex items-center gap-3 p-2">
				<img
					src={$session.data.user.image ||
						'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'}
					alt={$session.data.user.name}
					class="h-10 w-10 rounded-full"
				/>
				<div>
					<h4 class="text-base-content font-medium">{$session.data.user.name}</h4>
					<p class="text-base-content text-sm opacity-65">{$session.data.user.email}</p>
				</div>
			</div>
		{/if}

		<div class="space-y-1">
			{#each settingsItems as item}
				{@render button(item)}
			{/each}
		</div>
	</div>
</aside>

{#snippet button(item: SidebarItem)}
	{#if item.href}
		<a
			href={item.href}
			class="hover:bg-base-200 text-base-content flex w-full items-center rounded-lg p-3 transition-colors {currentPath ===
			item.href
				? 'bg-primary text-primary-content'
				: ''} {item.disabled ? 'pointer-events-none opacity-50' : ''}"
		>
			<svelte:component this={item.icon} class="h-5 w-5" />
			<span class="ml-3 text-sm font-medium">{item.label}</span>
		</a>
	{:else}
		<button
			type="button"
			class="hover:bg-base-200 text-base-content flex w-full items-center rounded-lg p-3 transition-colors"
			onclick={async () => {
				if (item.label === 'Sair') {
					await authClient.signOut();
					goto('/login');
				}
			}}
		>
			<svelte:component this={item.icon} class="h-5 w-5" />
			<span class="ml-3 text-sm font-medium">{item.label}</span>
		</button>
	{/if}
{/snippet}

