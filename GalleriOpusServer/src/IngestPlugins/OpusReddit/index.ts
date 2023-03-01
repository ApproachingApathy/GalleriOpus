import { IngestHandler } from "../../types/IngestHandler";
import { exists } from "../../utils/exists";

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
	async ingestFromUrl(url, downloadPath) {
		console.log("Reddit");
		// r.config({ proxies: false })
		const working = url.replace(/(\/$)|$/, "/.json");
		console.log(working);

		const res = await fetch(working, {
			headers: new Headers({
				Accept: "application/json",
			}),
		});
		const listing: any = await res.json();
		console.log(listing[0]);
		console.log(listing[0].data.children[0].data.is_self);

		if (listing[0].data.children[0].data.is_self)
			throw new Error("Invalid Post");

		const post = listing[0].data.children[0];
		const imageUrl = post.data.url;

		const imageRes = await fetch(imageUrl);
		const contentType = imageRes.headers.get("Content-Type");
		const matches: [string, string] | undefined = contentType
			?.matchAll(/image\/(.*)/g)
			.next().value;
		if (exists(matches) && matches.length > 0) {
			const downloadPathWithExtension = `${downloadPath}.${matches[1]}`;
			await Bun.write(downloadPathWithExtension, imageRes);

			return {
				filePath: downloadPathWithExtension,
				tags: [
					`source:reddit`,
					`downloader:${INGEST_SOURCE}`,
					`url:${url}`,
					`subreddit:${post.data.subreddit}`,
					`author:${post.data.author}`,
				],
			};
		}
		// console.log(submission.is_self)
		// if (!submission.is_self) {
		//     console.log(submission.url)
		// }
		// console.log(submission)
		return {
			filePath: "downloadPath",
			tags: [""],
		};
	},
};

export default redditIngestHandler;
