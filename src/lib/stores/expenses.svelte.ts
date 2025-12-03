import { db } from '$lib/firebase';
import {
	collection,
	addDoc,
	query,
	orderBy,
	onSnapshot,
	Timestamp,
	deleteDoc,
	doc
} from 'firebase/firestore';
import type { Expense } from '$lib/types';

class ExpensesStore {
	expenses = $state<Expense[]>([]);
	loading = $state(true);
	error = $state<string | null>(null);

	private unsubscribe: (() => void) | null = null;

	subscribe() {
		if (this.unsubscribe) return;

		const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));

		this.unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				this.expenses = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						amount: data.amount,
						comment: data.comment || '',
						createdAt: (data.createdAt as Timestamp).toDate(),
						createdBy: data.createdBy
					};
				});
				this.loading = false;
			},
			(error) => {
				this.error = error.message;
				this.loading = false;
			}
		);
	}

	unsubscribeFromExpenses() {
		if (this.unsubscribe) {
			this.unsubscribe();
			this.unsubscribe = null;
		}
	}

	async addExpense(amount: number, comment: string, userId: string) {
		this.error = null;
		try {
			await addDoc(collection(db, 'expenses'), {
				amount,
				comment,
				createdAt: Timestamp.now(),
				createdBy: userId
			});
		} catch (e) {
			this.error = (e as Error).message;
			throw e;
		}
	}

	async deleteExpense(id: string) {
		this.error = null;
		try {
			await deleteDoc(doc(db, 'expenses', id));
		} catch (e) {
			this.error = (e as Error).message;
			throw e;
		}
	}
}

export const expensesStore = new ExpensesStore();
