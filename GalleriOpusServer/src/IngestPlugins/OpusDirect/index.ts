import { IngestHandler } from "../../types/IngestHandler";
import { getContentTypeInfo } from "../common/getContentTypeInfo";

const directDLIngestHandler: IngestHandler = {
	name: "OPUS_DirectDL",
	getUrlHooks() {
		return [/.*/];
	},
	matchUrl(url) {
		//TODO
		return true;
	},
	async ingestFromUrl(url, downloadPath) {
		const response = await fetch(url);
		const contentType = response.headers.get("content-type");
		// Shouldn't happen, but bug if content-type is "image/" with no append type.
		const matches: [string, string] | undefined = contentType
			?.matchAll(/image\/(.*)/g)
			.next().value;
		const contentTypeInfo = contentType
			? getContentTypeInfo(contentType)
			: undefined;
		if (contentTypeInfo?.isImage) {
			const downloadPathWithExtension = `${downloadPath}.${contentTypeInfo.subtype}`;
			await Bun.write(downloadPathWithExtension, response);

			return {
				filePath: downloadPathWithExtension,
				tags: [`url:${url}`],
			};
		}
		throw new Error(`Failed to download from ${url}`);
	},
};

export default directDLIngestHandler;
