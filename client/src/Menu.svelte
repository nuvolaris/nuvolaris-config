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

    import { onMount } from "svelte";
    import { token } from "./state";

    export let menu;
    export let title;
 
    onMount(() => {
        const btn = document.querySelector("button.mobile-menu-button");
        const menu = document.querySelector(".mobile-menu");
        /**
         *  TO DO: replace with proper on:click handler;
         *  using imperative listeners without removing them upon
         *  component destroy leads to memory leaks
         */
        btn.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    });

    function logout() {
        token.set("");
    }
</script>

<nav class="bg-white shadow-lg">
    <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
            <div class="flex space-x-7">
                <div>
                    <!-- Website Logo -->
                    <a href="/app/home" class="flex items-center py-4 px-2">
                        <img
                            src="/logonuvolaris.jpeg"
                            alt="Logo"
                            class="h-8 w-auto mr-2"
                        />
                    </a>
                   
                </div>
                <div class="hidden md:flex items-center space-x-1">
                    <ul
                        class="menu items-stretch px-3 shadow-lg bg-base-100 horizontal rounded-box"
                    >
                        {#each menu as item}
                            <li class={item.name == title ? "bordered" : ""}>
                                <a href={item.path}>{item.name}</a>
                            </li>
                        {/each}

                        {#if $token != ""}
                            <li>
                                <a
                                    href="/"
                                    on:click={logout}
                                    
                                    >Esci</a
                                >
                            </li>
                        {/if}
                    </ul>
                </div>
            </div>
            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center">
                <button class="outline-none mobile-menu-button">
                    <svg
                        class=" w-6 h-6 text-gray-500 hover:text-green-500 "
                        x-show="!showMenu"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <!-- mobile menu -->
    <div class="hidden mobile-menu">
        <ul class="">
            {#each menu as item}
                <li class="active">
                    <a
                        href={item.path}
                        class={"block text-sm px-2 py-4 text-white font-semibold " +
                            (item.name == title ? "bg-black" : "bg-green-500")}
                        >{item.name}</a
                    >
                </li>
            {/each}
            {#if $token != ""}
                <li class="active">
                    <a
                        href="/"
                        on:click={logout}
                        class="block text-sm px-2 py-4 text-white font-semibold bg-green-500"
                        >Esci</a
                    >
                </li>
            {/if}
        </ul>
    </div>
</nav>
