export const getImageBlob = (url: URL) => {
    return Bun.file(url.pathname)
}