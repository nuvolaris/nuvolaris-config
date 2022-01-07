<script>
   // import { get, post, del } from "../util"; 
    import { onMount } from "svelte";
    import { token } from "../state";
    //import validate from "validate.js";
    

    // Hook up the form so we can prevent it from being posted
    let form = {};
    let errors = {};
    let isUser;
    let message = "";

    onMount(() => (form = document.querySelector("form#main")));

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
    async function submit() {
        // validate the form against the constraints
        errors = validate(form, constraints);
        if (!errors) {
            //alert("success");
            isUser = await post("/login", data);
            if ("error" in isUser) message = isUser.error;
            else {
                token.set(isUser.token);
                loggedId.set(isUser.loggedId)
                             
            }
            
        } 
    }
    function logout() {
        token.set("")
        loggedId.set("")
    }
    let data = {
        "username": "info@sciabarra.com",
        "password": "openmed"
    };
    import { loggedUser } from "../state";

</script>

<div class="p-3">
    <div class="card shadow-xl image-full">
        <figure>
            <img alt="OpenMed" src="/splash.jpg" />
        </figure>
        <div class="justify-end card-body align:center">
            <img alt="openmed" src="/openmed2.png" />
            {#if $token == ""}
                <form id="main">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-white">Email</span>
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
                            <span class="label-text text-white">Password</span>
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
                        <button
                            class="btn btn-accent content-center max-w-xs"
                            on:click|preventDefault={submit}
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
