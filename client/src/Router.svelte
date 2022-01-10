<script lang="ts">
    import router from "page"; 
    import Layout from "./Layout.svelte";
    import Home from "./pages/Home.svelte";
    import Inhome from "./pages/Inhome.svelte";
    

    

    let page = Home;
    let title = "Home";
    let hideTitle = true;
    let menu = [];
    router("/", () => ([page, title, hideTitle] = [Home, "Home", true]));

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
