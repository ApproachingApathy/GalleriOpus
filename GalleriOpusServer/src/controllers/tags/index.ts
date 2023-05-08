import { getTags } from "../../Database/tags";
import { Controller } from "../../types/Controller";

export const tagController: Controller = (app) => {
	app.group("/tags", (app) =>
		app.get("/", () => {
			return getTags();
		})
	);

	return app;
};
