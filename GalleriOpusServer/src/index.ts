import { Elysia, SCHEMA, DEFS } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors"

import { ingestManager } from "./IngestManager/IngestManager";
import { assetController } from "./controllers/assets";
import { tagController } from "./controllers/tags";
ingestManager.initialize();

const app = new Elysia()
	.use(
		swagger({
			path: "/docs",
		})
	)
	.use(cors())
	.use(assetController)
	.use(tagController)
	.get("/", () => "Galleri Opus")


app.listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
