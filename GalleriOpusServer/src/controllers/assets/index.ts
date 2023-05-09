import { applyTagsToAsset, createAsset, deleteAssets, getAssets, getAssetsByTags, removeTagsFromAsset } from "../../Database/asset";
import { ingestManager } from "../../IngestManager/IngestManager";
import { Controller } from "../../types/Controller";
import { t } from "elysia";

export const assetController: Controller = (app) => {
	app.group("/assets", (app) => {
		return app
			.get(
				"/",
				({ query }) => {
					if (query.tags) {
						const tags = query.tags.split(",");
						return getAssetsByTags({ tags });
					}

					return getAssets();
				},
				{
					schema: {
						query: t.Object({
							tags: t.Optional(t.String()),
						}),
					},
				}
			)
			.delete("/", async ({ body }) => {
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
				async ({ body }) => {
					const ingestResult = await ingestManager.ingest(body.url);
					const asset = await createAsset({
						tags: ingestResult.tags,
						url: ingestResult.fileUrl.toString(),
					});
					return asset;
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
			.post(
				"/:id/tags",
				async ({ body, params: { id } }) => {
					return applyTagsToAsset({ asset: Number.parseInt(id), tags: body.tags })
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
				async ({ body, params: { id } }) => {
					return removeTagsFromAsset({ asset: Number.parseInt(id), tags: body.tags })
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

	return app;
};
