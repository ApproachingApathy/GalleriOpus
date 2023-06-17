import { parse } from "toml"
import { accessSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { join, resolve } from "node:path"
import { platform } from "node:os"
import { mergeObjects } from "./mergeObjects"

const CONFIG_FILE_NAME = "galleri-opus.toml"
const SUB_FOLDER = "galleri-opus"

export class ConfigManager {
    configDirectory: string;
    config: Record<string, any> = {};
    
    constructor() {
        const configDirectory = this.getConfigDirectory()
        if (!configDirectory) throw new Error("Configuration Error: No config folder defined.")
        if (!this.isDirectoryAccessible(configDirectory)) {
            this.createConfigDirectory()
        }
        this.configDirectory = configDirectory
    }
    
    get configFile() {
        return join(this.configDirectory, CONFIG_FILE_NAME)
    }
    
    async init() {
        const config = await this.createOrLoadConfig()
        this.config = {...config}
    }

    private getConfigDirectory(): string | undefined {
        return process.env.CONFIG_DIRECTORY ? resolve(process.env.CONFIG_DIRECTORY) : undefined
    }

    private async createConfigDirectory() {
        await mkdir(this.configDirectory)
    }

    /** Check that configuration directory is accessible, throws if directory is inaccessible.  */
    private isDirectoryAccessible(dir: string) {
        try {
            accessSync(dir)
            return true
        } catch (e) {
            return false
        }
    }

    private doesFileExist(path: string) {
        try {
            accessSync(path)
            return true
        } catch {}
        return false
    }

    private async createConfigFile() {
        await Bun.write(this.configFile, "")
    }

    private async loadConfig(): Promise<Record<string, any>> {
        const configFile = Bun.file(this.configFile)
        let config = {}
        try {
            let config = {...parse(await configFile.text())}
        } catch (e: any) {
            console.error("Error parsing config at line: " + e.line + ", column " + e.column + ": " + e.message);
        }

        return config
    }

    private async createOrLoadConfig() {
        if (!this.doesFileExist(this.configFile)) {
            await this.createConfigFile()
        }

        const config = await this.loadConfig()
        return config
    }

    private async getDefaultConfig() {
        let config = {}

        switch (platform()) {
            case "linux":
                mergeObjects(config, {
                    temporary_directory: process.env.TMPDIR ? resolve(join(process.env.TMPDIR, SUB_FOLDER)) : resolve(join("/tmp", SUB_FOLDER)),
                    storage: {
                        local: {
                            library_directory: process.env.XDG_DATA_HOME ? resolve(join(process.env.XDG_DATA_HOME, SUB_FOLDER)) : resolve(join(process.env.HOME, ".local/share", SUB_FOLDER))
                        }
                    }
                })
            default:
                break;
        }

        return config
    }
}