import { join, resolve } from "path";
import { unlink as fsUnlink, readdir } from "node:fs"
import { StorageManager } from "../types/StorageManager";
import { promisify } from "node:util";
import { FileSize } from "./FileSize";
import { Dirent } from "fs";

const unlink = promisify(fsUnlink)

export class LocalDataManager implements StorageManager {
    private localAssetPath = resolve(process.env.ASSET_DOWNLOAD_PATH)

    private doesTargetAssignedDir(filePath: string): boolean {
        return resolve(filePath).startsWith(this.localAssetPath)
    }
    
    /** Throws if provided path is not in the application expected targets. */
    private checkValidWritePath(filePath: string): void {
        if (!this.doesTargetAssignedDir(filePath)) throw new Error("Provided path is not an acceptable target.")
    }
    
    private async getFolderStorage(folderPath: string): Promise<number> {
        const files = await new Promise<Dirent[]>((res, rej) => readdir(resolve(folderPath), { withFileTypes: true }, (err, files) => {
            if (err) return rej(err)
            res(files)
        }))

        let accumulator = 0
        for (const item of files) {
            if (item.isDirectory()) {
                accumulator = accumulator + await this.getFolderStorage(resolve(join(folderPath, item.name)))
                continue;
            }
            
            const file = Bun.file(resolve(join(folderPath, item.name)))
            console.log(item.name, file.size)
            accumulator =  accumulator + file.size
        } 

        return accumulator
    }
    
    save(fileName: string, data: Blob | TypedArray | ArrayBufferLike | string | BlobPart[] ): Promise<URL>
    save(fileName: string, data: Response): Promise<URL>
    // tslint:disable-next-line:unified-signatures
    async save(fileName: string, data: unknown) {
        const filePath = resolve(join(this.localAssetPath, fileName))
        await Bun.write(filePath, data as Response)
        return new URL(`file://${filePath}`)
    }


    async delete(fileUrl: string) {
        const url = new URL(fileUrl)
        const filePath = url.pathname

        this.checkValidWritePath(filePath)
        unlink(filePath)
    }

    async getSize(fileUrl: string) {
        const url =  new URL(fileUrl)
        const filePath = url.pathname

        this.checkValidWritePath(filePath)
        const file = Bun.file(filePath)
        return new FileSize(file.size)
    }

    async getFile (fileUrl: string) {
        const url = new URL(fileUrl)
        const filePath = url.pathname
        this.checkValidWritePath(filePath)
        const file = Bun.file(filePath)
        return file
    }


    async getTotalStored() {
        const size = await this.getFolderStorage(this.localAssetPath)

        return new FileSize(size)
    }
}

export const localDataManager = new LocalDataManager()