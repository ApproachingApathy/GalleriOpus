import { db } from "./db";

interface CreateAssetData {
	url: string;
	tags: string[];
}

export const createAsset = ({ url, tags }: CreateAssetData) => {
	return db.asset.create({
		data: {
			url,
			tags: {
				create: [
					...tags.map((t) => ({
						tag: {
							connectOrCreate: {
								create: {
									value: t,
								},
								where: {
									value: t,
								},
							},
						},
					})),
				],
			},
		},
		include: {
			tags: {
				include: {
					tag: true,
				},
			},
		},
	});
};
