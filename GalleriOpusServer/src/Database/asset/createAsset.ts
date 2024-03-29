import { db } from "../db";
import type { Prisma } from "@prisma/client";

interface CreateAssetParams {
	url: string;
	tags: string[];
}

export const createAsset = async ({ url, tags }: CreateAssetParams) => {
	const asset = await db.asset.create({
		data: {
			url,
		},
	})

	const assetTagsData: Prisma.AssetTagCreateInput[] = tags.map(t => ({
		asset: {
			connect: {
				id: asset.id
			}
		},
		tag: {
			connectOrCreate: {
				where: {
					value: t
				},
				create: {
					value: t
				}
			}
		}
	}))

	for (let at of assetTagsData) {
		await db.assetTag.create({ data: at })
	}

	const updatedAsset = db.asset.findUnique({where: { id: asset.id }, include: {
		tags: {
			include: {
				tag: true
			}
		}
	}})

	return updatedAsset
};