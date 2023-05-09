<script lang="ts">
    import { api } from "$lib/galleri-opus-api/index"
    import { url } from "@roxi/routify";

    let data = api.assets.get().then(v => v.data).then(v => v);
    $: console.log(data)
</script>

{#await data then assets}
    {console.log(assets)}
    <div class="grid grid-flow-col gap-2 w-full grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {#each assets as asset (asset.id)}
        <div class="">
            <a class="contents" href={`/asset/${asset.id}`}>
                <div>
                    <img class="w-full object-contain flex-shrink h-80" src={`http://127.0.0.1:3000/assets/${asset.id}/image`} />
                </div>    
                <div class="flex">
                    <div class="w-40">
                        <p>{asset.id}</p>
                    </div>
                    <div class="overflow-hidden">
                        <p class="truncate">

                        </p>
                    </div>
                </div>
            </a>
            </div>
        {/each}
    </div>
{/await}