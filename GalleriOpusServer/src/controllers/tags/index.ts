import Elysia, { t } from "elysia";
import { createTags, getTags } from "../../Database/tags";
import { createResponse } from "../createResponse";

export const tagController = (app: Elysia) => {
	return app.group("/tags", (app) =>
		app
			.get("/", async () => {
				return createResponse(await getTags());
			})
			.post("/",  ({ body }) => {
				return createResponse(createTags({ tags: body.tags }))
			}, {
				schema: {
					body: t.Object({
						tags: t.Array(t.String())
					})
				}
			})
	);
};
