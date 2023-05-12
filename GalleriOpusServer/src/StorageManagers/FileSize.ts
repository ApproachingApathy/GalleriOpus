import { Bytes } from "../types/StorageManager"

export class FileSize implements FileSize  {
    constructor(size: Bytes) {
        this.bytes = size
    }

    private bytes: number


    getBytes() {
        return this.bytes
    }
    
    toKiB() {
        return this.bytes / 1024
    }

    toMiB() {
        return this.bytes / 1048576
    }

    toGiB() {
        return this.bytes / 1074000000
    }
}