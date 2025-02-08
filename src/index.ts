import { Elysia } from "elysia";
import users from "./users/urls";
import cors from "@elysiajs/cors";
import upload from "./upload";

const app = new Elysia()
  .use(cors({
    origin: '*'
  }))
  .use(users)
  .post('/update/build/backend', ({body}) => {
      try {
          upload.build(body)
          return 'success'
      } catch(e) {
          console.log(e)
          return 'error'
      }
  }) 
  .listen(4000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);