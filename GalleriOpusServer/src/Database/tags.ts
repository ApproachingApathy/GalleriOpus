import { Prisma } from "@prisma/client";
import { formatTag } from "../utils/formatTag";
import { db } from "./db";
import { Tag } from "./typeorm/entity/Tag";

// const TagRepo = db.getRepository(Tag);
export const getTags = () => {
	return db.tag.findMany({
		orderBy: {
			value: "asc"
		}
	})
};

interface CreateTagsParams {
	tags: string[]
}

export const createTags = async ({ tags }: CreateTagsParams) => {
	const newTagsData: Prisma.TagCreateInput[] = tags.map((t) => ({
		value: t,
	}))

	const newTags = []

	for (let t of newTagsData) {
		newTags.push(await db.tag.create({ data: t }))
	}

	return newTags
}