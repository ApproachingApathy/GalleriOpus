import { db } from "../db";
import { AssetID } from "./types";

interface DeleteAssetParams {
    targets: AssetID[]
}

export const deleteAssets = async ({ targets }: DeleteAssetParams ) => {
    await db.asset.deleteMany({ where: {
        OR: [
            ...targets.map((t) => ({
                id: t
            }))
        ]
    }})
} 