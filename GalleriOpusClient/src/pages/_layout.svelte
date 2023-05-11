<script lang="ts">
    import TopBar from "$lib/components/TopBar.svelte";
    import SideBar from "$lib/components/SideBar/SideBar.svelte";
</script>
<div class="dark flex flex-col h-screen bg-slate-500">
    <div class="top-0">
        <TopBar />
    </div>
    <div class="flex dark:bg-stone-800 dark:text-slate-200 h-[calc(100%-48px)]">
        <div class="w-0 md:w-1/4 border-r h-full">
            <SideBar />
        </div>
        <div class="p-3 h-full">
            <slot></slot>
        </div> 
    </div>
</div>
