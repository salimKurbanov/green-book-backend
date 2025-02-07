import Elysia, { t } from "elysia";
import Views from "./views";

const users = new Elysia({prefix: '/api/users'})
    .post('/init', ({ip, headers}) => Views.init(headers, ip))
    .post('/signin', ({ip, body}) => Views.signIn(body, ip), {
        body: t.Object({
            login: t.String(),
            password: t.String()
        }),
    })
    .post('/signin/admin-panel', ({body, server, request}) => Views.signInAdmin(body, server?.requestIP(request)?.address), {
        body: t.Object({
            login: t.String(),
            password: t.String()
        })
    })
    .post('/create', ({body}) => Views.createUser(body), {
        body: t.Object({
            login: t.String(),
            password: t.String()
        })
    })

export default users