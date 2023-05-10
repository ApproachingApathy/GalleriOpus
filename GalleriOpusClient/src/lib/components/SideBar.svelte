<script lang="ts">
    import { api } from "$lib/galleri-opus-api";
    import { selection } from "$lib/store/selectedAsset"
    let inputTag = ""

    $: hasSelection = !!$selection;

    $: addTag = async (assetId: number) => {
       await api.assets[`${assetId}`].tags.post({ tags: [inputTag] })
       inputTag = ""
    }
</script>

<div class="p-2">
    <div class="border-b py-3">
        <div class="text-center">
            <h1 class="text-sm font-semibold border-b border-opacity-10">Menu</h1>
        </div>
        <div class="pt-3">
            <div class="text-center">
                <h2 class="text-xs font-semibold">Library</h2>
            </div>
            <div>
                <p>100 images</p>
            </div>
        </div>
    </div> 
    
    {#if hasSelection}
        <div class="border-b py-3">
            <div class="text-center">
                <h2 class="text-xs font-semibold">Selection</h2>
            </div>
        
            {#if Array.isArray($selection)}
                <p>Selected: {$selection.length}</p>
            {:else}
                <div class="flex flex-col gap-3">
                    <p>Asset ID: {$selection.id}</p>
                    <h3 class="text-xs font-medium border-b border-slate-50/75">Tags</h3>
                    <div class="flex items-center justify-center gap-2">
                        <form on:submit={(e) => {
                            e.preventDefault()
                            if (!Array.isArray($selection)) addTag($selection.id)
                        }} class="contents">
                            <input placeholder="Add Tag" bind:value={inputTag} />
                            <button type="submit">Add</button>
                        </form>
                    </div>

                    <div class="flex justify-start w-full overflow-hidden flex-wrap gap-1">
                        {#each $selection.tags as assetTag}
                            <div title={assetTag.tag.value} class="max-w-[24ch] truncate text-xs p-1 bg-slate-700 hover:bg-slate-600">{assetTag.tag.value}</div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>