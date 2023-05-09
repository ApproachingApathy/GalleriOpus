import {
	In
} from "typeorm";
import { exists } from "../../utils/exists";
import { db } from "../db";
import { Asset } from "../typeorm/entity/Asset";
import { AssetTag } from "../typeorm/entity/AssetTags";
import { Tag } from "../typeorm/entity/Tag";
import { AssetID } from "./types";

const AssetRepo = db.getRepository(Asset);
const TagRepo = db.getRepository(Tag);
const AssetTagRepo = db.getRepository(AssetTag);

interface DeleteAssetParams {
    targets: AssetID[]
}

export const deleteAssets = async ({ targets }: DeleteAssetParams ) => {
    const assets = await AssetRepo.find({ where: targets.map(t => ({ id: t })) });
    await AssetRepo.remove(assets)
} 