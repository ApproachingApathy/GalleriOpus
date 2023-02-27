export interface IngestResult {
    filePath: string,
    tags: string[],
}

export interface IngestHandler {
    name: string,
    matchUrl: (url: string) => boolean,
    getUrlHooks: () => RegExp[],
    ingestFromUrl: (url: string, downloadPath: string) => Promise<IngestResult>
}