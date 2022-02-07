import { writable } from 'svelte/store';

export const token = writable("");

export const target = writable("/app/home");

export const loggedUser = writable("");

export const loggedId = writable("");

export const loggedEmail = writable("");

export const loggedRole = writable("");
