import { FileBlob } from "bun"

export type Bytes = number
export type KibiBytes = number
export type MibiBytes = number
export type GibiBytes = number

export interface FileSize {
    getBytes(): Bytes,
    toKiB(): KibiBytes,
    toMiB(): MibiBytes,
    toGiB(): GibiBytes
}

export interface StorageManager {
    createFileUrl: (fileName: string) => URL
    save(fileName: string, data: Blob | TypedArray | ArrayBufferLike | string | BlobPart[] | Response): Promise<URL>
    delete: (fileUrl: string) => Promise<void>
    getFile: (fileUrl: string) => Promise<FileBlob>
    doesFileExist: (fileUrl: string) => Promise<boolean>
    getContainingFolderPath: (fileUrl: string) => Promise<string>
    getSize: (fileUrl: string) => Promise<FileSize>
    getTotalStored: () => Promise<FileSize>
}