<script>
    import validate from "validate.js";
    import { onMount } from "svelte";
    import { post, get, put } from "../util";
    import User from "../pages/User.svelte";
    import Namespace from "../pages/Namespace.svelte";
    import UserDelete from "../pages/UserDelete.svelte";
    import UserUpdate from "../pages/UserUpdate.svelte";
    import { target, loggedRole } from "../state";
    import NamespaceDelete from "./NamespaceDelete.svelte";
    let selectedLink = false;

    function addUser() {
        console.log("adding user");
        target.set("/app/user");
    }
    function addNamespace() {
        console.log("adding namespace");
        target.set("/app/namespace");
    }
    function delNamespace() {
        console.log("delete namespace");
        target.set("/app/namespacedelete");
    }
    function delUser() {
        console.log("delete user");
        target.set("/app/userdelete");
    }
    function updateUser() {
        console.log("update user");
        target.set("/app/userupdate");
    }
</script>

{#if selectedLink == ""}
    <!-- svelte-ignore empty-block -->

    {#if $loggedRole == "Administrator"}
        <button class="inline-block w-full px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out" on:click={addUser}>Add user</button><br />
        <button class="inline-block w-full px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out" on:click={delUser}>Delete user and <br/>associated namespaces</button
        ><br />
    {/if}
    <button class="inline-block w-full px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out" on:click={updateUser}>Update user</button><br />
    <button class="inline-block w-full px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out" on:click={addNamespace}>Add namespace</button><br />
    <button class="inline-block w-full px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out" on:click={delNamespace}>Delete namespace</button><br />
{/if}
{#if selectedLink == "addUser"}
    <User />
{/if}
{#if selectedLink == "addNamespace"}
    <Namespace />
{/if}
{#if selectedLink == "delUser"}
    <UserDelete />
{/if}
{#if selectedLink == "updateUser"}
    <UserUpdate />
{/if}
{#if selectedLink == "delNamespace"}
    <NamespaceDelete />
{/if}
