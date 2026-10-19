# Deployment

The site is static. Anything that can serve files will host it.

## GitHub Pages

The repository is already on GitHub, so publishing is a settings change:

1. **Settings → Pages → Build and deployment**
2. Source: **Deploy from a branch**
3. Branch: `master`, folder: `/ (root)` → **Save**

The first build takes a minute or two, then the site is live at
`https://<username>.github.io/staging-website/`.

Notes:

- Every internal link is relative, so the `/staging-website/` sub-path works
  without changes. The absolute URLs in the `<link rel="canonical">` and
  `og:*` tags, `robots.txt`, and `sitemap.xml` do need updating if you deploy
  somewhere else.
- `404.html` is picked up automatically.
- Pages serves the repository as-is; the Docker files are inert there.

### Custom domain

1. Add a file named `CNAME` at the repository root containing your domain
   (e.g. `topstaginganddesign.com`), commit, and push.
2. At your DNS provider, point the apex record at GitHub:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   (A records), or CNAME `www` to `<username>.github.io`.
3. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is
   issued (can take up to 24 hours).
4. Update the absolute URLs listed above to the new domain.

## Docker

```bash
docker compose up --build -d      # http://localhost:8080
docker compose logs -f
docker compose down
```

The image is nginx-alpine and runs as the unprivileged `nginx` user on port
8080. `docker-compose.yml` adds a read-only root filesystem, tmpfs mounts for
nginx's runtime paths, `no-new-privileges`, CPU/memory limits, and a
healthcheck.

`nginx.conf` sets gzip, cache headers (HTML revalidates, assets cache for a
year), the custom 404, and this content security policy:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
font-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self';
frame-ancestors 'self'; object-src 'none'
```

Every source is `'self'`: the site loads nothing from a third party, fonts
included. `'unsafe-inline'` is needed for style attributes only — there are no
inline scripts. `form-action 'self'` will block a third-party form endpoint, so
widen it if you wire the contact form to Formspree or similar.

Careful when editing: **any `add_header` inside a `location` block silently
drops the server-level headers**, which is why the cache rules use `expires`.

### Behind a reverse proxy

Terminate TLS upstream and forward to port 8080. If the proxy also sets
security headers, delete them here rather than sending both.

## Other hosts

Netlify, Vercel, Cloudflare Pages, S3 + CloudFront: no build command, publish
directory is the repository root. Set the 404 document to `404.html`.

## Pre-launch checklist

- [ ] Replace the placeholder contact details, address, and social links
- [ ] Point the contact form at a real backend (see README)
- [ ] Swap in your own photography and update every `alt` to match
- [ ] Update the canonical/OG URLs, `robots.txt`, and `sitemap.xml`
- [ ] Confirm the statistics and testimonials are ones you can stand behind
