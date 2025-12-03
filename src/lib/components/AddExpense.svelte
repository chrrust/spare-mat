<script lang="ts">
	import { expensesStore } from '$lib/stores/expenses.svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	let amount = $state('');
	let comment = $state('');
	let submitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!authStore.user || !amount) return;

		submitting = true;
		try {
			await expensesStore.addExpense(parseFloat(amount), comment, authStore.user.uid);
			amount = '';
			comment = '';
		} catch {
			// Error handled in store
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="card bg-base-200">
	<div class="card-body p-4 gap-3">
		<h3 class="font-semibold">Legg til utgift</h3>

		<div class="flex gap-2">
			<label class="floating-label flex-1">
				<span>Beløp (kr)</span>
				<input
					type="number"
					bind:value={amount}
					placeholder="Beløp (kr)"
					class="input input-bordered w-full"
					min="0"
					step="1"
					required
				/>
			</label>

			<label class="floating-label flex-[2]">
				<span>Kommentar</span>
				<input
					type="text"
					bind:value={comment}
					placeholder="Kommentar"
					class="input input-bordered w-full"
				/>
			</label>
		</div>

		<button type="submit" class="btn btn-primary" disabled={submitting || !amount}>
			{#if submitting}
				<span class="loading loading-spinner loading-sm"></span>
			{:else}
				+ Legg til
			{/if}
		</button>

		{#if expensesStore.error}
			<div class="text-error text-sm">{expensesStore.error}</div>
		{/if}
	</div>
</form>
