import { db } from "./db";
import { Tag } from "./typeorm/entity/Tag";

const TagRepo = db.getRepository(Tag);
export const getTags = () => {
	return TagRepo.find();
};
