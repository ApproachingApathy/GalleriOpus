import { join, resolve, dirname } from "path";
import { unlink, readdir, mkdir, access } from "node:fs/promises"
import { StorageManager } from "../types/StorageManager";
import { promisify } from "node:util";
import { FileSize } from "./FileSize";
import { Dirent, accessSync, fstat, mkdirSync } from "fs";
import { appConfig } from "../Configuration/Configuration";

// const unlink = promisify(fsUnlink)

export class LocalDataManager implements StorageManager {
    private localAssetPath: string

    constructor(localAssetPath: string) {
        this.localAssetPath = resolve(localAssetPath)
        this.createLocalAssetPathDirectorIfNotExists()
    }

    private doesTargetAssignedDir(filePath: string): boolean {
        return resolve(filePath).startsWith(this.localAssetPath)
    }
    
    /** Throws if provided path is not in the application expected targets. */
    private checkValidWritePath(filePath: string): void {
        if (!this.doesTargetAssignedDir(filePath)) throw new Error("Provided path is not an acceptable target.")
    }
    
    private async getFolderStorage(folderPath: string): Promise<number> {
        const files = await readdir(resolve(folderPath), { withFileTypes: true })

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

    private async createLocalAssetPathDirectorIfNotExists() {
        try {
            accessSync(this.localAssetPath)
        } catch {
            mkdirSync(this.localAssetPath)
        }
    }

    //TODO: sanitize file name
    createFileUrl(fileName: string) {
        const filePath = resolve(join(this.localAssetPath, fileName))
        return new URL(`file://${filePath}`)
    };
    
    save(fileName: string, data: Blob | TypedArray | ArrayBufferLike | string | BlobPart[] ): Promise<URL>
    save(fileName: string, data: Response): Promise<URL>
    // tslint:disable-next-line:unified-signatures
    async save(fileName: string, data: unknown) {
        const fileUrl = this.createFileUrl(fileName)
        const directory = dirname(fileUrl.pathname)
        try {
            await access(directory)
        } catch(e) {
            await mkdir(directory, { recursive: true })
        }

        await Bun.write(fileUrl.pathname, data as Response)
        return fileUrl
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

    async doesFileExist(fileUrl: string) {
        const url = new URL(fileUrl)
        this.checkValidWritePath(url.pathname)

        try {
            await access(url.pathname)
            return true
        } catch {}
        
        return false;
    };

    async getContainingFolderPath(fileUrl: string) {
        const url = new URL(fileUrl)
        const filePath = url.pathname
        const folderPath = dirname(filePath)
        this.checkValidWritePath(folderPath)
        return folderPath
    }

    async getRelativeContainingFolderPath(fileUrl: string) {
        const fullPath = await this.getContainingFolderPath(fileUrl)
        let slicedPath = fullPath.replace(this.localAssetPath, "")
        if (slicedPath.startsWith("/")) slicedPath = slicedPath.slice(1)
        return slicedPath
    };

    async getTotalStored() {
        const size = await this.getFolderStorage(this.localAssetPath)

        return new FileSize(size)
    }
}

export const localStorageManager = new LocalDataManager(await appConfig.storage.local.library_directory)