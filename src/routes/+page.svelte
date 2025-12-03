<script lang="ts">
	import { onDestroy } from 'svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { expensesStore } from '$lib/stores/expenses.svelte';
	import { budgetStore } from '$lib/stores/budget.svelte';
	import Login from '$lib/components/Login.svelte';
	import AddExpense from '$lib/components/AddExpense.svelte';
	import BudgetSummary from '$lib/components/BudgetSummary.svelte';
	import ExpenseList from '$lib/components/ExpenseList.svelte';
	import Settings from '$lib/components/Settings.svelte';

	let showSettings = $state(false);

	$effect(() => {
		if (authStore.user) {
			expensesStore.subscribe();
			budgetStore.subscribe();
		}
	});

	onDestroy(() => {
		expensesStore.unsubscribeFromExpenses();
		budgetStore.unsubscribeFromBudget();
	});
</script>

{#if authStore.loading}
	<div class="min-h-screen flex items-center justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if !authStore.user}
	<Login />
{:else}
	<div class="max-w-md mx-auto p-4 pb-24 flex flex-col gap-4">
		<header class="flex justify-between items-center">
			<h1 class="text-xl font-bold">🍽️ Spare Mat</h1>
			<button class="btn btn-ghost btn-sm btn-circle" onclick={() => (showSettings = !showSettings)}>
				⚙️
			</button>
		</header>

		{#if showSettings}
			<Settings onclose={() => (showSettings = false)} />
		{:else}
			<BudgetSummary />
			<AddExpense />
			<ExpenseList />
		{/if}
	</div>
{/if}
