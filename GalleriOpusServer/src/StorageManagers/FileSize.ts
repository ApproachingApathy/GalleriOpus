import { Bytes } from "../types/StorageManager"
const BytesPerKibibyte = 1024
const BytesPerMibibyte = 1048576
const BytesPerGibibyte = 1074000000

export class FileSize implements FileSize  {
    constructor(size: Bytes) {
        this.bytes = size
    }

    private bytes: number


    getBytes() {
        return this.bytes
    }
    
    toKiB() {
        return this.bytes / BytesPerKibibyte
    }

    toMiB() {
        return this.bytes / BytesPerMibibyte
    }

    toGiB() {
        return this.bytes / BytesPerGibibyte
    }
}