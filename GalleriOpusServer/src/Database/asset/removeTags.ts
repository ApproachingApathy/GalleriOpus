import { db } from "../db";
import { AssetID } from "./types"

// const AssetRepo = db.getRepository(Asset);
// const TagRepo = db.getRepository(Tag);
// const AssetTagRepo = db.getRepository(AssetTag);

interface ApplyTagToAssetParams {
    asset: AssetID,
    tags: string[]
}

export const removeTagsFromAsset = async ({ asset: assetId, tags }: ApplyTagToAssetParams) => {
    await db.assetTag.deleteMany({
        where: {
            OR: [
                ...tags.map(t => ({ asset: {id: assetId}, tag: {value: t} }))
            ],
        }
    })
}