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
    import Menu from "./Menu.svelte";
    import Home from "./pages/Home.svelte";

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
