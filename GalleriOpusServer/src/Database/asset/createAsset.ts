import {
	In
} from "typeorm";
import { exists } from "../../utils/exists";
import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";
import { formatTag } from "../../utils/formatTag";

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
		tag.value = formatTag(t);
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