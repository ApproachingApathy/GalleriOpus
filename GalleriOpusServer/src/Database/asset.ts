import { Any } from "typeorm";
import { db } from "./db";
import { Asset } from "./typeorm/entity/Asset";
import { AssetTag } from "./typeorm/entity/AssetTags";
import { Tag } from "./typeorm/entity/Tag";

interface CreateAssetData {
	url: string;
	tags: string[];
}

export const createAsset = async ({ url, tags }: CreateAssetData) => {
	console.log("Creating Assets");
	const asset = new Asset();
	asset.url = url;

	await db.manager.save(asset);

	const TagRepo = db.getRepository(Tag);
	const tagData = tags.map((t) => {
		const tag = new Tag();
		tag.value = t;
		return tag;
	});

	await TagRepo.upsert(tagData, ["UPDATE", "CREATE"]);
	const newTags = await TagRepo.findBy({ value: Any(tags) });

	const AssetTagRepo = db.getRepository(AssetTag);
	const assetTagData = newTags.map((t) => {
		const assetTag = new AssetTag();
		(assetTag.asset = asset), (assetTag.tag = t);
		return assetTag;
	});

	AssetTagRepo.save(assetTagData);

	return db.manager.findOne(Asset, { where: { id: asset.id } });
};
