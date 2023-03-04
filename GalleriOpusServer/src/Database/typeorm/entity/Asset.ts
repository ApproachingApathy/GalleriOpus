import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Relation,
} from "typeorm";
import { AssetTag } from "./AssetTags";

@Entity()
export class Asset {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@Column("text")
	url!: string;

	@OneToMany(() => AssetTag, (assetTag) => assetTag.asset)
	tags!: Relation<AssetTag[]>;
}
