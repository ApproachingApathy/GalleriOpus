import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Relation,
} from "typeorm";
import { AssetTag } from "./AssetTags";

@Entity()
export class Tag {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@Column("varchar", {
		unique: true,
	})
	value!: string;

	@OneToMany(() => AssetTag, (assetTag) => assetTag.tag)
	assets!: Relation<AssetTag[]>;
}
