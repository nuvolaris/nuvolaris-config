<script lang="ts">
    import { async } from "validate.js";
    import { post, get, put } from "../util";
    import { onMount } from "svelte";
    import { loggedEmail } from "../state";
    let message = "";

    let users = [];
    async function load() {
        users = await get("/users");
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
    <button
        class="btn btn-accent"
        on:click|preventDefault={save}
        href="pages/authentication/login"
    >
        Save Namespace
    </button>
</form>
