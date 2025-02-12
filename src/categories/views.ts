import sql from "../db";
import jwt from "../jwt";
import upload from "../upload";

const Views: any = {}

Views.getCategories = async () => {
    try {

        let res = await sql`SELECT * FROM categories`

        return {success: true, status: 200, data: res}
        
    } catch (error: any) {
        return {success: false, message: error.message, status: 500}
    }  
}

Views.createCategory = async (body: any, headers: any, ip: string) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access 

        let image = crypto.randomUUID()
        await upload.image(image, body.file, 'categories')
        
        let res = await sql`INSERT INTO categories (name, image) VALUES (${body.name}, ${image}) RETURNING *`

        return {success: true, data: res[0], message: 'Категория успешно создана'}

    } catch (error: any) {
        return { success: false, message: error.message, status: 500 };
    }
}

Views.updateCategory = async (body: any, id: string, headers: any, ip: string) => {
    try {
        
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        if(body.file !== false) {
            upload.deleteImage(body.image, 'categories')
            body.image = crypto.randomUUID()
            await upload.image(body.image, body.file, 'categories')
        }

        let res = await sql`
            UPDATE categories SET
            name = ${body.name},
            image = ${body.image}
            WHERE categories_id = ${id}
            RETURNING *`
        
        return {success: true, data: res[0]}
        
    } catch (error: any) {
        return { success: false, message: error.message, status: 500 };
    }
}

Views.deleteCategory = async (headers: any, ip: string, id: string) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access
        
        let res: any = await sql`DELETE FROM categories WHERE categories_id = ${id} RETURNING *`
        upload.deleteImage(res.image, 'categories')
        
        return {success: true}
        
    } catch (error: any) {
        return { success: false, message: error.message, status: 500 };
    }
}

export default Views;