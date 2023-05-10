<script lang="ts">
    import { useAddAsset } from "$lib/queries";

    let ingestUrl = ""

    const addAssetMutation = useAddAsset()

    $: ingestAssets = async () => {
        await $addAssetMutation.mutate({url: ingestUrl})
        ingestUrl = ""
    }
</script>

<div class="flex justify-center items-center h-12 p-2 border-b dark:bg-stone-800 dark:text-slate-200 gap-6">
    <div>
        <input class="border" placeholder="Search" />
    </div>
    <div>
        <form class="contents" on:submit={(e) => {
            e.preventDefault()
            ingestAssets()
        }}>
            <input class="border" placeholder="Image Url" bind:value={ingestUrl}/>
            <button> Add </button>
        </form>
    </div>
</div>