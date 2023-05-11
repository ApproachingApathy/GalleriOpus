<script lang="ts">
    import { useGetTags } from "$lib/queries";
    import { filter } from "$lib/store/filter";

    const tagQuery = useGetTags()
    
    $: isTagIncludedInFilter = (tagValue: string) => {
        const index = $filter.tags.findIndex((v) => v === tagValue)
        return {
            isIncluded: index > -1,
            index
        }
    }

    const toggleFilter = (tagValue: string) => {
        filter.update((f) => {
            const inclusionInfo = isTagIncludedInFilter(tagValue)

            if (inclusionInfo.isIncluded) {
                f.tags.splice(inclusionInfo.index, 1)
                return f
            }
            f.tags.push(tagValue)
            return f
        })
    }
</script>

<div class="border-b py-3">
    <div class="text-center">
        <h2 class="text-xs font-semibold">Tags</h2>
    </div>
</div>

<div class="flex flex-col">
    {#if $tagQuery.isSuccess}
        {#each $tagQuery.data as tag (tag.id)}
            <button type="button" on:click={() => {
                toggleFilter(tag.value)
            }}>
                <div class="text-xs truncate hover:bg-slate-600 {isTagIncludedInFilter(tag.value).isIncluded ? "bg-slate-700" : "" }">
                    {tag.value}
                </div>
            </button>
        {/each}
    {/if}
</div>


