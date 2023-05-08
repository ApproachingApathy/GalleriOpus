import { createAsset, getAssets, getAssetsByTags } from "../../Database/asset";
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
			);
	});

	return app;
};
