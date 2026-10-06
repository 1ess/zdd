# Independent Cloudflare Pages blog

This target serves `https://blog.zhangdd.tech` and uses the companion static asset project at `https://blogcdn.zhangdd.tech`.

The original `_config.yml`, Markdown content, `source/robots.txt`, `vercel.json`, and ordinary `npm run build` behavior are unchanged. Vercel can continue serving `zhangdd.tech` and `cdn.zhangdd.tech` as the rollback path.

## Build locally

```sh
npm ci
npm ci --prefix themes/journal
npm run build:pages
```

Upload only `public-pages/`. Never upload the repository root.

### Configurable Pages addresses

The Pages builder and checker share two optional environment variables:

| Variable | Default when unset |
| --- | --- |
| `PAGES_SITE_URL` | `https://blog.zhangdd.tech` |
| `PAGES_CDN_URL` | `https://blogcdn.zhangdd.tech` |

Set absolute HTTPS origins, without credentials, a subpath, query or fragment. An optional trailing root slash is normalized away. An empty value is an error; unset the variable to use its default. Invalid values fail before the builder replaces `public-pages/`. Keep the same values for building and checking the output.

For temporary Pages hostnames (POSIX shell):

```sh
PAGES_SITE_URL=https://zdd-blog.pages.dev PAGES_CDN_URL=https://zdd-blogcdn.pages.dev npm run build:pages
```

PowerShell:

```powershell
$env:PAGES_SITE_URL = 'https://zdd-blog.pages.dev'
$env:PAGES_CDN_URL = 'https://zdd-blogcdn.pages.dev'
npm run build:pages
```

These variables affect only the separate Pages output and its checks. They do not alter Vercel's `public/`, source configuration or article text. All paths, query strings and fragments are retained; third-party URLs are preserved. Search-body fingerprints are recalculated for the selected origins.

To use different addresses in Cloudflare, configure these variables for the intended production/preview environment in a separately authorized settings change. Changing build variables does not bind a hostname or modify DNS. The CDN target must already serve the referenced files. This code change does not update any live project variables or domains.

The command first runs the complete existing Hexo build and site checks. A separate output step copies generated files to `public-pages/`, rewrites the two owned URL origins, leaves third-party links alone, and validates the result. Canonicals, structured data, RSS, sitemap, robots, article images, video sources, and download URLs retain their paths. Search-body fingerprints are recalculated if their text changes. Binary assets are copied byte-for-byte.

The Pages output excludes local reports, hidden files, CNAME, source maps, Markdown/YAML inputs, dependency manifests and worker entrypoints. It rejects symbolic links and assets beyond Pages Free limits (20,000 files; 25 MiB per file). It contains no Pages Functions, Workers, paid bindings, or redirects from the original domains.

## Cloudflare Pages project settings

Create a separate **Pages** project from the blog repository. Use these settings only after deployment is authorized:

- Production branch: the approved migration branch; switch to `main` only after the changes are merged
- Root directory: repository root (leave blank)
- Framework preset: None
- Build command: `npm ci && npm ci --prefix themes/journal && npm run build:pages`
- Build output directory: `public-pages`
- Environment variable: `SKIP_DEPENDENCY_INSTALL=true` (the build command installs both dependency trees explicitly)
- Environment variable: `NODE_VERSION=24.19.0` (the runtime tested for this preparation; repository minimum remains Node 20.19)
- Custom domain: `blog.zhangdd.tech` only
- No Functions, Workers, paid storage, or paid plan changes required by this build

Keep the original Vercel project and existing apex/CDN DNS records. Add the new custom domain in Pages before configuring its new DNS record. The companion `blogcdn.zhangdd.tech` project must contain all referenced files at their original paths before the blog is made public.

Unless overridden, every Pages build targets the new custom domain, including preview builds. Canonicals, RSS, sitemap and robots follow `PAGES_SITE_URL`; media and fonts follow `PAGES_CDN_URL`.

## Verification

```sh
npm test
npm run build:pages
npm run report:media
npm run report:content
```

The existing GitHub Actions Site checks workflow is preserved byte-for-byte, including its push/pull_request triggers and build job. No Cloudflare steps or deployment credentials are added to that workflow. Pages validation runs inside the separate `npm run build:pages` command, which Cloudflare can execute through its own Git integration. If GitHub Actions deployment to Cloudflare is chosen later, use a new independently authorized workflow and credentials; never replace or modify the existing Vercel integration. `check:site` and `check:links` accept an optional output directory; omitting it preserves their existing `public/` behavior.

After deployment, check home, a post, About, search (including body fetch), RSS, sitemap, robots, a nonexistent route (custom 404), offline/service worker behavior, mobile layout, and media/download requests. Verify the custom domains and HTTPS. Local build success does not establish live DNS, certificates, browser behavior or Cloudflare deployment success.

## MapTiler prerequisite

The Footprints page retains its existing public frontend MapTiler key and API URL. Its existing origin restrictions must authorize the selected `PAGES_SITE_URL` (by default `https://blog.zhangdd.tech`) before the map works on that domain. Add any preview hostname separately only if preview map testing is wanted. Do not rotate the key, remove restrictions, or add a broad wildcard as part of this migration. MapTiler account/security changes require separate authorization.

## Rollback

The original Vercel target remains independently buildable with `npm run build`, output `public/`. Do not replace or remove the existing `zhangdd.tech` or `cdn.zhangdd.tech` records. If the new deployment fails validation, leave the original domains serving as before and pause the new-domain rollout.

## References

- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Build image and explicit dependency installation](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
