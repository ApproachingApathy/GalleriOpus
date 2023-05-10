import Elysia, { t } from "elysia";
import { createTags, getTags } from "../../Database/tags";
import { createResponse } from "../createResponse";

export const tagController = (app: Elysia) => {
	return app.group("/tags", (app) =>
		app
			.get("/", async ({ set }) => {
				set.headers["Content-Type"] = "application/json"
				const tags = await getTags()
				return [...tags]
			})
			.post("/",  async ({ body, set }) => {
				set.headers["Content-Type"] = "application/json"
				const tags = await createTags({ tags: body.tags })
				return [...tags]
			}, {
				schema: {
					body: t.Object({
						tags: t.Array(t.String())
					})
				}
			})
	);
};
