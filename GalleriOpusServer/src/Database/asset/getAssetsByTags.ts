import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";

const AssetRepo = db.getRepository(Asset);
const AssetTagRepo = db.getRepository(AssetTag);

interface GetAssetByTagsParams {
	tags: string[];
}

export const getAssetsByTags = async ({ tags }: GetAssetByTagsParams) => {	
	const matchingAssets: Array<Asset> = await AssetRepo.createQueryBuilder().select("Asset.*").where(qb =>
		{	
			const assetTagQuery = AssetTagRepo.createQueryBuilder()
				.select(['AssetTag.assetId', 'COUNT(DISTINCT t.id) AS count'])
				.leftJoin("tag", 't', 'AssetTag.tagId = t.id')
				.where("t.value IN (:...tags)", { tags })
				.groupBy("AssetTag.assetId")

			const subquery = qb
				.subQuery()
				.select("T.assetId")
				.from(`(${assetTagQuery.getQuery()})`, "T")
				.where("T.count = :count", { count: tags.length, tags })
	
			return `Asset.id IN ${subquery.getQuery()}`;
		}
	).execute()

	if (matchingAssets.length < 1) return []

	const assets = await AssetRepo.find({
		relations: {
			tags: {
				tag: true
			},
		},
		where: matchingAssets.map(a => ({id: a.id}))
	})

	return assets;
};