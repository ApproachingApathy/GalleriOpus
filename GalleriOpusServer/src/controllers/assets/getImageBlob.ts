export const getImageBlob = (url: URL) => {
    // console.log(url.pathname)
    return Bun.file(url.pathname)
}