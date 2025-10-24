<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		UsersIcon,
		LogOutIcon,
		type Icon as IconType,
		LayoutDashboard,
		PackageOpen,
		Store,
		Cog,
		User,
		GraduationCap 
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

	const navigationItems: SidebarItem[] = $derived([
		{
			icon: User,
			label: 'Alunos',
			href: '/admin/alunos'
		},
		{
			icon: PackageOpen,
			label: 'Empresas',
			href: '/admin/empresas'
		},
		{
			icon: GraduationCap,
			label: 'Professores',
			href: '/admin/professor'
		}
	]);

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
	class={[
		'bg-base-100 fixed left-0 top-0 z-50 flex h-full w-[280px] transform flex-col shadow-xl transition-transform duration-300',
		isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
	]}
>
	<div class="border-base-200 border-b p-4">
		<div class="flex items-center">
			<span class="mx-3 text-lg font-bold text-[var(--sidebar-foreground)]">Sistema de Moeda</span>
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
			{#if $session.data}
				{#each settingsItems as item}
					<button
						onclick={async () => {
							await authClient.signOut();
							await goto('/login');
						}}
						class="text-base-content hover:bg-base-200 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 transition-colors"
					>
						<item.icon class="h-5 w-5" />
						<span class="font-medium">{item.label}</span>
					</button>
				{/each}
			{:else}
				{@render button({ icon: UsersIcon, label: 'Login', href: '/login' })}
			{/if}
		</div>
	</div>
</aside>

{#snippet button(item: SidebarItem)}
	{#if item.disabled}
		<div
			class="text-base-content flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-2 opacity-50"
			aria-disabled="true"
		>
			<item.icon class="h-4 w-4" />
			<span class="text-md font-medium">{item.label}</span>
		</div>
	{:else}
		<a
			href={item.href}
			class={[
				'flex items-center gap-3 rounded-lg px-4 py-2 transition-colors',
				currentPath === item.href
					? 'bg-primary text-primary-content'
					: 'text-base-content hover:bg-base-200'
			]}
		>
			<item.icon class="h-4 w-4" />
			<span class="text-md font-medium">{item.label}</span>
		</a>
	{/if}
{/snippet}
