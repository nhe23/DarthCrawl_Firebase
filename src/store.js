import { writable } from 'svelte/store';

export const storedUser = writable({isLoggedIn: false, email:''});