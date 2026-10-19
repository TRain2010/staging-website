# Top Staging And Design

Marketing site for a home-staging studio. Four pages of hand-written HTML, one
stylesheet, one script — no build step, no dependencies, no framework.

```
.
├── index.html          Home
├── services.html       Area-based pricing, process
├── portfolio.html      Project galleries + lightbox
├── contact.html        Consultation form + FAQ
├── 404.html            Not-found page (nginx + GitHub Pages both use it)
├── css/style.css       The whole design system
├── js/main.js          Nav, hero video, gallery, form
├── images/             Photography (and the hero video poster)
├── media/              Home-page hero reel, 1440p and 1080p, AV1 and H.264
├── fonts/              Self-hosted woff2 (nothing loads from a third party)
├── favicon.svg
├── robots.txt · sitemap.xml
└── Dockerfile · docker-compose.yml · nginx.conf
```

## Running it

Any static server works:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Or with Docker (nginx, non-root, read-only filesystem, security headers):

```bash
docker compose up --build       # http://localhost:8080
```

Opening `index.html` straight from the filesystem also works, though the
`file://` origin means relative links behave slightly differently.

## The design system

Warm paper, quiet type, generous air. Hierarchy comes from scale and spacing
rather than colour — the rust accent appears only on interactive states and the
occasional italic. Nothing animates on scroll.

Everything is driven by custom properties at the top of `css/style.css`:

| Group | What to change |
| --- | --- |
| Colour | `--paper` (warm white), `--oat` (surface panels), `--sand` (hairlines), `--ink` / `--ink-2` / `--ink-3` (a warm near-black and two greys), `--accent` (muted rust). Light values live on `:root`; the dark set is redefined under `@media (prefers-color-scheme: dark)`. Keep the two in sync. |
| Type | `--serif` (Cormorant Garamond — headlines, prices) and `--sans` (Manrope — everything else). Both are self-hosted from `fonts/` under the SIL Open Font License, declared in section 00 of the stylesheet; Manrope is a variable face, so one file covers 400–700, and Cormorant is a single 500 cut in upright and italic. Sizes run `--t-eyebrow` → `--t-h1` on `clamp()`. |
| Space | `--sec` (section rhythm), `--pad` (page gutter), `--sp-1` … `--sp-8`, and small radii `--r-sm` / `--r` / `--r-lg`. |

Four rules hold the look together:

1. **Warm neutrals, never grey.** Every neutral has warmth in it; `#000` and
   `#fff` appear nowhere.
2. **Two faces, split by job.** Serif for display and numbers, sans for reading
   and interface. A body paragraph is never serif; a statistic never sans.
3. **Colour is an accent, not a system.** Rust marks links, hovers, focus, and
   the odd italic. Sections are separated by `--oat` panels and `--sand`
   hairlines, not by colour blocks.
4. **Air over ornament.** No shadows, no gradients, no borders where whitespace
   will do. Radii stay small (6–10px) so panels read soft, not bubbly.

The stylesheet is ordered in numbered sections (tokens, base, layout, type,
buttons, header, hero, sections, panels, gallery, list & prices, call to action, forms,
footer, lightbox, motion, print) — find the section, edit in place.

Dark mode is automatic and follows the operating system. There is no toggle.

### The pieces

- `.sec` — a section with the standard vertical rhythm; `.sec--half` for the
  first section under a page opener, `.sec--oat` to sit it on the warm panel.
- `.hero` / `.opener` — the full-bleed home hero, a looping walkthrough video
  under a soft gradient, and the lighter opener used on interior pages.
- `.panel` — a soft oat card. `.panel--paper` is the inverse, for cards that sit
  *on* an oat section.
- `.gallery` / `.shot` — the photo grid with captions beneath; `.gallery--3`
  gives the long project galleries a third column on wide screens.
- `.projects` / `.project` — the Projects page. Each project leads with three
  photographs (`.gallery--lead`, one row of three) under its name and location;
  the rest sit in a `<details class="project__more">` behind a "Show all
  photographs" control. The label swaps to "Show fewer" with CSS alone, so it
  reads correctly with no script.
  The lightbox is scoped to the project clicked into: from a lead photograph it
  walks that project's three, and once a project is expanded it walks all of
  that project's photographs — never across projects.

  Two rules for the lead trio, worth keeping if you edit the galleries: the
  three must be **different rooms** (a living space, a kitchen or dining room,
  a bedroom) and all **interiors** — no exteriors, patios, decks, or gardens.
  Neither the number of projects nor the number of photographs is stated
  anywhere on the site.
- `.rows` / `.row` — the services price list: name, inclusions, price.

## Behaviour in `js/main.js`

Each block guards on its own markup, so a page only runs what it contains.

- **Header** — picks up a hairline once the page scrolls (`data-stuck`).
- **Mobile nav** — `aria-expanded` on the toggle, closes on Escape, on an
  outside click, on link activation, and when crossing to the desktop layout.
- **Counters** — `<b data-count="500" data-suffix="+">` counts up when scrolled
  into view. The real figure stays in the markup, so it is what shows without
  JS or if the element never enters the viewport; zero appears only for the
  moment the animation starts. Skipped under `prefers-reduced-motion`.
- **Gallery filters** — the `.filter` buttons show and hide `.shot` items by
  `data-category` and update the `#shown-count` readout.
- **Lightbox** — clicking a photograph opens the `<dialog>`, which walks only
  the shots the current filter left visible and supports arrow keys, Escape,
  and backdrop click.
- **Form** — validates on blur and on submit, writes messages into each field's
  `.err` element, and moves focus to the first invalid input.

## Pricing

Pricing is **area-based**: the client charges per area staged, not per package
or per square foot. `services.html` lists twelve areas, each with a range and
what the fee covers, plus a note on how a quote comes together. Variants that repeated
another line (a guest room with a desk, a patio with a fireplace, an
entertainment area beside the family room) were folded into the base line.

The ranges bracket the client's own representative flat fee by roughly a fifth
either way (their entry-area figure of $250 becomes $200–$350, and so on), so
the schedule reads as a quote range rather than a fixed price list. The
site deliberately quotes no whole-home price: real houses never use every
line, so any total would mislead. The rental period is 45 days. If those figures change, edit the `AREAS` list logic
directly in the `.rows` block of `services.html`; the home page repeats three of
them (living area, primary suite, outdoor) and the contact-page FAQ repeats a few
area prices, so update those too.

## Contact form

`#contact-form` posts to [Web3Forms](https://web3forms.com), which emails each
request to the inbox its access key was created for. The key sits in a hidden
`access_key` input in `contact.html`; it is public by design and can only send
to that one inbox. `js/main.js` validates, posts JSON with `fetch()`, and shows
the thank-you panel only when Web3Forms answers `success: true`; on any failure
it shows `#form-err` with the email address instead. A hidden `botcheck`
checkbox is Web3Forms' honeypot. The CSP in `nginx.conf` and `_headers` allows
`https://api.web3forms.com` in `connect-src` and `form-action`.

## Content to replace before launch

The copy is written for a fictional studio. Search and replace:

- `service@topstaginganddesign.com` — no real address was supplied, so this is
  a placeholder in the footer, the contact page, and the JSON-LD block in
  `index.html`. The site deliberately shows no phone number or business hours.
- `https://www.topstaginganddesign.com` in the canonical/OG tags of each
  page, in `robots.txt`, and in `sitemap.xml`

Photography lives in `images/projects/` — 129 photographs across nine real
projects, shown in this order: Kirkland, three Bellevue homes (the second and
third both 98006), Clyde Hill, Sammamish, Shoreline, north Seattle, and
Issaquah. Projects are named by city, never by street. The two 98006 sets came from the listing photo
downloads and are 1080px wide, their native size. Exteriors, unstaged rooms, and
near-duplicate shots have been left out. They are 1200px on the long
edge at quality 76 — 1200px is the width the lightbox displays at, so nothing
is wasted. `images/hero.jpg` is the one exception, kept at 1800px; it is now only the
social-sharing image. The whole `images/` directory is about 12 MB.

Two source folders were left out on purpose: one is a pre-renovation shoot
(bare rooms, drop cloths, ladders) and one is mid-install with the furniture
still boxed. Four more had too few frames to fill a gallery, and one is video
only.

**When adding photographs, apply EXIF orientation.** Much of the DSLR material
is shot portrait and only the EXIF tag says so — 27 of the current images
needed rotating. `PIL.ImageOps.exif_transpose()` handles it; without it they
ship sideways. To swap a photograph, drop a new file into `images/projects/`
and edit the matching `<button class="shot">` in `portfolio.html` — each one is
self-contained. The wordmark is
`images/logo.png`: the supplied artwork trimmed of its white margin and made
transparent, so it sits on any background and inverts cleanly for dark mode.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages and Docker/nginx.

## Hero video

The home page opens on a silent, looping reel cut from the walkthrough
footage in `Videos/`. Eight shots are slowed to about a third of their speed
with motion interpolation, so they stay smooth, and joined with dissolves.
The first shot is repeated at the end and trimmed so the loop has no visible
seam.

- The reel is cut at the footage's native 2560x1440 with lossless
  intermediates, then lightly sharpened to offset the interpolation.
- Large and high-density screens get `media/hero-1440.*`, everything else,
  phones included, gets `media/hero-1080.*`. Phones need the 1080p cut because
  the portrait crop uses only the middle of the frame.
- Each size comes as AV1 (`.av1.mp4`), which is sharper per byte and is what
  Chrome, Edge, Firefox, and recent Apple devices pick, and as H.264 for every
  other browser. The raw footage is HEVC, which Firefox and some Chrome builds
  cannot play.
- `images/hero-poster.jpg` is the reel's first frame. It shows until the video
  starts, and it is all that visitors who prefer reduced motion see.
- The video pauses while scrolled out of view, and the round button in the
  hero pauses it by hand.
- On the home page the header starts transparent over the video and turns
  solid once the page scrolls or the mobile menu opens.

`Videos/` holds the original footage, about 75 MB. The Docker image leaves it
out, and nothing on the site links to it.
