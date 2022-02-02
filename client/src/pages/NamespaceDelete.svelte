<script>
    import validate from "validate.js";
    import { onMount } from "svelte";
    import {  del } from "../util";
    import { target, loggedRole,loggedEmail } from "../state";
    let users = [];
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
