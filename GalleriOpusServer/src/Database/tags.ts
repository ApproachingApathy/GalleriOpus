import { db } from "./db";
import { Tag } from "./typeorm/entity/Tag";

const TagRepo = db.getRepository(Tag);
export const getTags = () => {
	return TagRepo.find();
};

interface CreateTagsParams {
	tags: string[]
}

export const createTags = ({ tags }: CreateTagsParams) => {
	const newTags = tags.map(t => {
		const tag = new Tag();
		tag.value = t;
		return tag
	})
	return TagRepo.save(newTags)
}