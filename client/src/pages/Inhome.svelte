<script>
    import validate from "validate.js";
    import { onMount } from "svelte";
    import { post, get, put } from "../util";
    import User from "../pages/User.svelte";
    import Namespace from "../pages/Namespace.svelte";
    import { target, loggedRole } from "../state";
    let selectedLink = false;

    function addUser() {
        console.log("adding user");
        target.set("/app/user");
    }
    function addNamespace() {
        console.log("adding namespace");
        target.set("/app/namespace");
    }
</script>

{#if selectedLink == ""}
    <!-- svelte-ignore empty-block -->
    
    {#if $loggedRole == "Administrator"}
       
        <button on:click={addUser}>Add user</button><br />
        Delete user and associated namespaces<br />
        Update user<br />
    {/if}

    <button on:click={addNamespace}>Add namespace</button><br />
    Delete namespace<br />
{/if}
{#if selectedLink == "addUser"}
    <User />
{/if}
{#if selectedLink == "addNamespace"}
    <Namespace />
{/if}
