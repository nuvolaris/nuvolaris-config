<script lang="ts">
    import { async } from "validate.js";
    import { post, get, put } from "../util";
    import { onMount } from "svelte";
    import { loggedEmail, loggedRole } from "../state";
    let message = "";

    let users;
    async function load() {
        if ($loggedRole=="Administrator") {
            users = await get("/users");
        }
        else data.email=$loggedEmail;
    }
    onMount(load);

    let data = { email: "", namespace: "" };
    async function save(event) {
        event.preventDefault();
        let res = await post("/namespace", data);
        if ("error" in res) message = res.error;
        else {
            data.email = "";
            data.namespace = "";
        }
        console.log(res);
    }
</script>

<form>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Select user</label>
    {#if ($loggedRole=="Administrator")}
    {#await load()}
        <p>Caricamento...</p>
    {:then}
        <select
            bind:value={data.email}
            class="select select-bordered select-accent w-full max-w-xs"
            name="email"
            id="email"
        >
            {#each users as usr}
                <option value={usr.email}>
                    {usr.email}
                </option>
            {/each}
        </select>
    {/await}
    {:else}
    <input name="email" id="email" value={$loggedEmail}>
    {/if}
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Insert namespace</label>
    <input
        type="text"
        name="namespace"
        id="namespace"
        bind:value={data.namespace}
        class="input input-accent input-bordered w-full max-w-xs "
    /><br />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span class="label-text text-red-600">{message}</span>
    </label>
    <br>
    <button
    class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        on:click|preventDefault={save}
        href="pages/authentication/login"
    >
        Save Namespace
    </button>
</form>
