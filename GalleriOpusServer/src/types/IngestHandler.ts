export interface ImageResponseResult {
	imageResponse: Response;
	tags: string[];
}

export interface IngestHandler {
	name: string;
	matchUrl: (url: string) => boolean;
	getUrlHooks: () => RegExp[];
	getImageResponse: (url: string) => Promise<ImageResponseResult>;
}
