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
    import { post } from "../util"; 
    import { token } from "../state";
    import { loggedId,loggedEmail,loggedRole } from "../state";
    
    import validate from "validate.js";
    import Inhome from "./Inhome.svelte"
    
    // Hook up the form so we can prevent it from being posted
    let errors = {};
    let isUser;
    let message = "";

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
        password: {
            // Password is also required
            presence: true,
            // And must be at least 5 characters long
            length: {
                minimum: 5,
                message: "Troppo corta almeno 5 caratteri",
            },
        },
    };

    async function submit(event) {
        // validate the form against the constraints
        errors = validate(event.target, constraints);
        if (!errors) {
            //alert("success");s
            isUser = await post("/login", data);
            if ("error" in isUser) message = isUser.error;
            else {
                token.set(isUser.token);
                loggedId.set(isUser.loggedId);
                loggedRole.set(isUser.loggedRole);
                loggedEmail.set(isUser.loggedEmail)                            
            }
            
        } 
    }

    let data = {};

</script>

<div class="p-3">
    <div class="card shadow-xl image-full">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <h1>Managing namespaces</h1><br>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        
        <div class="justify-end card-body align:center">
           
            {#if $token == ""}
            <label class="label">
                <span class="label-text text-blue-500">Insert login and password</span>
            </label>
                <form id="main" on:submit|preventDefault={submit}>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-black">Email</span>
                        </label>
                        <input
                            bind:value={data.email}
                            class="input input-accent input-bordered w-full max-w-xs text-black"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email address"
                        />
                        <label class="label">
                            <span class="label-text text-red-600"
                                >{error(errors, "email")}</span
                            >
                        </label>
                    </div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-black">Password</span>
                        </label>
                        <input
                            bind:value={data.password}
                            class="input  input-accent input-bordered w-full max-w-xs text-black"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter password"
                        />
                        <label class="label">
                            <span class="label-text text-red-600"
                                >{error(errors, "password")}</span
                            >
                        </label>
                    </div>
                    <br />
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">
                        <span class="label-text text-red-600">{message}</span>
                    </label>
                    <div class="form-control">
                        <button type="submit"
                            class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                            color="primary"
                            block
                            href="pages/authentication/login">Login</button
                        >
                    </div>
                </form>
            {:else}
                <!-- svelte-ignore missing-declaration -->
                <Inhome />
               
            {/if}
        </div>
    </div>
</div>
