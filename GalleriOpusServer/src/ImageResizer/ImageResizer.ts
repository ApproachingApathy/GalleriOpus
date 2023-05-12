import { nanoid } from "nanoid"
import { LocalDataManager } from "../DataManagers/LocalStorageManager"
import { StorageManager } from "../types/StorageManager"


class ImageResizer {
    private thumbnailTargetWidth = 200
    private thumbnailTargetQuality = 75
    private thumbnailUseLosslessCompression = false
    private thumbnailCompressionLevel = 6
    private thumbnailWebpPartitions = 3
    private thumbnailWebpImageHint: "photo" | "picture" | "lineart" = "picture"

    private localStorage = new LocalDataManager(process.env.ASSET_TEMP_PATH)

    private readonly queue: string[];
    private readonly maxConcurrency = 5
    private activeCount: number

    constructor() {
        this.queue = []
        this.activeCount = 0
    }
    
    /** Spawns an imagemagick instance to resize a thumbnail image.
     * 
    */
    async createThumbnail(filePath: string, onComplete: (thumbnailUrl: URL, storageManager: StorageManager) => void) {
        this.queue.push(filePath);
        while (this.queue.length > 0) {
            if (this.activeCount < this.maxConcurrency) {
                const nextInQueue = this.queue.shift()
                this.activeCount = this.activeCount + 1
                const outputUrl = new URL("file://" + this.localStorage.createFilePath(`${nanoid()}.webp`))
                try {
                    await this.resizeImage(filePath, outputUrl.pathname)
                    onComplete(outputUrl, this.localStorage)
                } catch (e) {
                    this.logError((e as Error).message)
                } finally {
                    this.activeCount = this.activeCount - 1
                }

                return;
            }

            // Wait 0.1 seconds
            await new Promise(resolve => setTimeout(resolve, 100))
        } 
    }
    
    private async resizeImage(filePath: string, outputPath: string) {
        const subprocess = Bun.spawn([
            "magick", filePath,
            "-resize", `${this.thumbnailTargetWidth}`,
            "-auto-orient",
            "-quality", `${this.thumbnailTargetQuality}`,
            "-define", `webp:lossless=${this.thumbnailUseLosslessCompression}`,
            "-define", `webp:method=${this.thumbnailCompressionLevel}`,
            "-define", `webp:image-hint=${this.thumbnailWebpImageHint}`,
            "-define", `webp:partitions=${this.thumbnailWebpPartitions}`,
            `${outputPath}`
        ])

        const result = await subprocess.exited

        if (result > 0) throw new Error(`Failed to resize ${filePath}`)
    }

    private logError(error: string) {
        console.error(error)
    }
}

export const imageResizer = new ImageResizer()