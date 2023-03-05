import { Elysia, t } from "elysia";
import { IngestRequestBody } from "./types/IngestRequestBody";

import { ingestManager } from "./IngestManager/IngestManager";
import { createAsset } from "./Database/asset";
ingestManager.initialize();

const app = new Elysia()
	.get("/", () => "Hello Elysia")
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
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
