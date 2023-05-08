import {
	In,
	Any,
	And,
	FindOptionsWhere,
	ArrayContains,
	FindOperator,
} from "typeorm";
import { exists } from "../utils/exists";
import { db } from "./db";
import { Asset } from "./typeorm/entity/Asset";
import { AssetTag } from "./typeorm/entity/AssetTags";
import { Tag } from "./typeorm/entity/Tag";

const AssetRepo = db.getRepository(Asset);
const TagRepo = db.getRepository(Tag);
const AssetTagRepo = db.getRepository(AssetTag);

interface CreateAssetParams {
	url: string;
	tags: string[];
}

export const createAsset = async ({ url, tags }: CreateAssetParams) => {
	console.log("Creating Assets");
	const asset = AssetRepo.create();
	asset.url = url;

	await AssetRepo.save(asset);

	const existingTags = await TagRepo.findBy({ value: In(tags) });
	const tagsWithoutExisting = tags.filter(
		(t) => !exists(existingTags.find((tag2) => tag2.value === t))
	);
	const tagData = tagsWithoutExisting.map((t) => {
		const tag = TagRepo.create();
		tag.value = t;
		return tag;
	});
	const insertedTags = await TagRepo.save(tagData);

	const combinedTags = [...existingTags, ...insertedTags];

	const assetTagData = combinedTags.map((t) => {
		const assetTag = new AssetTag();
		assetTag.asset = asset;
		assetTag.tag = t;
		return assetTag;
	});

	AssetTagRepo.save(assetTagData);

	return db.manager.findOne(Asset, {
		where: { id: asset.id },
		relations: ["tags", "tags.tag"],
	});
};

export const getAssets = async () => {
	const assets = AssetRepo.find({ relations: ["tags", "tags.tag"] });
	return assets;
};

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
