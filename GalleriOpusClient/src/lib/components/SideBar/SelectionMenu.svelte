<script lang="ts">
    import { assetKeys, useAddTagToAsset, useGetAsset, useRemoveAsset, useRemoveTagFromAsset } from "$lib/queries";
    import { selection } from "$lib/store/selectedAsset"
    import type { Asset } from "../../../../../GalleriOpusServer/src/Database/typeorm/entity/Asset";
    
    let inputTag = ""
    let hasSelection = false
    let isSingleSelection = false
    let isDeletePrimed = false
    $: {
        hasSelection = !!$selection
        isSingleSelection = hasSelection && !Array.isArray($selection)
    }
    selection.subscribe(() => {
      isDeletePrimed = false  
    })
    
    const assetQuery = useGetAsset(0, { enabled: false })
    $: assetQuery.updateOptions({ enabled: isSingleSelection, queryKey: assetKeys.asset(($selection as Asset)?.id)})

    const addTagMutation = useAddTagToAsset()
    const removeTagMutation = useRemoveTagFromAsset()
    const removeAssetMutation = useRemoveAsset()  

    $: addTag = async (assetId: number) => {
        $addTagMutation.mutate({ id: assetId, tags: [inputTag]})
        inputTag = ""
    }

    $: removeTag = async (assetId: number, tag: string) => {
        $removeTagMutation.mutate({ id: assetId, tags: [tag]})
    }

    $: removeAsset = async (assetId: number) => {
        await $removeAssetMutation.mutate({ id: assetId })
        selection.set(undefined)
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
                <div class="flex flex-col gap-3">
                    <div>
                        <a class="contents" href="http://127.0.0.1:3000/assets/{$assetQuery.data.id}/image" target="_blank">
                            <img src="http://127.0.0.1:3000/assets/{$assetQuery.data.id}/image" alt=""/>
                        </a>
                    </div>
                    <div class="flex justify-between">
                        <p>Asset ID: {$assetQuery.data.id}</p>
                        <div>
                            {#if isDeletePrimed}
                                <button on:click={() => isDeletePrimed = false}>Cancel</button>
                            {/if}
                            <button class={isDeletePrimed ? "text-red-700" : ""} type="button" on:click={(e) => {
                                if (isDeletePrimed) {
                                    removeAsset($assetQuery.data.id)
                                    isDeletePrimed = false;
                                    return;
                                }
                                isDeletePrimed = true;
                            }}>Delete</button>
                        </div>
                    </div>
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
                        <div title={assetTag.tag.value} class="group flex text-xs p-1 bg-slate-700 hover:bg-slate-600">
                            <div class="max-w-[24ch] truncate">
                                {assetTag.tag.value}
                            </div>
                            <button class="hidden group-hover:inline-block px-1 text-red-600 font-bold" type="button" on:click={() => {
                                removeTag($assetQuery.data.id, assetTag.tag.value)
                            }}>X</button>
                        </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
{/if}