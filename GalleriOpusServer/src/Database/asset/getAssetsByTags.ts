import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";

// const AssetRepo = db.getRepository(Asset);
// const AssetTagRepo = db.getRepository(AssetTag);

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