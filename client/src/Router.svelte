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

<script lang="ts">
    
    import router from "page";

    import { onMount } from "svelte";
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

    router("/app/home", () => {
        console.log("home");
        [page, title, hideTitle] = [Home, "Home", true];
    });
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
    router("/", () => router.redirect("/app/home"));

    onMount(() => {
        router.start();
    });

</script>

<Layout {page} {menu} {title} {hideTitle} />
