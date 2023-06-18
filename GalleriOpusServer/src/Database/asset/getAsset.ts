import { db } from "../db";

export const getAsset = async (id: number) => {
    return db.asset.findUnique({ where: { id }, include: {
        tags: {
            include: {
                tag: true
            }
        }
    }})
}