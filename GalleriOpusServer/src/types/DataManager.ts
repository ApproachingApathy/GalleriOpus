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

export interface DataManager {
    save(fileName: string, data: Blob | TypedArray | ArrayBufferLike | string | BlobPart[] | Response): Promise<URL>
    delete: (fileUrl: string) => Promise<void>,
    getFile: (fileUrl: string) => Promise<FileBlob>
    getSize: (fileUrl: string) => Promise<FileSize>
    getTotalStored: () => Promise<FileSize>
}