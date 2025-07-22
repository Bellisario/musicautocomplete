// cspell:word nextpage

type ApiResponse = {
    error: true;
    type: 'no-query' | 'invalid' | 'server-error';
    results: [];
} | {
    error: false;
    results: string[];
};

interface SearchResponse {
    items: SearchResponseItem[];
    nextpage: string;
    suggestion: string;
    corrected: boolean;
}
interface SearchResponseItem {
    url: string;
    title: string;
    thumbnail: string;
    uploaderName: string;
    uploaderUrl: string;
    uploaderAvatar: null;
    uploadedDate: null;
    shortDescription: null;
    duration: number;
    views: number;
    uploaded: number;
    uploaderVerified: boolean;
}

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
const DEFAULT_INSTANCE = Deno.env.get('DEFAULT_INSTANCE') ??
    'https://pipedapi.kavin.rocks';

async function getAutocomplete(
    query: string,
    instanceURL: string = DEFAULT_INSTANCE,
): Promise<string[]> {
    const res = await fetch(
        `${instanceURL}/search?q=${
            encodeURIComponent(query)
        }&filter=music_songs`,
    );
    const json: SearchResponse = await res.json();
    // prevent duplicate results
    const completions = new Set(json.items.map((item) => item.title));
    // return first 10 results
    return Array.from(completions).slice(0, 10);
}
// dynamic instances powered by uma
// https://github.com/n-ce/Uma
async function getDynamicInstances(): Promise<string[] | undefined> {
    const res = await fetch(
        'https://raw.githubusercontent.com/n-ce/Uma/main/dynamic_instances.json',
        GITHUB_TOKEN
            ? {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
            : {},
    );
    const json = await res.json() as { piped?: string[] };

    return json.piped;
}
async function dynamicInstancesCron() {
    let instances: string[] | undefined;
    try {
        instances = await getDynamicInstances();
    } catch (e) {
        console.log(`Failed to get dynamic instances\n${e}`);
        return;
    }
    if (!instances || instances.length === 0) return;

    const kv = await Deno.openKv();
    await kv.set(['dynamic_instances'], instances);
}

export {
    type ApiResponse,
    DEFAULT_INSTANCE,
    dynamicInstancesCron,
    getAutocomplete,
    getDynamicInstances,
};
