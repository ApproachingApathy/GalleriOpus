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
};

const defaultGetAssetParams: GetAssetsParams = {
	limit: 100,
	offset: 0
}

export const getAssets = async ({ limit, offset } = defaultGetAssetParams) => {
	const assets = AssetRepo.find({ relations: ["tags", "tags.tag"], take: limit, skip: offset});
	return assets;
};