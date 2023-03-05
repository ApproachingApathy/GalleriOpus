import { In } from "typeorm";
import { db } from "./db";
import { Asset } from "./typeorm/entity/Asset";
import { AssetTag } from "./typeorm/entity/AssetTags";
import { Tag } from "./typeorm/entity/Tag";

interface CreateAssetData {
	url: string;
	tags: string[];
}

const AssetRepo = db.getRepository(Asset);
const TagRepo = db.getRepository(Tag);
const AssetTagRepo = db.getRepository(AssetTag);

export const createAsset = async ({ url, tags }: CreateAssetData) => {
	console.log("Creating Assets");
	const asset = AssetRepo.create();
	asset.url = url;

	await AssetRepo.save(asset);

	const tagData = tags.map((t) => {
		const tag = TagRepo.create();
		// @ts-ignore
		tag.id = null;
		tag.value = t;
		return tag;
	});

	await TagRepo.upsert(tagData, ["value"]);
	const newTags = await TagRepo.findBy({ value: In(tags) });

	const assetTagData = newTags.map((t) => {
		const assetTag = new AssetTag();
		assetTag.asset = asset;
		assetTag.tag = t;
		return assetTag;
	});

	AssetTagRepo.save(assetTagData);

	return db.manager.findOne(Asset, { where: { id: asset.id } });
};

export const getAssets = async () => {
	const assets = AssetRepo.find();
	return;
};
