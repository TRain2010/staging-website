# Deployment

The site is static. Anything that can serve files will host it.

## Cloudflare Pages (production)

Live at `https://www.topstaginganddesign.com`. The domain is registered at
GoDaddy; the site itself is hosted on Cloudflare Pages.

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**,
   pick `TRain2010/staging-website`.
2. Production branch: `master`. Framework preset: **None**.
3. Build command:

   ```
   mkdir -p dist && cp -r *.html _headers favicon.svg robots.txt sitemap.xml css js fonts images media dist/
   ```

   Build output directory: `dist`. Copying only the site files keeps the
   README, Docker files, and raw footage off the public site.
4. Deploy, then check the `*.pages.dev` preview.
5. **Custom domains → Set up a domain** → `www.topstaginganddesign.com`.
   Cloudflare shows the DNS record to add; in GoDaddy's DNS settings add a
   CNAME `www` → `<project>.pages.dev`. To send the bare domain to `www`, use
   GoDaddy's domain forwarding (301 to `https://www.topstaginganddesign.com`),
   or move the nameservers to Cloudflare and add the apex there too.
6. HTTPS is issued automatically once DNS resolves.

Every push to `master` redeploys. `_headers` carries the same security and
cache headers as `nginx.conf`; keep the two in step. Pages serves each page
without its `.html` suffix (`/services`), which is what the canonical URLs and
`sitemap.xml` use; the relative `.html` links still work and redirect.

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
default-src 'self'; connect-src 'self' https://api.web3forms.com;
script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self';
img-src 'self' data:; base-uri 'self'; form-action 'self' https://api.web3forms.com;
frame-ancestors 'self'; object-src 'none'
```

The site loads nothing from a third party, fonts included; the one outside
origin is Web3Forms, which the contact form posts to. `'unsafe-inline'` is
needed for style attributes only — there are no inline scripts.

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
- [ ] Put the Web3Forms access key in `contact.html` and send a test request
- [ ] Swap in your own photography and update every `alt` to match
- [ ] Update the canonical/OG URLs, `robots.txt`, and `sitemap.xml`
- [ ] Confirm the statistics and testimonials are ones you can stand behind
