import Elysia, { t } from "elysia";
import Views from "./views";

const recipes = new Elysia({prefix: '/api/recipes'})
    .get('/all', ({query}) => Views.allRecipes(query))
    .get('/random', () => Views.getRandomRecipes())
    .post('/create', ({body}) => Views.createRecipe(body), {
        body: t.Object({
            recipes: t.Object({
                title: t.String(),
                time: t.String(),
                file: t.Files(),
                portions: t.String(),
                category: t.String()
            }), 
            ingredients: t.Array(t.Object({
                item: t.String(),
                value: t.String()
            })),
            steps: t.Array(t.Object({
                step: t.String(),
                file: t.Files(),
                description: t.String()
            }))
        })
    })
    .put('/update/:id', ({body, params, headers, server, request}) => Views.updateRecipe(params.id, body, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.Number()
        }), 
        body: t.Object({
            recipes: t.Object({
                title: t.String(),
                time: t.String(),
                image: t.String(),
                portions: t.String(),
                category: t.String(),
                file: t.Files()
            }), 
            ingredients: t.Array(t.Object({
                item: t.String(),
                value: t.String()
            })),
            steps: t.Array(t.Object({
                step: t.String(),
                image: t.String(),
                description: t.String(),
                file: t.Files()
            }))
        })
    })
    .put('/update/ingredient/:id', ({body, params, headers, server, request}) => Views.updateIngredients(params.id, body, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.Number()
        }), 
        body: t.Object({
            item: t.String(),
            value: t.String()
        })
    })
    .put('/update/step/:id', ({body, params, headers, server, request}) => Views.updateSteps(params.id, body, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.Number()
        }), 
        body: t.Object({
            step: t.String(),
            image: t.String(),
            description: t.String(),
            file: t.Files()
        })
    })
    .delete('/delete/:id', ({params, headers, server, request}) => Views.deleteRecipe(params.id, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.Number()
        })
    })
    .delete('/delete/ingredient/:id', ({params, headers, server, request}) => Views.deleteIngredient(params.id, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.Number()
        })
    })
    .delete('/delete/step/:id', ({params, headers, server, request}) => Views.deleteStep(params.id, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.Number()
        })
    })


export default recipes;