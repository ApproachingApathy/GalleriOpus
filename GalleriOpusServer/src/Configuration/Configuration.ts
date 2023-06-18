import { accessSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { join, resolve } from "node:path"
import { platform } from "node:os"
import { mergeObjects } from "./mergeObjects"

const CONFIG_FILE_NAME = "galleri-opus.toml"
const SUB_FOLDER = "galleri-opus"

export interface AppConfiguration {
    temporary_directory: string,
    storage: {
        local: {
            library_directory: string   
        }
    }
}

export class Configuration {
    config_file: string;
    temporary_directory: string;
    storage: {
        local: {
            library_directory: string
        }
    };

    constructor(config: AppConfiguration, configFile: string) {
        this.config_file = configFile
        this.temporary_directory = config.temporary_directory
        this.storage = {
            local: {
                library_directory: config.storage.local.library_directory
            }
        }
    }

    static async fromDirectory(configDirectoryPath: string) {
        try {
            this.accessPath(configDirectoryPath)
        } catch {
            this.createDirectory(configDirectoryPath)
        }

        const configFilePath = join(resolve(configDirectoryPath), CONFIG_FILE_NAME)
        try {
            this.accessPath(configFilePath)
        } catch {
            this.writeFile(configFilePath, "")
        }

        const configFileData = (await import(configFilePath)).default

        const defaultPlatformConfig = this.getPlatformConfig()

        const mergedConfig: AppConfiguration = mergeObjects(defaultPlatformConfig, configFileData)

        return new this(mergedConfig, configFilePath)
        
    }

    private static accessPath(directoryPath: string) {
        accessSync(resolve(directoryPath))
    }

    private static async createDirectory(directoryPath: string) {
        await mkdir(resolve(directoryPath))
    }

    private static async writeFile(filePath: string, data: string) {
        await Bun.write(filePath, data)
    }

    private static getPlatformConfig(): Partial<AppConfiguration> {
        let config = {}

        switch (platform()) {
            case "linux":
                config = {
                    temporary_directory: process.env.TMPDIR ? resolve(process.env.TMPDIR, SUB_FOLDER) : resolve(join("/tmp", SUB_FOLDER)),
                    storage: {
                        local: {
                            library_directory: process.env.XDG_DATA_HOME ? resolve(join(process.env.XDG_DATA_HOME, SUB_FOLDER)) : resolve(join(process.env.HOME, ".local/share", SUB_FOLDER))
                        }
                    }
                }
                break;
            default:
                break;
        }

        return config
    }

    private static async readFile(filePath: string) {
        return Bun.file(filePath)
    }
}

export const appConfig = await Configuration.fromDirectory(process.env.CONFIG_DIRECTORY) 