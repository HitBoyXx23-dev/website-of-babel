# Website Of Babel

Open-source universal research, media, knowledge, graph, tools, games, Library of Babel, Pi, Numbers, cultures, archives, and a built-in Babel Browser.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Framework preset: **Other**.
4. Install command: `npm install`.
5. Build command: `npm run build`.
6. Output directory: `public`.

The project uses one Vercel function (`api/babel.js`) so it stays within the Hobby function-count limit.

## Babel Browser

The Browser uses Scramjet **2.0.67-alpha.2** with the current controller/proxy-transport architecture.

On Vercel, the default transport is a same-deployment HTTP Bare transport:

```text
Scramjet 2 -> bare-transport -> /bare/ -> api/babel.js
```

That means ordinary proxied pages do not depend on a public third-party Wisp relay. Because Vercel Functions do not provide a durable target WebSocket tunnel, WebSocket-heavy target sites may not work through the default Bare transport.

For those sites, point Babel at your own Wisp backend:

```env
SCRAMJET_TRANSPORT=wisp
SCRAMJET_WISP_URL=wss://your-wisp-server.example/wisp/
```

Babel Reader remains available as a fallback when an interactive proxy page is incompatible.

The build copies browser assets from:

- `@mercuryworkshop/scramjet`
- `@mercuryworkshop/scramjet-controller`
- `@mercuryworkshop/scramjet-utils`
- `@mercuryworkshop/bare-transport`
- `@mercuryworkshop/libcurl-transport` (optional Wisp mode)

## Development

```bash
npm install
npm run build
npm run check
```

## Deep website discovery

Searching a domain such as `hitboyxx23.dev` crawls the public site root, reads sitemap files when available, follows internal links to a bounded depth, and exposes discovered pages in Search and Network of Babel. Network expansion preserves page-to-page edges instead of flattening every URL into one host node.
