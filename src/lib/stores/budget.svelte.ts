import { db } from '$lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { BudgetConfig } from '$lib/types';

const DEFAULT_CONFIG: BudgetConfig = {
	monthlyAllocation: 8000,
	weeklyTarget: 2000
};

class BudgetStore {
	config = $state<BudgetConfig>(DEFAULT_CONFIG);
	loading = $state(true);
	error = $state<string | null>(null);

	private unsubscribe: (() => void) | null = null;

	subscribe() {
		if (this.unsubscribe) return;

		const docRef = doc(db, 'config', 'budget');

		this.unsubscribe = onSnapshot(
			docRef,
			(snapshot) => {
				if (snapshot.exists()) {
					this.config = snapshot.data() as BudgetConfig;
				} else {
					this.config = DEFAULT_CONFIG;
				}
				this.loading = false;
			},
			(error) => {
				this.error = error.message;
				this.loading = false;
			}
		);
	}

	unsubscribeFromBudget() {
		if (this.unsubscribe) {
			this.unsubscribe();
			this.unsubscribe = null;
		}
	}

	async updateConfig(config: BudgetConfig) {
		this.error = null;
		try {
			await setDoc(doc(db, 'config', 'budget'), config);
		} catch (e) {
			this.error = (e as Error).message;
			throw e;
		}
	}
}

export const budgetStore = new BudgetStore();
