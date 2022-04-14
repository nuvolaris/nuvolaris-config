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

<script>
    import validate from "validate.js";
    import { onMount } from "svelte";
    import { get, del } from "../util";

    let users = [];
    let data = { email: "", confirmuser: "" };
    let message = "";
    let errors = {};
    let form = {};

    async function load() {
        users = await get("/users");
        form = document.querySelector("form#main");
    }

    onMount(load);

    function error(map, name) {
        if (!map) return "";
        if (name in map) {
            //document.getElementById(name).classList.add("text-red")
            let label = document.querySelector("label[for='" + name + "']");
            if (label) label.classList.add("text-red-500");

            return map[name].join("<br>");
        } else {
            let label = document.querySelector("label[for='" + name + "']");
            if (label) label.classList.remove("text-red-500");
            //document.getElementById(name).classList.remove("text-red")
        }
        return "";
    }
    var constraints = {
        email: {
            // Email is required
            presence: true,
            // and must be an email (duh)
            email: true,
        },
        "Confirm-user": {
            // You need to confirm your password
            presence: true,
            // and it needs to be equal to the other password
            equality: {
                attribute: "email",
                message: "User are not confirmed",
            },
        },
    };
    
    async function cancel(event) {

        errors = validate(form, constraints);

        if (!errors) {
            event.preventDefault();
            let res = await del("/user", data);
            if ("error" in res) message = res.error;
            else {
                data.email = "";
                data.confirmuser = "";
            }
            console.log(res);
        } else {
            console.log("errors", errors);
        }
    }
</script>

<form id="main">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label for="exampleEmail" class="small mb-1">Select user to delete</label>
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
    <label for="inputConfirmUser" class="small mb-1">Confirm user</label>
    <input
        bind:value={data.confirmuser}
        class="input input-accent input-bordered w-full max-w-xs "
        type="text"
        name="Confirm-user"
        id="Confirm-user"
        
    /><br />
    <div class="col-sm-5 messages">
        {error(errors, "Confirm-user")}
      </div>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span class="label-text text-red-600">{message}</span>
    </label>
    <br />
    <button
    class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        on:click|preventDefault={cancel}
        href="pages/authentication/login"
    >
        Delete User and associated namespace
    </button>
    
</form><br><br>
<b>Be careful in this way you cancel an user and all his namespaces</b>
