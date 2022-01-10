<script>
    import Menu from "./Menu.svelte";
    export let page = Home;
    export let menu;
    export let title
    export let hideTitle = false
</script>
<div class="flex flex-col md:flex-row">
    <div class="main-content flex-1 bg-gray-100 md:mt-2 pb-24 md:pb-5">
        <Menu {menu} {title}/>
        {#if !hideTitle}
        <div class="bg-gray-800 pt-3">
            <div
                class="rounded-tl-3xl rounded-tr-3xl bg-blue-900  p-4 shadow text-2xl text-white">
                <h3 class="font-bold pl-2">{title}Nuvolaris</h3>
            </div>
        </div>
        {/if}
        <svelte:component this={page} />
    </div>
</div>
