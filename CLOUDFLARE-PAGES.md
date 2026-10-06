# Native platform publish targets

Both platforms keep their existing Git integrations. Hexo generates the internal `public/` base with the existing `npm run build`; the shared publication converter creates isolated deploy copies without editing article sources or the base.

| Platform | Blog | Static assets | Build | Deploy directory |
| --- | --- | --- | --- | --- |
| Cloudflare Pages | https://zdd-blog.pages.dev | https://zdd-blogcdn.pages.dev | `npm run build:pages` | `public-pages/` |
| Vercel | https://zdd.vercel.app | https://cdn-fawn.vercel.app | `npm run build:vercel` | `public-vercel/` |

Upload only the selected deploy directory, never the repository root or internal `public/` base. Publication copies rewrite owned site/CDN origins in HTML, structured data, CSS, JS, RSS, sitemap, robots, search, article images, video sources and downloads. Paths, queries and fragments remain intact; unrelated third-party links are preserved. Binary files are copied byte-for-byte. Direct URLs targeting `zhangdd.tech` or any subdomain are rejected by publication checks.

## Build and verify locally

```sh
npm ci
npm ci --prefix themes/journal
npm test
npm run build:pages
npm run build:vercel
```

Each platform command runs the complete Hexo build, publication tests and checks for its deploy copy. Search-body fingerprints are recalculated after rewriting. The generated service worker receives a deterministic cache version based on its contents and both selected origins, so an address change invalidates old caches. The existing GitHub Actions Site checks workflow stays unchanged and continues validating the internal Hexo base.

## Optional origin overrides

Builders and checkers use the same configuration:

| Variable | Default when unset |
| --- | --- |
| `PAGES_SITE_URL` | `https://zdd-blog.pages.dev` |
| `PAGES_CDN_URL` | `https://zdd-blogcdn.pages.dev` |
| `VERCEL_SITE_URL` | `https://zdd.vercel.app` |
| `VERCEL_CDN_URL` | `https://cdn-fawn.vercel.app` |

Use absolute HTTPS origins with valid DNS names or IP addresses, without credentials, subpaths, queries or fragments. A trailing root slash is normalized away. Empty, malformed and legacy `zhangdd.tech` origins fail before existing deploy output is replaced; unset a variable to use its default. Errors identify the variable without echoing its value. Keep identical values for build and check commands. Pages variables do not affect Vercel, and Vercel variables do not affect Pages.

For example, in a POSIX shell:

```sh
PAGES_SITE_URL=https://preview.zdd-blog.pages.dev npm run build:pages
```

In PowerShell:

```powershell
$env:PAGES_SITE_URL = 'https://preview.zdd-blog.pages.dev'
npm run build:pages
```

These are code defaults and local examples. This change does not modify live project environment variables, custom-domain bindings or DNS. Any explicit live override using a legacy origin must be reviewed before deployment. The selected CDN must already serve the referenced files at their existing paths.

## Hosting configuration

Cloudflare blog project `zdd-blog` uses the repository root, production branch `main`, build command `npm ci && npm ci --prefix themes/journal && npm run build:pages`, output `public-pages`, `SKIP_DEPENDENCY_INSTALL=true` and `NODE_VERSION=24.19.0`. Its companion `zdd-blogcdn` project keeps `node tools/build-pages.mjs` and `pages-dist`.

The blog's `vercel.json` keeps its existing dependency installation and selects `npm run build:vercel` with output `public-vercel`. The CDN repository's `font/blog.css` uses `./blog.woff2`, which resolves within each platform's CDN. No deployment credentials or workflow changes are introduced.

Publication output excludes reports, hidden files, CNAME, source maps, Markdown/YAML inputs, dependency manifests and worker entrypoints. The converter retains its 20,000-file and 25 MiB asset guards. Pages uses only free static hosting, without Functions, Workers, R2 or paid bindings.

## Live verification and rollback

After an authorized deployment, verify both native blog domains and their corresponding native CDN: home, a post, About, search and body fetches, RSS, sitemap, robots, actual HTTP 404, offline/service-worker behavior, mobile layout, fonts/CORS, video Range and downloads. Inspect browser requests for legacy domains. Existing custom-domain bindings and DNS remain untouched; old deployments remain available for rollback.

MapTiler's existing frontend key and API URL remain unchanged. Its restrictions may prevent maps on the native platform domains. Do not rotate the key, widen restrictions or add wildcards as part of this change.

## References

- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
