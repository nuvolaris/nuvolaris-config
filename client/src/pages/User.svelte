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
  import { post, get, put } from "../util";
  

  let roles = ["Administrator", "User"];
  let errors = {};
  let form = {};
  let message = "";
  let data = {};
  function init(){
    data= {
    role: "User",
    name: "",
    surname: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    namespace: "",
  };
  form = document.querySelector("form#main");
  }
  onMount(init);

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
    namespace: {
      presence: true,
    },

    "Confirm-password": {
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
      //console.log(data);
      event.preventDefault();
      let res = await post("/user", data);
      if ("error" in res) message = res.error;
      else {
        init();
      }
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
      <th colspan="2">
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
      <th colspan="2">
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
          placeholder="Confirm password"
        />
        <div class="col-sm-5 messages">
          {error(errors, "Confirm-password")}
        </div>
      </th>
    </tr>
    <tr>
      <th colspan="2">
        <label for="namespace" class="small mb-1">Namespace*</label>
        <input
          bind:value={data.namespace}
          class="input input-accent input-bordered w-full max-w-xs "
          type="text"
          name="namespace"
          id="namespace"
          placeholder="Insert namespace"
        />
        <div class="col-sm-5 messages">{error(errors, "namespace")}</div>
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
      </th>
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
  *Are necessary<br />
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="label">
    <span class="label-text text-red-600">{message}</span>
  </label>

  <button
  class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
    on:click|preventDefault={save}
    href="pages/authentication/login"
  >
    Create Account
  </button>
</form>
