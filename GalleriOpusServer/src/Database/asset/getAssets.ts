import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";

const AssetRepo = db.getRepository(Asset);
const TagRepo = db.getRepository(Tag);
const AssetTagRepo = db.getRepository(AssetTag);

interface GetAssetsParams {
	limit: number;
	offset: number;
	includeTags: boolean;
};

const defaultGetAssetParams: GetAssetsParams = {
	limit: 100,
	offset: 0,
	includeTags: false
}

export const getAssets = async (options: Partial<GetAssetsParams> = {}) => {
	const { limit, offset, includeTags } = {...defaultGetAssetParams, ...options }
	const relations = []

	if (includeTags) relations.push("tags", "tags.tag")

	const assets = AssetRepo.find({ relations, take: limit, skip: offset});
	return assets;
};