import sql from "../db"
import jwt from "../jwt"
import utils from "../utils"

const Views: any = {}

Views.init = async (headers: any, ip: any) => {
    try {

        let user = utils.getToken(headers)

        if(user.ip !== ip || !user) {
            return {success: false, status: 401, message: 'Токен не действителен'}
        }

        let res = await sql`SELECT * FROM users WHERE userid = ${user.user_id}`

        res = res

        if(!res) {
            return {success: false, status: 401}
        }

        return {success: true, status: 200, data: res}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createUser = async (body: any) => {
    try {
        let password = new Bun.CryptoHasher("sha256").update(body.password).digest("hex");
        
        let res = await sql`INSERT INTO users (login, password) VALUES (${body.login}, ${password}) RETURNING *`

        return {success: true, status: 200, data: res}

    } catch(e: any) {
        return {success: false, error: e, status: 400}
    }
}

Views.signIn = async (user: any, ip: any) => {
    try {

        let res: any = await sql`SELECT * FROM users WHERE login = ${user.login}`

        if(!res) {
            return {success: false, status: 400, message: 'Неверный логин или пароль'}
        }

        if(!res.active) {
            return {success: false, status: 400, message: 'Ваш аккаунт не активирован'}
        }

        if(res.ban) {
            return {success: false, status: 400, message: 'Ваш аккаунт заблокирован'}
        }

        let password = new Bun.CryptoHasher("sha256").update(user.password).digest("hex")
        if(res.password !== password) {
            return {success: false, status: 400, message: 'Неверный логин или пароль'}
        }

        const accessToken = jwt.create(res, ip)

        return {success: true, accessToken: accessToken, status: 200}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.signInAdmin = async (user: any, ip: any) => {
    try {

        let res: any = await sql`SELECT * FROM users WHERE login = ${user.login}`
        res = res

        if(!res) {
            return {success: false, status: 400, message: 'Неверный логин или пароль'}
        }

        if(!res.active) {
            return {success: false, status: 400, message: 'Ваш аккаунт не активирован'}
        }

        if(res.ban) {
            return {success: false, status: 400, message: 'Ваш аккаунт заблокирован'}
        }

        if(res.role !== 'admin') {
            return {success: false, status: 400, message: 'Доступ запрещён'}
        }

        let password = new Bun.CryptoHasher("sha256").update(user.password).digest("hex")
        if(res.password !== password) {
            return {success: false, status: 400, message: 'Неверный логин или пароль'}
        }

        const accessToken = jwt.create(res, ip)

        return {success: true, accessToken: accessToken, status: 200}

    } catch(e: any) {
        return {success: false, message: e.message, status: 500}
    }
}

export default Views;