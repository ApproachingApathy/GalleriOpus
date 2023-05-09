import {
	In
} from "typeorm";
import { exists } from "../../utils/exists";
import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";
import { AssetID } from "./types"

const AssetRepo = db.getRepository(Asset);
const TagRepo = db.getRepository(Tag);
const AssetTagRepo = db.getRepository(AssetTag);

interface ApplyTagToAssetParams {
    asset: AssetID,
    tags: string[]
}

export const applyTagToAsset = async ({ asset: assetId, tags }: ApplyTagToAssetParams) => {
    const asset = await AssetRepo.findOne({ where: { id: assetId }, relations: {
        tags: {
            tag: true
        }
    }})

    if (!asset) throw new Error("Asset doesn't exist.")

    

    const newTags = tags.map(t => {
        const at = new AssetTag()
        const tag = new Tag()
        tag.value = t
        at.tag = tag
        return at
    })


    asset.tags.push(...newTags)

    return AssetRepo.save(asset)
}