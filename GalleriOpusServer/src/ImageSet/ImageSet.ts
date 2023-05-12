import { localStorageManager } from "../StorageManagers/LocalStorageManager";

export class ImageSet {
    private storageManager = localStorageManager
    private fullSizeImageUrl: URL;

    constructor(fullSizeImageUrl: string) {
        this.fullSizeImageUrl =  new URL(fullSizeImageUrl)
    }

    private async getFullSizeUrl() {
        return this.fullSizeImageUrl
    }

    private async getThumbnailUrl() {
        const folderPath = await this.storageManager.getRelativeContainingFolderPath(this.fullSizeImageUrl.toString())
        const thumbnailUrl = this.storageManager.createFileUrl(`${folderPath}/thumbnail.webp`)
        return thumbnailUrl
    }

    async getThumbnailOrFallbackToFull() {
        const thumbnailUrl = await this.getThumbnailUrl()
        if (await this.storageManager.doesFileExist(thumbnailUrl.toString())) {
            return Bun.file(thumbnailUrl.pathname)
        }

        const fullSizeUrl = await this.getFullSizeUrl()
        return Bun.file(fullSizeUrl.pathname)
    }
}