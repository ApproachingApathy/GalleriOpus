import { db } from "../db";

interface GetAssetByTagsParams {
	tags: string[];
}

export const getAssetsByTags = async ({ tags }: GetAssetByTagsParams) => {
	const matchingAssets = await db.asset.findMany({
		where: {
			tags: {
				some: {
					tag: {

						OR: [
							...tags.map(t => ({
								value: t
							}))
						]
					}
				}
			}
		},
		include: {
			tags: {
				include: {
					tag: true
				}
			}
		}
	})

	return matchingAssets
};