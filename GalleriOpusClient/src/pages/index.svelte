<script lang="ts">
    import { api } from "$lib/galleri-opus-api/index"

    let data = api.index.get()
</script>

<h1 class="text-xl">Hello World</h1>

{#await data then value} 
    <p>{value.data}</p>
{/await}