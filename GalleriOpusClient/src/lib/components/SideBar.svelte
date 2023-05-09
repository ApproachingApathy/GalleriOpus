<script lang="ts">
    import { selection } from "$lib/store/selectedAsset"
    $: hasSelection = !!$selection;
</script>

<div class="p-2">
    <div class="text-center">
        <h1 class="text-sm font-medium border-b border-opacity-10">Menu</h1>
    </div>
    <div class="pt-3">
        <div class="text-center">
            <h2 class="text-xs font-medium">Library</h2>
        </div>
        <div>
            <p>100 images</p>
        </div>
    </div>

    
    {#if hasSelection}
        {#if Array.isArray($selection)}
            <p>Selected: {$selection.length}</p>
        {:else}
            <p>{$selection.id}</p>
            <div class="flex justify-start w-full overflow-hidden flex-wrap gap-1">
                {#each $selection.tags as assetTag}
                    <div title={assetTag.tag.value} class="max-w-[24ch] truncate text-xs p-1 bg-slate-700 hover:bg-slate-600">{assetTag.tag.value}</div>
                {/each}
            </div>
        {/if}
    {/if}
</div>