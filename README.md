# Music Autocomplete

> Get autocomplete for music search with the power of Deno.

> HTML documentation here: https://musicautocomplete.deno.dev

## Usage :question:

> API URL: https://musicautocomplete.deno.dev/search?q=your+query

### Example responses

Response for query "queen" (formatted):

```json
{
    "error": false,
    "results": [
        "Bohemian Rhapsody",
        "Love Of My Life",
        "I Want To Break Free",
        "The Show Must Go On",
        "Too Much Love Will Kill You",
        "I Want To Break Free (Single Remix)",
        "I Want It All",
        "Don't Stop Me Now (...Revisited)",
        "Bohemian Rhapsody (Live Aid)",
        "Good Old-Fashioned Lover Boy"
    ]
}
```

Response for query with no result:

```json
{
    "error": false,
    "results": []
}
```

> **Warning**\
> All responses are JSON encoded.

### Response Types

```ts
type ApiResponse = {
    error: true;
    type: 'no-query' | 'invalid' | 'server-error';
    results: [];
} | {
    error: false;
    results: string[];
};
```

> **Warning**\
> You'll need to handle errors and results in your code to make sure there is no
> unexpected behavior.

## Why? :thinking:

There is no public API for easy music autocomplete without paying or being very
slow (ex. scraping), so I decided to get one from a results API instead of
autocomplete (more on next section)...

## How? :sunglasses:

I just created an API which uses the Piped results API (which in turn uses
Youtube Music scraping and it's very very fast) and extracted it to get only the
music titles, then send back only the useful things to client, to make as fast
as possible (also thanks to Deno Deploy)

## For what? :mag:

I personally need this to make music autocomplete for a music player project, so
it is for all this type of things.

## Contributing :pencil2:

We :heart: contributions!\
Feel free to open an
[issue](https://github.com/Bellisario/musicautocomplete/issues) or a
[pull request](https://github.com/Bellisario/musicautocomplete/pulls) but follow
[Contributing Guidelines](https://github.com/Bellisario/musicautocomplete/blob/main/CONTRIBUTING.md).

> **Tip:** if you don't know where to start, check out the
> [help wanted issues](https://github.com/Bellisario/musicautocomplete/labels/help%20wanted)!

## License

MIT License
[here](https://github.com/Bellisario/musicautocomplete/blob/main/LICENSE).
