import Elysia, { t } from "elysia";
import { createTags, getTags } from "../../Database/tags";

export const tagController = (app: Elysia) => {
	app.group("/tags", (app) =>
		app
			.get("/", () => {
				return getTags();
			})
			.post("/",  ({ body }) => {
				return createTags({ tags: body.tags })
			}, {
				schema: {
					body: t.Object({
						tags: t.Array(t.String())
					})
				}
			})
	);

	return app;
};
