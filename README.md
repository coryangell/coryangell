# coryangell.com

Static [Astro](https://astro.build) site, content in [Sanity](https://www.sanity.io), hosted on a **Cloudflare Worker with static assets** (no Pages, no server code).

Migrated from WordPress (Zion Builder + GeneratePress) on 2026-10-23. All three live pages (Home, About, Bookshelf) and every image and link were carried over.

```
.
├── src/                 Astro site
│   ├── lib/content.ts   Loads content from Sanity, or from seed/ if Sanity isn't configured
│   ├── components/      Header, Footer, Contact, Img, Icon, SocialLinks
│   ├── layouts/Base.astro
│   └── pages/           index, about, bookshelf, 404
├── public/              _redirects, _headers, robots.txt, favicon, OG image
├── seed/                Migrated content (content.json) + original full-size images
├── studio/              Sanity Studio (schemas, singleton desk structure, seed import script)
├── wrangler.jsonc       Assets-only Worker config
└── astro.config.mjs
```

## Run it locally

Requires Node 22.12+.

```sh
npm install
npm run dev        # http://localhost:4321
npm run preview    # production build served by the real Workers runtime (wrangler dev)
```

With no `.env`, the site builds from `seed/content.json`, so it works before Sanity is connected.

## 1. Connect Sanity

```sh
cd studio
npm install
npx sanity login
npx sanity projects create "Cory Angell" --dataset production --dataset-visibility public
```

Copy `studio/.env.example` to `studio/.env` and set `SANITY_STUDIO_PROJECT_ID` to the ID the command printed.

**Import the migrated content and images** (36 documents, 46 images):

```sh
npm run seed       # builds studio/seed-import/content.ndjson, then imports it with --replace
npm run dev        # Studio at http://localhost:3333
npm run deploy     # optional: host the Studio at <name>.sanity.studio
```

Then point the site at Sanity. Copy the root `.env.example` to `.env`:

```
PUBLIC_SANITY_PROJECT_ID=<your project id>
PUBLIC_SANITY_DATASET=production
```

`npm run build` now pulls content from Sanity, and images are served from Sanity's CDN. The dataset must be **public** (the default), because the build reads published content without a token.

**Editing model:** *Site settings*, *Home page*, *About page* and *Bookshelf page* are singletons. **Books** are their own documents; add a book, then drag it into place on the Bookshelf page. Paragraphs in long text fields are separated by a blank line. Hobby icons use [Font Awesome 6 solid](https://fontawesome.com/search?ic=free&s=solid) names (e.g. `guitar`).

## 2. Connect Cloudflare

This deploys as a **Worker with static assets**: `wrangler.jsonc` points `assets.directory` at `./dist`, uses `404-page` not-found handling, and has no `main` script.

1. Push this folder to a GitHub/GitLab repo.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository** and select the repo.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Build variables: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`
3. Check the `*.workers.dev` URL.
4. **Cutover:** go to Worker → **Settings → Domains & Routes → Add → Custom domain** and add `coryangell.com` (and `www.coryangell.com` if you use it). This replaces the DNS record that points at the WordPress host, so the site switches over the moment you save. Do this last.
5. Recommended: turn on HSTS for the zone under **SSL/TLS → Edge Certificates → HTTP Strict Transport Security**. Only enable *include subdomains* if every subdomain serves HTTPS.

Or deploy from your machine with `npx wrangler login && npm run deploy`.

### Rebuild when content is published

1. In the Worker, go to **Settings → Builds → Deploy Hooks**, create a hook for your production branch, and copy the URL.
2. At sanity.io/manage, go to your project → **API → Webhooks → Create webhook**:
   - URL: the deploy hook URL
   - Dataset: `production`, Trigger on: Create / Update / Delete
   - HTTP method: `POST`
   - Leave the filter empty. Only published changes fire, because drafts are excluded by default.

Repeated publishes in quick succession collapse into one build.

## What changed vs. the WordPress site

- **Fonts render as designed.** The old site declared Roboto Slab and DM Sans but never loaded them, so visitors saw Times New Roman. They are now self-hosted.
- **Analytics kept.** The Google tag `GT-PZMLWT6` is preserved and editable in *Site settings*. Clear it to remove analytics.
- **Old URLs redirect.** The default "Hello world!" post, category, author, feed and `wp-sitemap.xml` URLs 301 to the right place (`public/_redirects`).
- **SEO.** Meta descriptions, canonical URLs, Open Graph tags, `sitemap-index.xml` and `robots.txt` were added. Page titles match the old site.
- **Accessibility.** Images now have alt text, the testimonial slider works with the keyboard, and there is a skip link and a mobile menu.
- **Performance.** Images are resized and served as WebP, and there are no WordPress or jQuery scripts. The only JavaScript is the mobile menu and the testimonial carousel.
- **Footer year.** The © year updates on every build (it was hard-coded to 2024).
- **Contact.** "Get in touch" and the nav's Contact link jump to the contact section on the current page.

Copy was migrated exactly as written. A few typos you may want to fix in Sanity: "repetetive" (About → Home and Business Automation), "workoholic" (Bookshelf → The 4-Hour Workweek), "Below are a selection" (Bookshelf intro).
# coryangell
