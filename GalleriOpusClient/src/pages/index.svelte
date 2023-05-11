<script lang="ts">
    import { api } from "$lib/galleri-opus-api"
    import { url } from "@roxi/routify";
    import { selection } from "$lib/store/selectedAsset"
    import { filter } from "$lib/store/filter"
    import type { Asset } from "../../../GalleriOpusServer/src/Database/typeorm/entity/Asset";
    import { useGetAssets, assetKeys } from "$lib/queries";

    let queryResult = useGetAssets()

    $: {
        queryResult.updateOptions({ queryKey: assetKeys.assets($filter.tags) })
    }

    $: isSelected = (asset: Asset) => {
        if (Array.isArray($selection)) {
            return !!$selection.find(a => a.id === asset.id)
        }

        return $selection?.id === asset.id
    }
</script>

{#if $queryResult.isSuccess}
    <div class="grid auto-rows-auto gap-2 w-full grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {#each $queryResult.data as asset (asset.id)}
            <div class="flex flex-col p-1 {isSelected(asset) ? 'bg-teal-700' : ''}" role="button" tabindex="0" on:keyup={(e) => {
                switch (e.key) {
                    case " ":
                    case "Enter":
                        selection.set(asset)
                    default:
                        break;
                }
            }} 
            on:click={() => {
                selection.set(asset)
            }}>
                <div class="h-5/6 flex justify-center items-center">
                    <img class="h-full object-contain" src="http://127.0.0.1:3000/assets/{asset.id}/image" loading="lazy" alt=""/>
                </div>    
                <div class="flex p-2">
                    <div class="w-full">
                        <p>{asset.id}</p>
                    </div>
                    <div class="overflow-hidden">
                        <p class="truncate">

                        </p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}