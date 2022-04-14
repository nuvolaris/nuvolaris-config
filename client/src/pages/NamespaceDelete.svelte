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
    import { del } from "../util";
    import { loggedRole,loggedEmail } from "../state";

    let data = { email: "", namespace: "" };
    let message = "";
    let errors = {};
    let form = {};

    async function load() {
        
        form = document.querySelector("form#main");
    }

    onMount(load);

    function error(map, name) {

        if (!map) return "";

        if (name in map) {
            let label = document.querySelector("label[for='" + name + "']");
            if (label) label.classList.add("text-red-500");

            return map[name].join("<br>");
        } else {
            let label = document.querySelector("label[for='" + name + "']");
            if (label) label.classList.remove("text-red-500");
        }

        return "";
    }

    var constraints = {
        "namespace": {
            // You need to confirm your password
            presence: true,
            // and it needs to be equal to the other password
            
        },
    };

    async function cancel(event) {

        errors = validate(form, constraints);

        if (!errors) {
            //console.log(data);
            event.preventDefault();
            data.email=$loggedEmail;
            let res = await del("/namespace/"+$loggedRole, data);
            if ("error" in res) message = res.error;
            else {
                data.namespace = "";
                if (res.deletedCount==0){ 
                    message="Namespace not found";
                }
                else { message="Namespace deleted "+res.deletedCount; }
                
                
            }
            console.log(res);
        } else {
            console.log("errors", errors);
        }

    }

</script>

<form id="main">
    
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label for="namespace" class="small mb-1">Insert namespace to be deleted</label>
    <input
        bind:value={data.namespace}
        class="input input-accent input-bordered w-full max-w-xs "
        type="text"
        name="namespace"
        id="namespace"
        
    /><br />
    <div class="col-sm-5 messages">
        {error(errors, "namespace")}
    </div>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span class="label-text text-red-600">{message}</span>
    </label>
    <br>
    <button
    class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        on:click|preventDefault={cancel}
        href="pages/authentication/login"
    >
        Delete  namespace
    </button>
    
</form><br><br>
<b>Be careful</b>
