<script lang="ts">
    import validate from "validate.js";
    import { onMount } from "svelte";
    import { post, get, put } from "../util";
    
    let roles = ["Administrator","User"];
    let errors = {};
    let form = {};
    let message = "";
    let data = {role: "User",name: "",surname:"",address:"",phone:"",email:"",password:""};
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
          },
        },
        
        "Confirm-password":  {
          // You need to confirm your password
          presence: true,
          // and it needs to be equal to the other password
          equality: {
            attribute: "password",
            message: "Password are not the same",
          },
        },
    
     };
     async function save(event) {
        errors = validate(form, constraints);
        
        if (!errors) {
          console.log(data);
          event.preventDefault();
          let res = await post("/user", data);
          console.log(res);
          } else {
          console.log("errors", errors);
        }
      }
    
    </script>
    
    <h1>Add user</h1>
    <form id="main">
        <table class="table-fixed">
          <tr>
            <th colspan="2" >
              <label for="inputRole" class="small mb-1">Role</label>
      
              <legend class="sr-only"> Role </legend><br />
              <select
                bind:value={data.role}
                class="select select-bordered select-accent w-full max-w-xs "
                name="role"
                id="role"
              >
                {#each roles as roleins}
                  <option value={roleins}>
                    {roleins}
                  </option>
                {/each}
              </select>
            </th>
          </tr>
          <tr>
            <th colspan=2>
              <label for="exampleEmail" class="small mb-1">Email*</label>
              <input
                bind:value={data.email}
                class="input input-accent input-bordered w-full max-w-xs "
                type="email"
                name="email"
                id="email"
                placeholder="Insert email"
              />
              <div class="col-sm-5 messages">{error(errors, "email")}</div>
            </th>
            </tr>
            <tr>
            <th>
              <label for="inputPassword" class="small mb-1">Password*</label>
              <input
                bind:value={data.password}
                class="input input-accent input-bordered w-full max-w-xs "
                type="password"
                name="password"
                id="password"
                placeholder="Inserisci password"
              />
              <div class="col-sm-5 messages">{error(errors, "password")}</div>
            </th>
            <th>
             
              <label for="inputConfirmPassword" class="small mb-1">
                Confirm Password*
              </label>
              <input
                class="input input-accent input-bordered w-full max-w-xs "
                type="password"
                name="Confirm-password"
                id="Confirm-password"
                placeholder="Conferma password"
              />
              <div class="col-sm-5 messages">{error(errors, "Conferma-password")}</div>
            
            </th>
          </tr>
          <tr>
            
            <th>
              <label for="inputFirstName" class="small mb-1">Name</label>
              <input
                bind:value={data.name}
                class="input input-accent input-bordered w-full max-w-xs "
                type="text"
                name="name"
                id="name"
                placeholder="Insert name"
              />
              
              </th
            >
            <th>
              <label for="inputLastName" class="small mb-1">Surname</label>
              <input
                bind:value={data.surname}
                class="input input-accent input-bordered w-full max-w-xs "
                type="text"
                name="surname"
                id="surname"
                placeholder="Insert surname"
              />
              
            </th>
          </tr>
          <tr>
            <th>
              <label for="inputAddress" class="small mb-1">Address</label>
              <input
                bind:value={data.address}
                class="input input-accent input-bordered w-full max-w-xs "
                type="text"
                name="address"
                id="address"
                placeholder="Insert address"
              />
            </th>
            <th>
              <label for="inputPhone" class="small mb-1">Phone</label>
              <input
                bind:value={data.phone}
                class="input input-accent input-bordered w-full max-w-xs "
                type="text"
                name="phone"
                id="phone"
                placeholder="Phone number"
              />
              
            </th>
          </tr>
          
        </table>
      *Are necessary<br>
        
        <button
          class="btn btn-accent"
          on:click|preventDefault={save}
          href="pages/authentication/login"
        >
          Create Account
        </button>
    </form>
    