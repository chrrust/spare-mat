import { auth } from '$lib/firebase';
import {
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	type User
} from 'firebase/auth';

class AuthStore {
	user = $state<User | null>(null);
	loading = $state(true);
	error = $state<string | null>(null);

	constructor() {
		if (typeof window !== 'undefined') {
			onAuthStateChanged(auth, (user) => {
				this.user = user;
				this.loading = false;
			});
		}
	}

	async signIn(email: string, password: string) {
		this.error = null;
		this.loading = true;
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (e) {
			this.error = (e as Error).message;
		} finally {
			this.loading = false;
		}
	}

	async signOut() {
		this.error = null;
		try {
			await firebaseSignOut(auth);
		} catch (e) {
			this.error = (e as Error).message;
		}
	}
}

export const authStore = new AuthStore();
