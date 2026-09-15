# Website Of Babel

Open-source universal research, media, knowledge, graph, tools, games, Library of Babel, Pi, Numbers, cultures, occult/cultivation/influence archives, and a built-in Babel Browser.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Framework preset: **Other**.
4. Install command: `npm install`.
5. Build command: `npm run build`.
6. Output directory: `public`.

The project uses one Vercel function (`api/babel.js`) so it stays within the Hobby function-count limit.

## Scramjet Browser

The Browser uses Scramjet **2.0.67-alpha.2**, not the deprecated 1.x/BareMux stack. Build-time assets are copied into `public/` from:

- `@mercuryworkshop/scramjet`
- `@mercuryworkshop/scramjet-controller`
- `@mercuryworkshop/scramjet-utils`
- `@mercuryworkshop/libcurl-transport`

Set an optional relay override in Vercel:

```env
SCRAMJET_WISP_URL=wss://your-wisp-relay.example/wisp/
```

Vercel serverless cannot host a persistent Wisp WebSocket itself, so Scramjet uses the configured external Wisp relay. Babel Reader remains available when a proxy site or relay is unavailable.

## Development

```bash
npm install
npm run build
npm run check
```

The Browser automatically removes the old v1 `scramjet-sw.js` registration when upgrading from earlier Website Of Babel releases.

## Deep website discovery

Searching a domain such as `hitboyxx23.dev` now crawls the public site root, reads sitemap files when available, follows internal links to a bounded depth, and exposes discovered pages in Search and Network of Babel. Network expansion preserves page-to-page edges instead of flattening every URL into one host node.
