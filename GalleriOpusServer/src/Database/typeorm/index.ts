import "reflect-metadata";
import {} from "mysql2";
import { DataSource } from "typeorm";
import { Tag } from "./entity/Tag";
import { Asset } from "./entity/Asset";
import { AssetTag } from "./entity/AssetTags";

if (!process.env.DATABASE_URL) throw new Error("Missing env.DATABASE_URL.");

export const AppDataSource = new DataSource({
	type: "mysql",
	url: process.env.DATABASE_URL,
	entities: [Tag, Asset, AssetTag],
	synchronize: true,
	logging: false,
});

AppDataSource.initialize().then(() => console.log("DB Connected"));
