import { exists } from "../utils/exists";
import { join } from "path";
import { nanoid } from "nanoid";

import { IngestHandler, IngestResult } from "../types/IngestHandler.js";
import directDLIngestHandler from "../IngestPlugins/OpusDirect";
import redditIngestHandler from "../IngestPlugins/OpusReddit/index.js";

interface IngestManager {
	initialize: () => void;
	_ingestHandlers: { [x: string]: IngestHandler };
	_urlHooks: [RegExp, string][];
	registerHandler: (handler: IngestHandler) => void;
	ingest: (url: string) => Promise<IngestResult>;
}

export const ingestManager: IngestManager = {
	initialize: () => {
		ingestManager.registerHandler(redditIngestHandler);
		ingestManager.registerHandler(directDLIngestHandler);
	},

	_ingestHandlers: {},

	_urlHooks: [],

	registerHandler: (handler: IngestHandler) => {
		const existingIngestHandlerAtName =
			ingestManager._ingestHandlers[handler.name];
		console.log(existingIngestHandlerAtName);

		if (exists(existingIngestHandlerAtName)) {
			throw new Error(`Ingestor ${handler.name} already exists.`);
		}

		const hooks: [RegExp, string][] = handler
			.getUrlHooks()
			.map((matcher) => [matcher, handler.name]);

		(ingestManager._ingestHandlers[handler.name] = handler),
			ingestManager._urlHooks.push(...hooks);
	},

	ingest: async (url: string) => {
		const urlHook = ingestManager._urlHooks.find(([matcher, handlerName]) =>
			exists(url.match(matcher))
		);

		if (!exists(urlHook)) {
			throw new Error(`No Matching Ingest Handler for ${url}.`);
		}

		const ingestHandler = ingestManager._ingestHandlers[urlHook[1]];

		const result = await ingestHandler.ingestFromUrl(
			url,
			join(process.env.ASSET_DOWNLOAD_PATH ?? "", nanoid())
		);

		return result;
	},
};
