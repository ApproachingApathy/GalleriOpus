import { writable } from 'svelte/store'
import type { Asset } from '../../../../GalleriOpusServer/src/Database/typeorm/entity/Asset'

export const selection = writable<undefined | Asset | Asset[]>(null)