<script lang="ts">
	import { expensesStore } from '$lib/stores/expenses.svelte';
	import { formatCurrency, formatDate, getWeekStart, getWeekEnd, isDateInRange } from '$lib/utils/date';

	const weekStart = getWeekStart();
	const weekEnd = getWeekEnd();

	const weekExpenses = $derived(
		expensesStore.expenses.filter((e) => isDateInRange(e.createdAt, weekStart, weekEnd))
	);

	let deletingId = $state<string | null>(null);

	async function handleDelete(id: string) {
		if (!confirm('Slette denne utgiften?')) return;
		deletingId = id;
		try {
			await expensesStore.deleteExpense(id);
		} finally {
			deletingId = null;
		}
	}
</script>

<div class="card bg-base-200">
	<div class="card-body p-4">
		<h3 class="font-semibold">Utgifter denne uken</h3>

		{#if expensesStore.loading}
			<div class="flex justify-center py-4">
				<span class="loading loading-spinner"></span>
			</div>
		{:else if weekExpenses.length === 0}
			<p class="text-center opacity-70 py-4">Ingen utgifter ennå</p>
		{:else}
			<ul class="flex flex-col gap-2">
				{#each weekExpenses as expense (expense.id)}
					<li class="flex items-center gap-3 bg-base-100 rounded-lg p-3">
						<div class="flex-1 min-w-0">
							<div class="font-medium">{formatCurrency(expense.amount)}</div>
							{#if expense.comment}
								<div class="text-sm opacity-70 truncate">{expense.comment}</div>
							{/if}
						</div>
						<div class="text-xs opacity-50">
							{formatDate(expense.createdAt)}
						</div>
						<button
							class="btn btn-ghost btn-xs btn-circle"
							onclick={() => handleDelete(expense.id)}
							disabled={deletingId === expense.id}
						>
							{#if deletingId === expense.id}
								<span class="loading loading-spinner loading-xs"></span>
							{:else}
								✕
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
