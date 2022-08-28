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

async function getAutocomplete(query: string): Promise<string[]> {
    const res = await fetch(
        `https://pipedapi.kavin.rocks/search?q=${
            encodeURIComponent(query)
        }&filter=music_songs`,
    );
    const json: SearchResponse = await res.json();
    // prevent duplicate results
    const completions = new Set(json.items.map((item) => item.title));
    // return first 10 results
    return Array.from(completions).slice(0, 10);
}

export { type ApiResponse, getAutocomplete };
