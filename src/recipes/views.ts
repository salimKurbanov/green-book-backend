import sql from "../db"
import jwt from "../jwt"
import upload from "../upload"
import recipes from "./urls";

const Views: any = {}

Views.allRecipes = async (query: any) => {
    try {
        let filter = query.filter;
        let page = query.page ? Number(query.page) : 1;
        let limit = query.limit ? Number(query.limit) : 8;
        let offset = (page - 1) * limit;

        let baseQuery = sql`
            SELECT * FROM recipes
        `;
        // let baseQuery = sql`
        //     SELECT * FROM recipes
        //     JOIN ingredients ON recipes.recipes_id = ingredients.recipe_id
        //     JOIN steps ON recipes.recipes_id = steps.recipe_id
        // `;


        if (filter && filter !== 'all') {
            baseQuery = sql`${baseQuery} WHERE recipes.category = ${filter}`;
        }

        baseQuery = sql`${baseQuery} ORDER BY datetime DESC LIMIT ${limit} OFFSET ${offset}`;

        let res = await baseQuery;

        return { success: true, status: 200, data: {recipes: res, length: 20} };
    } catch (e: any) {
        return { success: false, message: e.message, status: 500 };
    }
};


Views.getRandomRecipes = async () => {
    try {

        let res = await sql`SELECT * FROM recipes JOIN ingredients ON recipes.recipes_id = ingredients.recipe_id JOIN steps ON recipes.recipes_id = steps.recipe_id ORDER BY RANDOM() LIMIT 5`
        
        return {success: true, status: 200, data: res}
    } catch (e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createRecipe = async (body: any) => {
    try {

        let recipes: any = body.recipes
        let ingredients: any = body.ingredients
        let steps: any = body.steps

        //Create recipes
        let recipesImage = crypto.randomUUID()
        await upload.image(recipesImage, recipes.file, 'recipes')

        let newRecipes = await sql`INSERT INTO recipes (title, time, image, portions, category) VALUES (${recipes.title}, ${recipes.time}, ${recipesImage}, ${recipes.portions}, ${recipes.category}) RETURNING *`
        
        //Create ingredients
        if(ingredients?.length > 0) {

            ingredients.forEach(async (element: any) => {
                await sql`INSERT INTO ingredients (item, value, recipe_id) VALUES (${element.item}, ${element.value}, ${newRecipes[0].recipes_id})`
            })

        }

        //Create steps
        if(steps?.length > 0) {

            steps.forEach(async (element: any) => {
                let image = crypto.randomUUID()
                await upload.image(image, element.file, 'steps')
                await sql`INSERT INTO steps (step, image, description, recipe_id) VALUES (${element.step}, ${image}, ${element.description}, ${newRecipes[0].recipes_id})`
            })

        }

        return {success: true, status: 200, data: newRecipes, message: 'Рецепт успешно создан'}


    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateRecipe = async (id: any, body: any, headers: any, ip: any) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access    

        let recipes: any = body.recipes
        let ingredients: any = body.ingredients
        let steps: any = body.steps

        //Update recipes
        if(recipes.file !== false) {
            upload.deleteImage(recipes.image, 'recipes')
            recipes.image = crypto.randomUUID()
            await upload.image(recipes.image, recipes.file, 'recipes')
        }

        let res = await sql`
        UPDATE recipes SET 
            title = ${recipes.title}, 
            time = ${recipes.time}, 
            image = ${recipes.image}, 
            portions = ${recipes.portions},
            category = ${recipes.category}
            WHERE recipes_id = ${id}
            RETURNING *`

        //Update ingredients
        if(ingredients?.length > 0) {

            ingredients.forEach(async (element: any) => {
                Views.updateIngredients(element.ingredients_id, element, headers, ip)
            })
        }

        //Update steps
        if(steps?.length > 0) {            

            steps.forEach(async (element: any) => {
                Views.updateSteps(element.steps_id, element, headers, ip)
            })
        }

        return {success: true, status: 200, data: res, message: 'Рецепт успешно обновлен'}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateIngredients = async (id: any, body: any, headers: any, ip: any) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access    

        let res = await sql`
            UPDATE ingredients SET 
            item = ${body.item}, 
            value = ${body.value} 
            WHERE ingredients_id = ${id} 
            RETURNING *`

        return {success: true, status: 200, data: res, message: 'Ингредиент успешно обновлен'}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateSteps = async (id: any, body: any, headers: any, ip: any) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        if(body.file !== false) {
            upload.deleteImage(body.image, 'steps')
            body.image = crypto.randomUUID()
            await upload.image(body.image, body.file, 'steps')
        }

        let res = await sql`
            UPDATE steps SET 
            step = ${body.step}, 
            image = ${body.image}
            description = ${body.description},
            WHERE steps_id = ${id} 
            RETURNING *`

        return {success: true, status: 200, data: res, message: 'Шаг успешно обновлен'}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteRecipe = async (id: any, headers: any, ip: any) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let res: any = await sql`DELETE FROM recipes WHERE recipes_id = ${id} RETURNING *`
        upload.deleteImage(res.image, 'recipes')

        return {success: true, status: 200, data: res, message: 'Рецепт успешно удален'}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteIngredient = async (id: any, headers: any, ip: any) => {
    try {        

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let res = await sql`DELETE FROM ingredients WHERE ingredients_id = ${id} RETURNING *`

        return {success: true, status: 200, data: res, message: 'Ингредиент успешно удален'}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteStep = async (id: any, headers: any, ip: any) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let res: any = await sql`DELETE FROM steps WHERE steps_id = ${id} RETURNING *`
        upload.deleteImage(res.image, 'steps')

        return {success: true, status: 200, data: res, message: 'Шаг успешно удален'}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

export default Views;