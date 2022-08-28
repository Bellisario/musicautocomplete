import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { type ApiResponse, getAutocomplete } from './api.ts';

const app = new Application();
const router = new Router();

// allow CORS requests
app.use(async (ctx, next) => {
    ctx.response.headers.set('Access-Control-Allow-Origin', '*');
    await next();
});

router.get('/search', async (ctx) => {
    // send json response
    ctx.response.type = 'application/json';
    // get query string
    const query = ctx.request.url.searchParams.get('q');

    // error if no query
    if (!query) {
        const res: ApiResponse = {
            error: true,
            type: 'no-query',
            results: [],
        };
        ctx.response.body = res;
        return;
    }

    let res: ApiResponse;
    try {
        // get autocomplete results
        res = {
            error: false,
            results: await getAutocomplete(query),
        };
    } catch {
        // send error response if server error
        res = {
            error: true,
            type: 'server-error',
            results: [],
        };
    }

    // send response
    ctx.response.body = res;
});

// Send static content
app.use(async (ctx, next) => {
    try {
        await ctx.send({
            root: `${Deno.cwd()}/public/`,
            index: 'index.html',
        });
    } catch {
        await next();
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

// 404 handler
app.use((ctx) => {
    ctx.response.status = 404;
    ctx.response.type = 'application/json';

    const res: ApiResponse = {
        error: true,
        type: 'invalid',
        results: [],
    };
    ctx.response.body = res;
});

console.log('App listening on port', 3000);
await app.listen({ port: 3000 });
