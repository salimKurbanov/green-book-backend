import Elysia, { t } from "elysia";
import Views from "./views";

const users = new Elysia({prefix: '/api/users'})
    .post('/init', ({server, request, headers}) => Views.init(headers, server?.requestIP(request)?.address))
    .post('/signin', ({server, request, body}) => Views.signIn(body, server?.requestIP(request)?.address), {
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