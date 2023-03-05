import { exists } from "../utils/exists";

type ContentType = string;

type ContentTypeInfo =
	| {
			isImage: true;
			subtype: string;
	  }
	| {
			isImage: false;
	  };

export const getContentTypeInfo = (
	contentType: ContentType
): ContentTypeInfo => {
	const matches: [string, string] | undefined = contentType
		?.matchAll(/image\/(.*)/g)
		.next().value;
	const isImage = exists(matches);

	if (!isImage) return { isImage };

	return {
		isImage,
		subtype: matches[1],
	};
};
