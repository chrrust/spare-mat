<script lang="ts">
	import { budgetStore } from '$lib/stores/budget.svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	let monthlyAllocation = $state(budgetStore.config.monthlyAllocation.toString());
	let weeklyTarget = $state(budgetStore.config.weeklyTarget.toString());
	let saving = $state(false);

	async function handleSave() {
		saving = true;
		try {
			await budgetStore.updateConfig({
				monthlyAllocation: parseFloat(monthlyAllocation),
				weeklyTarget: parseFloat(weeklyTarget)
			});
			onclose();
		} finally {
			saving = false;
		}
	}

	async function handleSignOut() {
		await authStore.signOut();
	}
</script>

<div class="card bg-base-200">
	<div class="card-body p-4 gap-4">
		<div class="flex justify-between items-center">
			<h3 class="font-semibold">Innstillinger</h3>
			<button class="btn btn-ghost btn-xs btn-circle" onclick={onclose}>✕</button>
		</div>

		<label class="floating-label">
			<span>Månedsbudsjett (kr)</span>
			<input
				type="number"
				bind:value={monthlyAllocation}
				placeholder="Månedsbudsjett (kr)"
				class="input input-bordered w-full"
				min="0"
				step="100"
			/>
		</label>

		<label class="floating-label">
			<span>Ukemål (kr)</span>
			<input
				type="number"
				bind:value={weeklyTarget}
				placeholder="Ukemål (kr)"
				class="input input-bordered w-full"
				min="0"
				step="100"
			/>
		</label>

		<button class="btn btn-primary" onclick={handleSave} disabled={saving}>
			{#if saving}
				<span class="loading loading-spinner loading-sm"></span>
			{:else}
				Lagre
			{/if}
		</button>

		<div class="divider my-0"></div>

		<button class="btn btn-ghost btn-sm" onclick={handleSignOut}>Logg ut</button>
	</div>
</div>
