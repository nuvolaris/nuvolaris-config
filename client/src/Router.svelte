<script lang="ts">
    import router from "page";
    import { target } from "./state";
    import Layout from "./Layout.svelte";
    import Home from "./pages/Home.svelte";
    import User from "./pages/User.svelte";
    import UserDelete from "./pages/UserDelete.svelte";
    import UserUpdate from "./pages/UserUpdate.svelte";
    import Namespace from "./pages/Namespace.svelte";
    import NamespaceDelete from "./pages/NamespaceDelete.svelte";
    import { onMount } from "svelte";

    let page = Home;
    let title = "Home";
    let hideTitle = true;
    let menu = [];


    router("/", () => router.redirect("/app/home"));

    router("/app/home", () => ([page, title, hideTitle] = [Home, "Home", true]));

    router("/app/user", () => {
        console.log("user");
        [page, title, hideTitle] = [User, "user", true];
    });
    router("/app/namespace", () => {
        console.log("namespace");
        [page, title, hideTitle] = [Namespace, "namespace", true];
    });
    router("/app/userdelete", () => {
        console.log("userdelete");
        [page, title, hideTitle] = [UserDelete, "userdelete", true];
    });
    router("/app/userupdate", () => {
        console.log("userupdate");
        [page, title, hideTitle] = [UserUpdate, "userupdate", true];
    });
    router("/app/namespacedelete", () => {
        console.log("namespacedelete");
        [page, title, hideTitle] = [NamespaceDelete, "namespacedelete", true];
    });


    target.subscribe((url) => {
        console.log("routing target='" + url + "'");
        if (url != "") 
            router(url);
    });

    onMount(() => {
        console.log("onMount:router")
        console.log(router)
        router.start();
    });

</script>

<Layout {page} {menu} {title} {hideTitle} />
