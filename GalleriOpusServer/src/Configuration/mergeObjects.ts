const isObject = (item: any) => {
    return item && typeof item === 'object' && !Array.isArray(item)
}

export const mergeObjects = (target: any,  ...sources: any[]): any => {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if(!target[key]) {
                    Object.assign(target, { [key]: {}})
                }
                mergeObjects(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return mergeObjects(target, ...sources)

}

