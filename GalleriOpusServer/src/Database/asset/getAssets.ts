import { db } from "../db";

interface GetAssetsParams {
	limit: number;
	offset: number;
	includeTags: boolean;
};

const defaultGetAssetParams: GetAssetsParams = {
	limit: 100,
	offset: 0,
	includeTags: false
}

export const getAssets = async (options: Partial<GetAssetsParams> = {}) => {
	const { limit, offset, includeTags } = {...defaultGetAssetParams, ...options }

	const assets = await db.asset.findMany({
		take: limit,
		skip: offset,
		include: {
			tags: includeTags ? {
				include: {
					tag: true
				}
			} :  false
		}
	})

	return assets
};