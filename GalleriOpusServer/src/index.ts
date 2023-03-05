import { Elysia, SCHEMA, DEFS } from "elysia";
import { swagger } from "@elysiajs/swagger";

import { ingestManager } from "./IngestManager/IngestManager";
import { assetController } from "./controllers/assets";
ingestManager.initialize();

const app = new Elysia()
	.use(
		swagger({
			path: "/docs",
		})
	)
	.get("/", ({ store }) => store[SCHEMA]);

app.use(assetController);

app.listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
