<script lang="ts">
    import { useAddTagToAsset, useGetAssetTags } from "$lib/queries";
    import { selection } from "$lib/store/selectedAsset"
    import SelectionMenu from "./SelectionMenu.svelte";
    let inputTag = ""

    $: hasSelection = !!$selection;

    const addTagMutation = useAddTagToAsset()  

    $: addTag = async (assetId: number) => {
       $addTagMutation.mutate({ id: assetId, tags: [inputTag]})
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
    
    <SelectionMenu />
</div>