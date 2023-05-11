<script lang="ts">
    import { api } from "$lib/galleri-opus-api"
    import { url } from "@roxi/routify";
    import { selection } from "$lib/store/selectedAsset"
    import type { Asset } from "../../../GalleriOpusServer/src/Database/typeorm/entity/Asset";
    import { useGetAssets } from "$lib/queries";

    let queryResult = useGetAssets() 

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
            <div class="flex flex-col items-start p-1 {isSelected(asset) ? 'bg-teal-700' : ''}" role="button" tabindex="0" on:keyup={()=>{}} on:click={() => {
                // console.log(asset)
                selection.set(asset)
            }}>
                <div class="h-5/6">
                    <img class="h-full object-contain flex-shrink" src="http://127.0.0.1:3000/assets/{asset.id}/image" loading="lazy" alt=""/>
                </div>    
                <div class="flex p-2">
                    <div class="w-40">
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