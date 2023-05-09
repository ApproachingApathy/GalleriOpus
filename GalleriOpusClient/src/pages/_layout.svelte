<script lang="ts">
    import TopBar from "$lib/components/TopBar.svelte";
    import SideBar from "$lib/components/SideBar.svelte";
</script>
<div class="dark flex flex-col h-full">
    <div>
        <TopBar />
    </div>
    <div class="flex h-full dark:bg-stone-800 dark:text-slate-200">
        <div class="w-0 md:w-1/4 flex-shrink-0 min-h-full border-r">
            <SideBar />
        </div>
        <div class="p-3 h-full">
            <slot></slot>
        </div> 
    </div>
</div>
