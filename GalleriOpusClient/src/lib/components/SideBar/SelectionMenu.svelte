<script lang="ts">
    import { useAddTagToAsset, useGetAsset } from "$lib/queries";
    import { selection } from "$lib/store/selectedAsset"
    import type { Asset } from "../../../../../GalleriOpusServer/src/Database/typeorm/entity/Asset";
    
    let inputTag = ""
    $: console.log(selection)

    $: hasSelection = !!$selection
    $: isSingleSelection = hasSelection && !Array.isArray($selection)

    $: assetQuery = useGetAsset(($selection as Asset)?.id, { enabled: isSingleSelection })

    const addTagMutation = useAddTagToAsset()  

    $: addTag = async (assetId: number) => {
        $addTagMutation.mutate({ id: assetId, tags: [inputTag]})
        inputTag = ""
    }
</script>

{#if hasSelection}
    <div class="border-b py-3">
        <div class="text-center">
            <h2 class="text-xs font-semibold">Selection</h2>
        </div>
    
        {#if Array.isArray($selection)}
            <p>Selected: {$selection.length}</p>
        {:else}
            {#if $assetQuery.isSuccess}
                {console.log($assetQuery.data)}
                <div class="flex flex-col gap-3">
                    <p>Asset ID: {$assetQuery.data.id}</p>
                    <h3 class="text-xs font-medium border-b border-slate-50/75">Tags</h3>
                    <div class="flex items-center justify-center gap-2">
                        <form on:submit={(e) => {
                            e.preventDefault()
                            addTag($assetQuery.data.id)
                        }} class="contents">
                            <input placeholder="Add Tag" bind:value={inputTag} />
                            <button type="submit">Add</button>
                        </form>
                    </div>
                    
                    <div class="flex justify-start w-full overflow-hidden flex-wrap gap-1">
                        {#each $assetQuery.data.tags as assetTag}
                        <div title={assetTag.tag.value} class="max-w-[24ch] truncate text-xs p-1 bg-slate-700 hover:bg-slate-600">{assetTag.tag.value}</div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
{/if}