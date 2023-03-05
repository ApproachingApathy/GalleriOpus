import { exists } from "../utils/exists";
import { join, resolve } from "path";
import { nanoid } from "nanoid";

import { IngestHandler, ImageResponseResult } from "../types/IngestHandler.js";
import directDLIngestHandler from "../IngestPlugins/OpusDirect";
import redditIngestHandler from "../IngestPlugins/OpusReddit/index.js";
import { getContentTypeInfo } from "./getContentTypeInfo";

type FileName = string;

interface IngestResult {
	fileUrl: URL;
	tags: string[];
}

interface IngestManager {
	initialize: () => void;
	_ingestHandlers: { [x: string]: IngestHandler };
	_urlHooks: [RegExp, string][];
	_writeResponseToFS: (fileName: FileName, response: Response) => Promise<URL>;
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

	_writeResponseToFS: async (fileName, response) => {
		const filePath = resolve(join(process.env.ASSET_DOWNLOAD_PATH, fileName));
		await Bun.write(filePath, response);
		return new URL(`file://${filePath}`);
	},

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

		ingestManager._ingestHandlers[handler.name] = handler;
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

		const result = await ingestHandler.getImageResponse(url);

		const contentType =
			result.imageResponse.headers.get("Content-Type") ?? undefined;

		if (!contentType) throw new Error("Failed to verify content-typed");

		const contentTypeInfo = getContentTypeInfo(contentType);

		if (!contentTypeInfo.isImage)
			throw new Error("The target url did not return an image.");

		const fileUrl = await ingestManager._writeResponseToFS(
			`${nanoid()}.${contentTypeInfo.subtype}`,
			result.imageResponse
		);

		return {
			fileUrl,
			tags: result.tags,
		};
	},
};
