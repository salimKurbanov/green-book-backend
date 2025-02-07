import { Elysia } from "elysia";
import users from "./users/urls";
import cors from "@elysiajs/cors";
import { ip } from "elysia-ip";

const app = new Elysia()
  .use(cors({
    origin: '*'
  }))
  .use(ip())
  .use(users)
  .listen(4000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);