<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from '$lib/components/Counter.svelte'

  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"
</script>

<Router {routes} />
