import utils from "./utils.js";

const jwt: any = {}

jwt.create = (user: any, ip: any) => {
    
    const data = {
        user_id: user.userid,
        role: user.role,
        ip: ip
    }

    return utils.AES.encrypt(JSON.stringify(data), utils.token).toString()
}

jwt.checkTokenAdmin = (headers: any, ip: any) => {

    let token = utils.getToken(headers)

    if(token.ip !== ip) {
        return  {success: false, status: 401, message: 'Токен не действителен'}
    }

    if(token.role !== 'admin') {
        return {success: false, message: 'Недостаточно прав', status: 401}
    }

    return {success: true, message: 'Доступ разрешен'}
}

export default jwt;