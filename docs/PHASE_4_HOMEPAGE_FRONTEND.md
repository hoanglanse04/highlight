# Phase 4 — Homepage Frontend

## Phạm vi

Phase 4 render trang chủ production-ready tại `/vi` và `/en` từ bốn Payload Globals đã có: Homepage, Header, Footer và Site Settings. Phase này không tạo Projects, Categories, Posts, ContactRequests, project routes, page builder, object storage hay video upload.

Không có thay đổi database schema trong Phase 4. Payload types và migrations Phase 1–3 được giữ nguyên.

## Component architecture

```text
src/
├── app/(frontend)/[locale]/page.tsx
├── components/
│   ├── home/       # Hero, About, Projects, Categories, Services, Statistics,
│   │               # Clients, Stories, Contact CTA, empty/maintenance states
│   ├── layout/     # SiteHeader, language switcher, preview banner, footer, JSON-LD
│   ├── media/      # PayloadImage and lazy ExternalVideo
│   └── ui/         # Container, headings, safe links, Motion wrappers, icon map
├── hooks/revalidateWebsite.ts
└── lib/
    ├── content/    # enabled/displayOrder normalization
    ├── media/      # Media relationship, URL, size and video-provider resolution
    ├── seo/        # locale-aware Metadata construction
    └── urls/       # safe internal/external links and telephone normalization
```

Homepage sections remain Server Components. Client JavaScript is limited to the sticky/mobile Header, dialog animation, lazy external video and small Motion wrappers.

## Data flow

The locale page reads `draftMode()` and loads all public data concurrently:

```text
Promise.all(
  getHomepage(locale, draft),
  getHeader(locale, draft),
  getFooter(locale, draft),
  getSiteSettings(locale, draft),
)
```

These existing helpers use Payload Local API with `overrideAccess: false`, locale fallback to Vietnamese, and authenticated request context before allowing draft reads. No Client Component calls Payload or PostgreSQL directly.

Arrays are filtered with `enabled !== false`, sorted by ascending `displayOrder`, then capped where the design deliberately limits density: eight featured projects, three stories and six About gallery images. A disabled section is omitted. Null Globals, relationships, invalid links and missing generated image sizes are handled without throwing.

## Draft preview

The Phase 3 preview entry route remains the only way to enable Draft Mode. It requires both the server-only `PREVIEW_SECRET` and an authenticated Payload session. In Draft Mode:

- the four Local API queries request draft content;
- the page displays a visible draft banner;
- the exit link disables Draft Mode and returns to the same locale;
- maintenance mode is bypassed so editors can preview the site.

Normal public requests never pass `draft: true`; Payload access additionally constrains them to `_status=published`.

## Media rendering

`PayloadImage` accepts a Media relationship object, preferred Payload size, `sizes`, `priority` and `fill`. It only serves the existing same-domain Payload route `/api/media/file/...`; absolute URLs are accepted only when their origin matches `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_SERVER_URL`, then normalized back to a local path.

Size policy:

| Context                            | Preferred size |
| ---------------------------------- | -------------- |
| Hero/poster, wide About/background | `large`        |
| Large project/category/story cards | `medium`       |
| About gallery/mobile imagery       | `small`        |
| Logos/small preview                | `thumbnail`    |

If a generated size is absent because the source image was not upscaled, the component falls back to the original dimensions and URL. Hero image/poster uses priority; below-fold images stay lazy by Next Image default. Missing Media renders a neutral, dimension-controlled surface rather than a broken image.

`next.config.mjs` explicitly permits `/api/media/file/**`. No remote image host, localhost URL or object-storage adapter was added.

## External video behavior

Only valid HTTP(S) sources are considered:

- YouTube and `youtu.be`: privacy-enhanced `youtube-nocookie.com` embed;
- Vimeo: `player.vimeo.com` embed;
- direct URLs ending in `.mp4` or `.webm`.

YouTube/Vimeo show the CMS poster and load an iframe only after the visitor activates the Play button. Direct video starts loading when the Hero approaches the viewport and uses `muted`, `loop`, `playsInline`, and metadata preload. Any invalid/unsupported URL or playback error keeps the poster visible and shows a translated unavailable state. Provider URLs requiring private tokens, query-only direct-file detection, HLS/DASH and uploaded videos are intentionally unsupported.

## SEO and structured data

`generateMetadata` runs server-side for each locale. Precedence is:

1. Homepage SEO fields;
2. Site Settings SEO defaults;
3. Site Settings site name;
4. a translated neutral UI fallback.

It emits a locale-specific title/description, canonical, `vi`, `en`, and `x-default` alternates, Open Graph, Twitter card, optional OG image/favicon, and robots directives. `metadataBase` uses `NEXT_PUBLIC_SITE_URL`, falling back to `NEXT_PUBLIC_SERVER_URL` only when necessary.

Because the CMS canonical field is non-localized, a custom canonical is honored only when it ends in `/vi` or `/en`; that segment is replaced for the requested locale. Otherwise the safe `/<locale>` canonical is used so Vietnamese and English never share one canonical URL.

Organization JSON-LD uses only present Site Settings values: name, legal name, public URL, logo, email, telephone, postal address and enabled social URLs. JSON is serialized with `<` escaped before insertion. CMS prose is never rendered with `dangerouslySetInnerHTML`; Phase 3 descriptions are plain textarea fields.

## Localization

Administrator-authored copy arrives from Payload localized fields with `en -> vi` fallback. Fixed interface labels live only in `messages/vi.json` and `messages/en.json`, including navigation/menu labels, language switcher, project/category actions, video states, preview, maintenance, empty state and screen-reader section names.

The language switcher uses next-intl navigation and transitions `/vi <-> /en` without a forced full reload. Future localized route mapping remains a later-route concern.

## Header and footer

Header honors the CMS sticky, transparent-on-Hero, light/dark logos, navigation, CTA and language-switcher settings. Desktop navigation is sorted and filtered. Mobile uses the native modal `dialog`, which supplies focus containment; Escape closes it, initial focus moves to Close, and body scrolling is locked while open.

Footer renders its CMS logo, background, description, ordered navigation columns, contact details and copyright. Canonical social links are read once from Site Settings and reused by Footer and Contact CTA.

## Maintenance and empty states

When published Site Settings enables maintenance mode, public locale pages render a minimal translated maintenance view and metadata becomes `noindex,nofollow`. `/admin`, `/api`, health and preview routes are untouched; authenticated Draft Mode bypasses the screen.

The maintenance page returns HTTP 200. A route-level 503 would require middleware/route restructuring broad enough to risk Payload routes, so that change is deferred. A missing published Homepage also returns a safe 200 empty state without technical details; preview shows an editor-oriented empty-draft message.

## Cache and revalidation

Locale pages are dynamic because they read Draft Mode and authenticated Local API context. This prevents draft/public cache mixing and makes published content visible immediately without a separate data cache.

All four Globals also share a Payload `afterChange` hook. It calls Next `revalidatePath('/vi', 'page')` and `revalidatePath('/en', 'page')` only when the resulting document has `_status=published`. Draft and autosave writes do not revalidate. There is no unused cache tag layer in this phase; add tags together with an actual public data cache if traffic later justifies it.

## Responsive behavior

- `360/390px`: one-column sections, compact Hero type, mobile dialog navigation, two-column client/stat grids.
- `768px`: two-column project/category layouts and three-column stories.
- `1024px`: desktop section spacing, About two-column layout, desktop Header begins at the large breakpoint.
- `1440/1920px`: content remains bounded at 90rem while full-bleed media backgrounds continue to fill the viewport.

Images use fixed aspect-ratio wrappers and `object-cover`/`object-contain`, preventing distortion and layout shifts. The root clips accidental horizontal overflow without hiding vertical focus or dialog content.

## Accessibility and performance

- semantic `header`, `main`, `section`, `footer`, navigation and address landmarks;
- one CMS Hero `h1`; section `h2` fallback labels and card `h3` hierarchy;
- skip-to-content link, visible focus, translated ARIA labels and safe new-tab `rel`;
- Media alt text for content images and empty alt for decorative backgrounds;
- no action relies only on hover;
- native keyboard dialog behavior and Escape handling;
- global `prefers-reduced-motion` override plus Motion `useReducedMotion`;
- Motion starts from server-visible content, so content remains present if JavaScript fails;
- no icon package, carousel, scroll hijacking or client-side CMS fetch;
- Next Font self-hosts optimized Inter and Space Grotesk assets from the build.

## Verification workflow

1. Publish Vietnamese and English values for all four Globals in `/admin`.
2. Open `/vi` and `/en`; inspect text, title, canonical, hreflang, OG and JSON-LD.
3. Disable a section or item, publish, and confirm it disappears.
4. Save a visible draft change, use Preview, then Exit Preview and verify the public value remains published.
5. Test image and external-video Hero modes.
6. Toggle maintenance mode; confirm public maintenance/noindex and preview bypass.
7. Test keyboard navigation and the mobile dialog at 360/390px, then layouts at 768/1024/1440/1920px.
8. Run:

```bash
npm run lint
npm run type-check
npm run build
docker compose config --quiet
docker build -t highlight-app:phase4 .
```

## Known limitations

- There are no Project, Category or Post detail routes; embedded homepage links must point to an existing internal or external destination.
- Hover project video preview is represented by a video badge; only the Hero instantiates a player, avoiding concurrent video downloads.
- YouTube/Vimeo playback requires a visitor click; browser/provider policies control autoplay after activation.
- Maintenance responses are 200 + noindex rather than 503.
- No visual editor, analytics execution, contact form, carousel, uploaded video, HLS/DASH or per-locale publish status is included.
- Lighthouse scores depend on real production images, content, network, Caddy/Cloudflare configuration and should be measured again after production content is published.
