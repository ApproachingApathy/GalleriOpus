export const formatTag = (tag: string): string  => {
    let formatted = tag.replace(/(?!)\W/, "_")

    return formatted
}