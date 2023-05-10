<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from '$lib/components/Counter.svelte'
  import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query"

  import { Router } from "@roxi/routify"
  import { routes } from "../.routify/routes"

  const queryClient = new QueryClient()
</script>
<QueryClientProvider client={queryClient}>
  <Router {routes} />
</QueryClientProvider>
