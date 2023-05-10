import { api } from "$lib/galleri-opus-api"
import { useMutation, useQuery, useQueryClient, type UseQueryStoreResult } from "@sveltestack/svelte-query"
import type { Asset } from "../../../../GalleriOpusServer/src/Database/typeorm/entity/Asset"

export const assetKeys = {
    assets: () => ["ASSETS"] as const,
    asset: (id: number) => ["ASSETS", { id }] as const,
    assetTags: (id: number) => ["ASSETS", { id }, "TAGS"] as const,
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
        return api.assets[`${queryKey[1].id}`].get().then(v => v.data).then(v => v)
    },
    {
        enabled,
    })
}

export const useGetAssets = () => {
    return useQuery(assetKeys.assets(), () => {
        return api.assets.get().then(v => v.data).then(v => v)
    })
}

export const useGetAssetTags = (id: number) => {
    return useQuery(assetKeys.assetTags(id), ({ queryKey }) => {
        return api.assets[`${queryKey[1].id}`].tags.get().then(v => v.data).then(v => v)
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