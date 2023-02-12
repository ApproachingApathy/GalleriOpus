type Exists<T= any> = Exclude<T, undefined | null>

export const exists = <T>(x: T): x is Exists<T> => {
    return x !== undefined && x !== null
} 