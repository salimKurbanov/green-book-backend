import Elysia, { t } from "elysia";
import Views from "./views";

const categories = new Elysia({prefix: '/api/categories'})
    .get('/all', () => Views.getCategories())
    .post('/create', ({body, headers, server, request}) => Views.createCategory(body, headers, server?.requestIP(request)?.address), {
        body: t.Object({
            name: t.String(),
            file: t.Files()
        })
    })
    .put('/update/:id', ({params, body, headers, server, request}) => Views.updateCategory(body, params.id, headers, server?.requestIP(request)?.address), {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.String(),
            image: t.String(), 
            file: t.Files()
        })
    })
    .delete('delte/:id', ({params, headers, server, request}) => Views.delete(headers, server?.requestIP(request)?.address, params.id), {
        params: t.Object({
            id: t.String()
        })
    })


export default categories;