import { Elysia, t } from "elysia";

import { ingestManager } from "./IngestManager/IngestManager";
import { assetController } from "./controllers/assets";
ingestManager.initialize();

const app = new Elysia().get("/", () => "Hello Elysia");

app.use(assetController);

app.listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
