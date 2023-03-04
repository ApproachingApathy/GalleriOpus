import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Relation,
} from "typeorm";
import { Asset } from "./Asset";
import { Tag } from "./Tag";

@Entity()
export class AssetTag {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column("datetime")
	createdAt!: Date;

	@ManyToOne(() => Asset, (asset) => asset.tags)
	asset!: Relation<Asset>;

	@ManyToOne(() => Tag, (tag) => tag.assets)
	tag!: Relation<Tag>;
}