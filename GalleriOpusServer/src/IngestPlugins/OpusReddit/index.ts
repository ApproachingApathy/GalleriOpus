import { IngestHandler } from "../../types/IngestHandler";
import { getContentTypeInfo } from "../../IngestManager/getContentTypeInfo";

const INGEST_SOURCE = "ingest_source:opus-reddit";

const redditHooks = [/((?:https?)?:\/\/)?(?:www\.)?(reddit\.com)/];

const redditIngestHandler: IngestHandler = {
	name: "OpusReddit",
	getUrlHooks() {
		return redditHooks;
	},
	matchUrl(url) {
		const foundHook = redditHooks.find((hook) => !!url.match(hook));
		return !!foundHook;
	},
	async getImageResponse(url) {
		const working = url.replace(/(\/$)|$/, "/.json");

		const res = await fetch(working, {
			headers: new Headers({
				Accept: "application/json",
			}),
		});
		const listing: any = await res.json();

		if (listing[0].data.children[0].data.is_self)
			throw new Error("Invalid Post");

		const post = listing[0].data.children[0];
		const imageUrl = post.data.url;

		const imageResponse = await fetch(imageUrl);

		return {
			imageResponse: imageResponse,
			tags: [
				`source:reddit`,
				`downloader:${INGEST_SOURCE}`,
				`url:${url}`,
				`subreddit:${post.data.subreddit}`,
				`author:${post.data.author}`,
			],
		};
	},
};

export default redditIngestHandler;
