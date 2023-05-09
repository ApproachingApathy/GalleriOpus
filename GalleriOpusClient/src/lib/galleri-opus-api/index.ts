import { edenTreaty } from "@elysiajs/eden"
import { type App } from "../../../../GalleriOpusServer/src/index"

export const api = edenTreaty<App>("http://127.0.0.1:3000")
