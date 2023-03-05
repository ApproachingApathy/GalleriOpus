import { IngestHandler } from "../../types/IngestHandler";
import { getContentTypeInfo } from "../../IngestManager/getContentTypeInfo";

const directDLIngestHandler: IngestHandler = {
	name: "OPUS_DirectDL",
	getUrlHooks() {
		return [/.*/];
	},
	matchUrl(url) {
		//TODO
		return true;
	},
	async getImageResponse(url) {
		const response = await fetch(url);
		// Shouldn't happen, but bug if content-type is "image/" with no append type.
		return {
			imageResponse: response,
			tags: [`url:${url}`],
		};
	},
};

export default directDLIngestHandler;
