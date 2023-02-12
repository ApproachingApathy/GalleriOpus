import { exists } from "../utils/exists"
import { join } from "path"
import * as fs from "node:fs"
import { nanoid } from "nanoid"

interface IngestResult {
    filePath: string,
    tags: string[],
}

interface IngestHandler {
    name: string,
    matchUrl: (url: string) => boolean,
    getUrlHooks: () => RegExp[],
    ingestFromUrl: (url: string, downloadPath: string) => Promise<IngestResult>
}

interface IngestManager {
    initialize: () => void,
    _ingestHandlers: { [x: string]: IngestHandler},
    _urlHooks: [RegExp, string][],
    registerHandler: (handler: IngestHandler) => void,
    ingest: (url: string) => Promise<IngestResult>
}

export const directDLIngestHandler: IngestHandler = {
    name: "OPUS_DirectDL",
    getUrlHooks() {
    return [/.*/]
    },
    matchUrl(url) {
        return true
    },
    async ingestFromUrl(url, downloadPath) {
        const response = await fetch(url)
        const contentType = response.headers.get("content-type")
        const matches: [string, string] | undefined = contentType?.matchAll(/image\/(.*)/g).next().value
        // console.log(contentType, Array.from(matches ?? []))
        // console.log(matches?.next().value, matches?.next().value)
        if (exists(matches) && matches.length > 0) {
            const downloadPathWithExtension = `${downloadPath}.${matches[1]}` 
            await Bun.write(downloadPathWithExtension, response)

            return {
                filePath: downloadPathWithExtension,
                tags: [`url:${url}`]
            }
        }
        throw new Error(`Failed to download from ${url}`)
    },
}



export const ingestManager: IngestManager =  {
    initialize: () => {
        console.log("q")
        ingestManager.registerHandler(directDLIngestHandler)
    },

    _ingestHandlers: {

    },

    _urlHooks: [],

    registerHandler: (handler: IngestHandler) => {
        const existingIngestHandlerAtName = ingestManager._ingestHandlers[handler.name]
        console.log(existingIngestHandlerAtName)

        if (exists(existingIngestHandlerAtName)) {
            throw new Error(`Ingestor ${handler.name} already exists.`)            
        }

        const hooks: [RegExp, string][] = handler.getUrlHooks().map((matcher) => [matcher, handler.name])
        
        ingestManager._ingestHandlers[handler.name] = handler,
        ingestManager._urlHooks.push(...hooks)
    },

    ingest: async (url: string) => {
        const urlHook = ingestManager._urlHooks.find(([matcher, handlerName]) => exists(url.match(matcher)))

        if (!exists(urlHook)) {
            throw new Error(`No Matching Ingest Handler for ${url}.`)
        } 

        const ingestHandler = ingestManager._ingestHandlers[urlHook[1]]


        const result = await ingestHandler.ingestFromUrl(url, join(process.env.ASSET_DOWNLOAD_PATH, nanoid()));

        return result
    }


}