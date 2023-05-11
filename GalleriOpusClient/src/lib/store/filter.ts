import { writable } from "svelte/store"

interface Filter {
    tags: string[]
}

export const filter = writable<Filter>({
    tags: []
})