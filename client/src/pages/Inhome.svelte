<script>
    import validate from "validate.js";
    import { onMount } from "svelte";
    import { post, get, put } from "../util";
    import User from "../pages/User.svelte";
    import { target } from "../state";
    let selectedLink = false;
    
    function addUser() {
        console.log("adding user")
        target.set("/app/user")
    }
</script>

{#if selectedLink == ""}
    <button on:click={addUser}>Add user</button><br />
    Delete user and associated namespaces<br />
    Update user<br />
    Add namespace<br />
    Delete namespace<br />
{/if}
{#if selectedLink == "addUser"}
    <User />
{/if}
