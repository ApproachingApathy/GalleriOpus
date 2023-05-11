import { api } from "$lib/galleri-opus-api"
import { useQuery } from "@sveltestack/svelte-query"

export const tagKeys = {
    tags: () => ["TAGS"] as const
}

interface QueryOptions {
    enabled: boolean
}

const defaultQueryOptions: QueryOptions = {
    enabled: true
}

export const useGetTags = (options: Partial<QueryOptions> = {}) => {
    const { enabled } = {...defaultQueryOptions, ...options}
    return useQuery(tagKeys.tags(), () => {
        return api.tags.get().then(v => v.data).then(v => v)
    },
    {
        enabled
    })
}