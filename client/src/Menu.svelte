<script>
    export let menu;
    export let title;
    import { onMount } from "svelte";
 
    onMount(() => {
        const btn = document.querySelector("button.mobile-menu-button");
        const menu = document.querySelector(".mobile-menu");
        btn.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    });
    function logout() {
        token.set("");
    }

    import {token,target} from "./state";
   
</script>

<nav class="bg-white shadow-lg">
    <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between">
            <div class="flex space-x-7">
                <div>
                    <!-- Website Logo -->
                    <a href="/" class="flex items-center py-4 px-2" on:click={target.set("")}>
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
