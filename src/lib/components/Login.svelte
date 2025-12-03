<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';

	let email = $state('');
	let password = $state('');
	let submitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;
		await authStore.signIn(email, password);
		submitting = false;
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="card bg-base-200 w-full max-w-sm">
		<div class="card-body">
			<h2 class="card-title justify-center text-2xl mb-4">🍽️ Spare Mat</h2>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				<label class="floating-label">
					<span>E-post</span>
					<input
						type="email"
						bind:value={email}
						placeholder="E-post"
						class="input input-bordered w-full"
						required
					/>
				</label>

				<label class="floating-label">
					<span>Passord</span>
					<input
						type="password"
						bind:value={password}
						placeholder="Passord"
						class="input input-bordered w-full"
						required
					/>
				</label>

				{#if authStore.error}
					<div class="text-error text-sm">{authStore.error}</div>
				{/if}

				<button type="submit" class="btn btn-primary w-full" disabled={submitting}>
					{#if submitting}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						Logg inn
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>
