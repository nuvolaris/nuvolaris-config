<!--
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
-->

<script lang="ts">

    import { post, get } from "../util";
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
