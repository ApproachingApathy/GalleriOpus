import { api } from "$lib/galleri-opus-api"
import { useMutation, useQuery, useQueryClient } from "@sveltestack/svelte-query"

export const assetKeys = {
    base: () => ["ASSETS"] as const,
    assets: (tags?: string[]) => ["ASSETS", { tags }] as const,
    asset: (id: number) => ["ASSETS", "SINGLE", { id }] as const,
    assetTags: (id: number) => ["ASSETS", "SINGLE", { id }, "TAGS"] as const,
}
// :UseQueryStoreResult<Asset[], unknown, Asset[], readonly ["ASSETS"]>
interface QueryOptions {
    enabled: boolean
}

const defaultQueryOptions: QueryOptions = {
    enabled: true
}

export const useGetAsset = (id: number, options: Partial<QueryOptions> = {}) => {
    const { enabled } = {...defaultQueryOptions, ...options}

    return useQuery(assetKeys.asset(id), ({ queryKey }) => {
        return api.assets[`${queryKey[2].id}`].get().then(v => v.data).then(v => v)
    },
    {
        enabled,
    })
}

interface UseGetAssetsParams {
    tags?: string[]
}

const defaultUseGetAssetParams = {}

export const useGetAssets = (options: UseGetAssetsParams = {}) => {
    const { tags } = {...defaultQueryOptions, ...options}
    
    return useQuery(assetKeys.assets(tags), ({ queryKey }) => {
        const query: Record<string, string> = {}
        if (!!queryKey[1].tags) query.tags = queryKey[1].tags.join(',')
        console.log(query)
        return api.assets.get({ $query: query }).then(v => v.data).then(v => v)
    })
}

export const useGetAssetTags = (id: number) => {
    return useQuery(assetKeys.assetTags(id), ({ queryKey }) => {
        return api.assets[`${queryKey[2].id}`].tags.get().then(v => v.data).then(v => v)
    })
}

export const useAddTagToAsset = () => {
    const queryClient = useQueryClient();
    return useMutation(({id, tags}: { id: number; tags: string[]}) => {
        return api.assets[`${id}`].tags.post({ tags }).then(v => v.data).then(v => v)
    }, {
        onSuccess: ({ id }) => {
            queryClient.invalidateQueries(assetKeys.asset(id))
        }
    })
}

export const useRemoveTagFromAsset = () => {
    const queryClient = useQueryClient();
    return useMutation(({ id, tags }: {id: number, tags: string[]} ) => {
        return api.assets[`${id}`].tags.delete({ tags }).then(v => v.data).then(v => v)
    }, {
        onSuccess: (_, {id}) => {
            queryClient.invalidateQueries(assetKeys.asset(id))
        },
    })
}

export const useAddAsset = () => {
    const queryClient = useQueryClient();

    return useMutation(({ url }: { url: string }) => {
        return api.assets.ingest.post(({ url, options: {}})).then(v => v.data).then(v => v);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(assetKeys.assets())
        }
    })
}

export const useRemoveAsset = () => {
    const queryClient = useQueryClient();

    return useMutation(({ id }: {id: number}) => {
        return api.assets.delete({ targets: [id]}).then(v => v.data).then(v => v);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(assetKeys.assets())
        }
    })
}