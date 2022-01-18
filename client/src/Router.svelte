<script lang="ts">
    import router from "page";
    import { target } from "./state";
    import Layout from "./Layout.svelte";
    import Home from "./pages/Home.svelte";
    import User from "./pages/User.svelte";
    import Namespace from "./pages/Namespace.svelte";

    let page = Home;
    let title = "Home";
    let hideTitle = true;
    let menu = [];

    router("/", () => ([page, title, hideTitle] = [Home, "Home", true]));
    router(
        "/app/user",
        () => { console.log("cucu"); [page, title, hideTitle] = [User, "user", true] }
    );
    router(
        "/app/namespace",
        () => { console.log("cucu"); [page, title, hideTitle] = [Namespace, "namespace", true] }
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
