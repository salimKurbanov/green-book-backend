import { Elysia } from "elysia";
import users from "./users/urls";
import cors from "@elysiajs/cors";
import upload from "./upload";
import recipes from "./recipes/urls";
import categories from "./categories/urls";


const app = new Elysia()
  .use(cors({
    origin: '*'
  }))
  .use(users)
  .use(recipes)
  .use(categories)
  .post('/update/build/backend', ({body}) => {
      try {
          upload.build(body)
          return 'success'
      } catch(e) {
          console.log(e)
          return 'error'
      }
  }) 
  .get('/images/:folder/:name', ({params: {folder, name}}) => upload.getImage(name, folder))
  .listen(4000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);