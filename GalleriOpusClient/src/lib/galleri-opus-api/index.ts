import { edenFetch, edenTreaty } from "@elysiajs/eden"
import { type App } from "../../../../GalleriOpusServer/src/index"

export const api = edenTreaty<App>("http://127.0.0.1:3000")
export const fetchAPI = edenFetch<App>("http://127.0.0.1:3000")
