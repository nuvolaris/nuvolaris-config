import { writable } from 'svelte/store';

// TO DO: authentication data could be stored in the same structure

export const token = writable("");

export const loggedUser = writable("");

export const loggedId = writable("");

export const loggedEmail = writable("");

export const loggedRole = writable("");
