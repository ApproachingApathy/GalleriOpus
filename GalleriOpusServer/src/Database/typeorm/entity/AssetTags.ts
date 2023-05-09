import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Relation,
	CreateDateColumn,
} from "typeorm";
import { Asset } from "./Asset";
import { Tag } from "./Tag";

@Entity()
export class AssetTag {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@ManyToOne(() => Asset, (asset) => asset.tags, { onDelete: "CASCADE"})
	asset!: Relation<Asset>;

	@ManyToOne(() => Tag, (tag) => tag.assets, { cascade: ["insert"] })
	tag!: Relation<Tag>;
}
