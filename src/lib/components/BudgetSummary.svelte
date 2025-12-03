<script lang="ts">
	import { expensesStore } from '$lib/stores/expenses.svelte';
	import { budgetStore } from '$lib/stores/budget.svelte';
	import {
		getMonthStart,
		getMonthEnd,
		getWeekStart,
		getWeekEnd,
		isDateInRange,
		formatCurrency,
		formatDate,
		getWeekOfMonth
	} from '$lib/utils/date';

	const monthStart = getMonthStart();
	const monthEnd = getMonthEnd();
	const weekStart = getWeekStart();
	const weekEnd = getWeekEnd();
	const weekNumber = getWeekOfMonth();

	const monthExpenses = $derived(
		expensesStore.expenses.filter((e) => isDateInRange(e.createdAt, monthStart, monthEnd))
	);

	const weekExpenses = $derived(
		expensesStore.expenses.filter((e) => isDateInRange(e.createdAt, weekStart, weekEnd))
	);

	const monthSpent = $derived(monthExpenses.reduce((sum, e) => sum + e.amount, 0));
	const weekSpent = $derived(weekExpenses.reduce((sum, e) => sum + e.amount, 0));

	const monthRemaining = $derived(budgetStore.config.monthlyAllocation - monthSpent);
	const weekRemaining = $derived(budgetStore.config.weeklyTarget - weekSpent);

	const monthProgress = $derived(
		Math.min(100, (monthSpent / budgetStore.config.monthlyAllocation) * 100)
	);
	const weekProgress = $derived(
		Math.min(100, (weekSpent / budgetStore.config.weeklyTarget) * 100)
	);

	function getProgressColor(remaining: number): string {
		if (remaining < 0) return 'progress-error';
		if (remaining < 500) return 'progress-warning';
		return 'progress-success';
	}
</script>

<div class="flex flex-col gap-3">
	<!-- Week Summary -->
	<div class="card bg-base-200">
		<div class="card-body p-4">
			<div class="flex justify-between items-center">
				<h3 class="font-semibold">Uke {weekNumber}</h3>
				<span class="text-xs opacity-70">{formatDate(weekStart)} - {formatDate(weekEnd)}</span>
			</div>

			<div class="flex justify-between text-sm">
				<span>Brukt: {formatCurrency(weekSpent)}</span>
				<span>Mål: {formatCurrency(budgetStore.config.weeklyTarget)}</span>
			</div>

			<progress
				class="progress {getProgressColor(weekRemaining)} w-full"
				value={weekProgress}
				max="100"
			></progress>

			<div class="text-center">
				<span class="text-2xl font-bold" class:text-error={weekRemaining < 0}>
					{formatCurrency(weekRemaining)}
				</span>
				<span class="text-sm opacity-70 block">igjen denne uken</span>
			</div>
		</div>
	</div>

	<!-- Month Summary -->
	<div class="card bg-base-200">
		<div class="card-body p-4">
			<div class="flex justify-between items-center">
				<h3 class="font-semibold">
					{monthStart.toLocaleDateString('nb-NO', { month: 'long' })}
				</h3>
				<span class="text-xs opacity-70">{formatDate(monthStart)} - {formatDate(monthEnd)}</span>
			</div>

			<div class="flex justify-between text-sm">
				<span>Brukt: {formatCurrency(monthSpent)}</span>
				<span>Budsjett: {formatCurrency(budgetStore.config.monthlyAllocation)}</span>
			</div>

			<progress
				class="progress {getProgressColor(monthRemaining)} w-full"
				value={monthProgress}
				max="100"
			></progress>

			<div class="text-center">
				<span class="text-2xl font-bold" class:text-error={monthRemaining < 0}>
					{formatCurrency(monthRemaining)}
				</span>
				<span class="text-sm opacity-70 block">igjen denne måneden</span>
			</div>
		</div>
	</div>
</div>
