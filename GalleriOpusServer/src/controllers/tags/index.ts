import { t } from "elysia";
import { createTags, getTags } from "../../Database/tags";
import { Controller } from "../../types/Controller";

export const tagController: Controller = (app) => {
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
