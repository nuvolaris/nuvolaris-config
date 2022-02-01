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
    

    let page = Home;
    let title = "Home";
    let hideTitle = true;
    let menu = [];

    router("/", () => ([page, title, hideTitle] = [Home, "Home", true]));
    router(
        "/app/user",
        () => { console.log("user"); [page, title, hideTitle] = [User, "user", true] }
    );
    router(
        "/app/namespace",
        () => { console.log("namespace"); [page, title, hideTitle] = [Namespace, "namespace", true] }
    );
    router(
        "/app/userdelete",
        () => { console.log("userdelete"); [page, title, hideTitle] = [UserDelete, "userdelete", true] }
    );
    router(
        "/app/userupdate",
        () => { console.log("userupdate"); [page, title, hideTitle] = [UserUpdate, "userupdate", true] }
    );
    router(
        "/app/namespacedelete",
        () => { console.log("namespacedelete"); [page, title, hideTitle] = [NamespaceDelete, "namespacedelete", true] }
    );


    target.subscribe((url) => {
        console.log("routing url='"+url+"'", router)
        if(url != '')
           router(url);
    });

    /* role.subscribe((r) => {
        menu = [];
        if (r != "") {
            
            menu.push({ path: "/app/calendar", name: "Appuntamenti" });
            if (r=="Infermiere" || r=="Amministratore" || r=="Stomaterapista"){
                menu.push({ path: "/app/schedule", name: "Prenota" });
                menu.push({ path: "/app/users", name: "Gestione" });
            }
            menu.push({ path: "/app/conference", name: "Conferenza" });   
        }
        
    });
 
    

    router(
        "/app/calendar",
        () => $role!="" ? ([page, title, hideTitle] = [Calendar, "Appuntamenti", false]) : undefined
    );

    router(
        "/app/schedule",
        () => $role!="" ? ([page, title, hideTitle] = [Schedule, "Prenota", false]) : undefined
    );

    router(
        "/app/users",
        () => $role!="" ? ([page, title, hideTitle] = [Users, "Gestione", false]) : undefined
    );

    router(
        "/app/conference",
        () =>  ([page, title, hideTitle] = [Conference, "Conferenza", true]) 
    );

    */
    router.start();
</script>

<Layout {page} {menu} {title} {hideTitle} />
