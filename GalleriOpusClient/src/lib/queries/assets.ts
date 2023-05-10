import { api } from "$lib/galleri-opus-api"
import { useMutation, useQuery, useQueryClient, type UseQueryStoreResult } from "@sveltestack/svelte-query"
import type { Asset } from "../../../../GalleriOpusServer/src/Database/typeorm/entity/Asset"

const keys = {
    assets: () => ["ASSETS"] as const,
    asset: (id: number) => ["ASSETS", id] as const,
    assetTags: (id: number) => ["ASSETS", id, "TAGS"] as const,
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

    return useQuery(keys.asset(id), () => {
        return api.assets[`${id}`].get().then(v => v.data).then(v => v)
    },
    {
        enabled
    })
}

export const useGetAssets = () => {
    return useQuery(keys.assets(), () => {
        return api.assets.get().then(v => v.data).then(v => v)
    })
}

export const useGetAssetTags = (id: number) => {
    return useQuery(keys.assetTags(id), () => {
        return api.assets[`${id}`].tags.get().then(v => v.data).then(v => v)
    })
}

export const useAddTagToAsset = () => {
    const queryClient = useQueryClient();
    return useMutation(({id, tags}: { id: number; tags: string[]}) => {
        return api.assets[`${id}`].tags.post({ tags }).then(v => v.data).then(v => v)
    }, {
        onSuccess: ({ id }) => {
            queryClient.invalidateQueries(keys.asset(id))
        }
    })
}

export const useRemoveTagFromAsset = () => {
    const queryClient = useQueryClient();
    return useMutation(({ id, tags }: {id: number, tags: string[]} ) => {
        return api.assets[`${id}`].tags.delete({ tags }).then(v => v.data).then(v => v)
    }, {
        onSuccess: (_, {id}) => {
            queryClient.invalidateQueries(keys.asset(id))
        }
    })
}