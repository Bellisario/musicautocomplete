import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import {
    type ApiResponse,
    dynamicInstancesCron,
    getAutocomplete,
} from './api.ts';

const app = new Application();
const router = new Router();
const kv = await Deno.openKv();

// instance list update cron job
Deno.cron('update instances', '*/10 * * * *', dynamicInstancesCron);
if (!Deno.env.has('DYNAMIC_INSTANCES_DISABLED')) {
    await dynamicInstancesCron();
}

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
    let response: ApiResponse;

    // error if no query
    if (!query) {
        response = {
            error: true,
            type: 'no-query',
            results: [],
        };
        ctx.response.body = response;
        return;
    }

    try {
        let results: string[];
        if (Deno.env.has('DYNAMIC_INSTANCES_DISABLED')) {
            results = await getAutocomplete(query);
        } else {
            const instances =
                (await kv.get<string[]>(['dynamic_instances'])).value;
            // fallback to default instance
            if (!instances || instances.length === 0) {
                results = await getAutocomplete(query);
            } else {
                results = await Promise.any(
                    instances.map((instance) =>
                        getAutocomplete(query, instance)
                    ),
                );
            }
        }

        // get autocomplete results
        response = {
            error: false,
            results,
        };
    } catch {
        // send error response if server error
        response = {
            error: true,
            type: 'server-error',
            results: [],
        };
    }

    // send response
    ctx.response.body = response;
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
