import {
	In
} from "typeorm";
import { exists } from "../../utils/exists";
import { db } from "../db";
import { Prisma } from "@prisma/client"
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";
import { AssetID } from "./types"
import { formatTag } from "../../utils/formatTag";

// const AssetRepo = db.getRepository(Asset);
// const TagRepo = db.getRepository(Tag);
// const AssetTagRepo = db.getRepository(AssetTag);

interface ApplyTagToAssetParams {
    assetId: AssetID,
    tags: string[]
}

const isKnownError = (item: any): item is Prisma.PrismaClientKnownRequestError => {
    return item
}

export const applyTagsToAsset = async ({ assetId: assetId, tags }: ApplyTagToAssetParams) => {
    const newTags: Prisma.AssetTagCreateInput[] = tags.map(t => ({
        
        tag: {
            connectOrCreate: {
                where: {
                    value: t
                },
                create: {
                    value: t
                }
            }
        },
        asset: {
            connect: {
                id: assetId
            }
        }
    }))

    for (let at of newTags) {
        try {
            await db.assetTag.create({
                data: at
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                switch (e.code) {
                    case "P2018":
                        throw new Error("Asset not Found")
                        break;
                    default:
                        break;

                }
            }
        }
    }

    const updatedAsset = await db.asset.findUnique({ where: {
        id: assetId
    }, include: {
        tags: {
            include: {
                tag: true
            }
        }
    }})

    return updatedAsset
}