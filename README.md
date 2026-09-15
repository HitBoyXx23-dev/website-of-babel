# Website Of Babel

Website Of Babel is an open-source universal search and exploration site for GitHub and Vercel.

It includes universal search, research dossiers, Network of Babel, Babel Reader, public web and username search, images/audio/video/files, programming and recipe knowledge, countries and languages, Library of Babel, Pi of Babel, Numbers of Babel, Futures, calculator/tools, Browser, games, and private local notes.

## Deploy to Vercel

1. Put the contents of this folder at the root of your GitHub repository.
2. Import the repository into Vercel.
3. Deploy with the default Node settings.

No frontend build command is required.

### Vercel Hobby compatible

All public API routes are dispatched through **one** Vercel Serverless Function: `api/babel.js`.

Routes such as `/api/research`, `/api/dossier`, `/api/websearch`, `/api/reader`, and the rest still work through `vercel.json` rewrites, but they no longer count as separate Serverless Functions. This keeps the project below the Hobby-plan function limit.

## Optional environment variables

```env
BRAVE_SEARCH_API_KEY=
GITHUB_TOKEN=
SCRAMJET_BROWSER_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

`SCRAMJET_BROWSER_URL` can point to a separately deployed Scramjet-compatible browser endpoint. Without it, Babel Browser uses the built-in Reader mode.

## Verify

```bash
npm run check
```

The project is MIT licensed. See `CONTRIBUTING.md` for contribution notes.
