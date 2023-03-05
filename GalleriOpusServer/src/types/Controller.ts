import type { Elysia } from "elysia";

export type Controller = (app: Elysia) => Elysia;
