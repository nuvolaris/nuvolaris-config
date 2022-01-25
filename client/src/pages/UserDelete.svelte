<script>
    import validate from "validate.js";
    import { onMount } from "svelte";
    import { post, get, put, del } from "../util";
    import { target, loggedRole } from "../state";
    let users = [];
    let data = {email:"",
               confirmuser:""};
    let message="";
    async function load() {
        users = await get("/users");
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
        event.preventDefault();
        let res = await del("/user", data);
        if ("error" in res) message = res.error;
        else {
            data.email = "";
            data.confirmuser = "";
        }
        console.log(res);
    }
</script>
<form>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Select user to delete</label>
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
    <label>Confirm user</label>
    <input
        type="text"
        name="confirm-user"
        id="confirm-user"
        bind:value={data.confirmuser}
        class="input input-accent input-bordered w-full max-w-xs "
    /><br />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
        <span class="label-text text-red-600">{message}</span>
    </label>
    <button
        class="btn btn-accent"
        on:click|preventDefault={cancel}
        href="pages/authentication/login"
    >
       Delete User and associated namespace
    </button>
</form>
