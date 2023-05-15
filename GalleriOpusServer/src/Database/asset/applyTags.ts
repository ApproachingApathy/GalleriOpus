import {
	In
} from "typeorm";
import { exists } from "../../utils/exists";
import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";
import { AssetID } from "./types"
import { formatTag } from "../../utils/formatTag";

const AssetRepo = db.getRepository(Asset);
const TagRepo = db.getRepository(Tag);
const AssetTagRepo = db.getRepository(AssetTag);

interface ApplyTagToAssetParams {
    asset: AssetID,
    tags: string[]
}

export const applyTagsToAsset = async ({ asset: assetId, tags }: ApplyTagToAssetParams) => {
    const asset = await AssetRepo.findOne({ where: { id: assetId }, relations: {
        tags: {
            tag: true
        }
    }})

    if (!asset) throw new Error("Asset doesn't exist.")

    const existingTags = await TagRepo.find({ where: tags.map(t => ({ value: t })) })
    const tagsWithoutExisting = tags.filter(t => !exists(existingTags.find(existingTag => t == existingTag.value)))

    

    const newAssetTags = tagsWithoutExisting.map(t => {
        const at = new AssetTag()
        const tag = new Tag()
        tag.value = formatTag(t)
        at.tag = tag
        return at
    })

    const newAssetTagsLinks = existingTags.map(t => {
        const at = new AssetTag()
        at.tag = t
        return at
    })


    asset.tags.push(...newAssetTags, ...newAssetTagsLinks)

    return AssetRepo.save(asset)
}