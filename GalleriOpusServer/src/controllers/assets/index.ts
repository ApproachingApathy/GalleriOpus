import { applyTagsToAsset, createAsset, deleteAssets, getAsset, getAssets, getAssetsByTags, removeTagsFromAsset } from "../../Database/asset";
import type { Asset } from "../../Database/typeorm/entity/Asset";
import { ingestManager } from "../../IngestManager/IngestManager";
import Elysia, { t } from "elysia";
import { createResponse } from "../createResponse";
import { getImageBlob } from "./getImageBlob";
import type { AssetTag } from "../../Database/typeorm/entity/AssetTags";
import { localDataManager } from "../../DataManagers/LocalDataManager";

export const assetController = (app: Elysia) => {
    return app.group("/assets", (app) => {
        return app
            .get(
                "",
                async ({ query, set }) => {
                    set.headers["Content-Type"] = "application/json"

                    let body: Asset[] = []
                    if (query.tags) {
                        const tags = query.tags.split(",");
                        const assets = await getAssetsByTags({ tags });
                        return [...assets]
                    }

                    const assets = await getAssets()

                    return [...assets];
                },
                {
                    schema: {
                        query: t.Object({
                            tags: t.Optional(t.String()),
                        }),
                    },
                }
            )
            .delete("", async ({ body, set }) => {

                await deleteAssets({ targets: body.targets })
                return undefined
            }, {
                schema: {
                    body: t.Object({
                        targets: t.Array(t.Integer({ minimum: 0 }))
                    })
                }
            })
            .post(
                "/ingest",
                async ({ body, set}) => {
                    set.headers["Content-Type"] = "application/json"
                    const ingestResult = await ingestManager.ingest(body.url);
                    const asset = await createAsset({
                        tags: ingestResult.tags,
                        url: ingestResult.fileUrl.toString(),
                    });
                    return {...asset};
                },
                {
                    schema: {
                        body: t.Object({
                            url: t.String(),
                            options: t.Object({}),
                        }),
                    },
                }
            )
            .get("library-size", async ({}) => {
                return (await localDataManager.getTotalStored()).toMiB()
            })
            .get(
                "/:id",
                async ({ params, set }) => {
                    set.headers["Content-Type"] = "application/json"
                    const asset = await getAsset(Number.parseInt(params.id))
                    if (!asset) {
                        set.status = 404
                        set.headers["Content-Type"] = "text/plain"
                        throw new Error("Asset not found.")
                    }

                    return {...asset}
                },
                {
                    schema: {
                        params: t.Object({
                            id: t.String()
                        })
                    }
                }
            )
            .get(
                "/:id/image",
                async ({ params }) => {
                    const asset = await getAsset(Number.parseInt(params.id))

                    if (!asset) return createResponse("Asset not found", 404, "text/plain")
                    const blob = getImageBlob(new URL(asset.url))
                    return createResponse(blob.stream(), 200, blob.type)
                },
                {
                    schema: {
                        params: t.Object({
                            id: t.String()
                        })
                    }
                }
            )
            .get(
                "/:id/tags",
                async ({params: { id }, set}) => {
                    set.headers["Content-Type"] = "application/json"
                    const asset = await getAsset(Number.parseInt(id))
                    
                    if (!asset) {
                        set.status = 404
                        set.headers["Content-Type"] = "text/plain"
                        throw new Error("Asset not found.");
                    }
                    const tags = asset.tags
                    return [...tags]
                },
                {
                    schema: {
                        params: t.Object({
                            id: t.String()
                        }),
                    }
                }
            )
            .post(
                "/:id/tags",
                async ({ body, params: { id }, set }) => {
                    set.headers["Content-Type"] = "application/json"
                    const asset = await applyTagsToAsset({ asset: Number.parseInt(id), tags: body.tags })
                    return {...asset}
                },
                {
                    schema: {
                        body: t.Object({
                            tags: t.Array(t.String())
                        }),
                        params: t.Object({
                            id: t.String()
                        })
                    },
                }	
            )
            .delete(
                "/:id/tags",
                async ({ body, params: { id }, set }) => {
                    await removeTagsFromAsset({ asset: Number.parseInt(id), tags: body.tags })
                    return undefined
                },
                {
                    schema: {
                        body: t.Object({
                            tags: t.Array(t.String())
                        }),
                        params: t.Object({
                            id: t.String()
                        })
                    },
                }	
            )
    });
};
