# Phase 6 — Projects Frontend

## Scope

Phase 6 renders the existing Phase 5 Projects data model. It adds no collection,
Global, upload adapter, database migration, or generated Payload type change.

Public routes are:

| Locale | Listing | Detail |
| --- | --- | --- |
| Vietnamese | `/vi/du-an` | `/vi/du-an/[slug]` |
| English | `/en/projects` | `/en/projects/[slug]` |

The shared dynamic App Router segments validate the locale/segment pair. Therefore
`/vi/projects` and `/en/du-an` return 404 rather than becoming aliases.

## Component architecture

```text
src/app/(frontend)/[locale]/[projectsSegment]/
├── page.tsx
└── [slug]/page.tsx
src/components/projects/
├── ProjectCard, ProjectGrid, ProjectFilters, ProjectPagination
├── ProjectHero, ProjectMetadata, ProjectGallery, ProjectContent
├── ProjectRichText, RelatedProjects, ProjectsPageShell
└── blocks/                         # fixed renderers for the 10 CMS block types
src/lib/projects/
├── routes.ts                       # vi/en route mapping
├── queryParams.ts                  # category/page/sort parsing and serialization
├── preview.ts / previewPaths.ts    # authenticated Draft Mode context and allowlist
├── homepageSources.ts              # Homepage collection-mode adapters
├── seo.ts                          # listing/detail Metadata
└── structuredData.ts               # CollectionPage and CreativeWork JSON-LD
```

Pages and block renderers remain React Server Components. Client JavaScript is
limited to the existing Header/Motion interactions and the lazy external-video
player.

## Data flow and publication rules

Routes call the typed Phase 5 Local API helpers. Public queries use
`overrideAccess:false`, `_status=published`, and `enabled=true`. Detail helpers strip
`internalName` and `adminNotes`; UI components never render service internal names.
Draft queries require both:

1. a valid Next.js Draft Mode cookie established by `/api/preview`; and
2. a currently authenticated Payload user resolved again from request headers.

An expired session cannot turn Draft Mode into public draft access. Public project
404 conditions include missing, draft-only, disabled, malformed, and unsafe slugs.
Draft preview may intentionally show disabled projects for editorial review.

Media relationships are populated at controlled depth. Missing/deleted Media is
omitted or rendered as the existing fixed-size fallback without crashing.

## Listing, filter, sort, and pagination

The listing queries PostgreSQL through Payload with `limit=12`; it never fetches all
projects for client filtering. Default order is curated `displayOrder`, followed by
project date and creation date.

Allowed sort values are:

- `displayOrder`
- `featuredOrder`
- `newest`
- `oldest`
- `title`

Raw query sort never reaches Payload. Category uses a safe Phase 5 slug and filters
both primary and secondary categories. Category links are server-rendered, preserve
sort, and reset page. The sort form uses GET and works without JavaScript.

Malformed/non-positive/excessive pages fall back to page 1. A valid positive page
beyond the result set returns 404. Invalid or unknown categories return a localized
empty state and `noindex` rather than throwing. Pagination preserves category/sort,
renders Previous/Next plus a bounded page range, and marks the current page with
`aria-current`.

## Detail and block rendering

Detail order is Hero, basic metadata, introduction, project-level gallery, structured
content, related projects, and Footer. Empty metadata fields are omitted. The basic
metadata remains separate from optional project facts so the renderer does not
automatically repeat the fact list.

`ProjectContent` has an explicit switch for all Phase 5 block types:

1. `richText`
2. `fullWidthImage`
3. `twoColumnImages`
4. `imageGallery`
5. `externalVideo`
6. `quote`
7. `projectFacts`
8. `statistics`
9. `textImage`
10. `relatedProjects`

Unknown runtime block values are skipped. Development logs a warning; production
does not crash. CMS rich text uses Payload 3.86's official Lexical React renderer.
Custom link converters validate internal or HTTP(S) URLs, add safe new-tab behavior
through `SmartLink`, and render unsafe links as plain children. CMS H1 nodes are
rendered as H2 so each page keeps one H1.

Gallery layouts use CSS grid, CSS columns, or keyboard-focusable scroll snap. There
is no carousel dependency or scroll hijacking. Statistics values are present in
server HTML and do not depend on counter animation.

## Related projects

Manual relationships preserve CMS order. Automatic blocks query server-side using:

- same primary category;
- any shared primary/secondary category; or
- featured projects.

All strategies exclude the current project and clamp output to 1–8 cards. If content
contains an enabled Related Projects block, the default related section is suppressed.
Otherwise the project's top-level `relatedProjects` list renders at the end. Resolvers
never recursively render project content.

## Homepage collection source

The Phase 4 embedded modes remain unchanged.

- `featuredProjects.sourceMode=projectCollection` first resolves
  `selectedProjects`; if empty, it queries featured projects (or all curated projects
  when the CMS featured filter is disabled).
- `projectCategories.sourceMode=categoryCollection` first resolves
  `selectedCategories`; if empty, it queries featured categories.

Configured limits are clamped to 1–12. Public resolution rechecks published/enabled
state even when a Global relationship was populated. Authenticated Homepage preview
can resolve draft relationships. Switching a source does not mutate or delete
embedded CMS data.

## Preview

Phase 5 preview URLs now render the real listing/detail pages. `/api/preview` accepts
only home, exact localized listing, an optional safe category, or exact localized
detail paths. It still requires `PREVIEW_SECRET` and Payload authentication.

The Preview banner is visible on project pages. Exit Preview accepts only the same
internal route family plus whitelisted listing navigation params and returns to the
current page. External origins, traversal, unknown query keys, raw sort, and unsafe
slugs are rejected.

## Media and video

`PayloadImage` chooses generated VPS Media variants:

| Context | Preferred variant |
| --- | --- |
| Cards and gallery tiles | `medium` |
| Mobile/small portrait | `small` |
| Hero, wide block, featured gallery row | `large` |
| Logos | `thumbnail` |

Each context supplies responsive `sizes`; original files are only a fallback when
Payload did not generate an upscaled variant. Hero is priority; below-fold images
remain lazy. Width/height or fixed aspect boxes prevent layout shift.

YouTube and Vimeo use privacy-aware lazy iframes. Direct MP4/WebM activates near the
viewport and honors CMS autoplay, muted, loop, and controls settings. Autoplay with
sound remains rejected by the Phase 5 schema. Poster and localized unavailable states
remain visible when a URL/provider fails. HLS, DASH, uploaded video, and private
provider tokens are not supported.

The homepage featured-project slider prefers `hoverPreviewVideoURL` and falls back to
the project Hero `externalVideoURL`. Hover-capable desktop devices autoplay the
preview muted and looped; touch devices and reduced-motion users keep the poster
image. Short, optimized direct MP4/WebM files give the fastest hover response.

## SEO and structured data

Listing metadata uses category SEO when a valid category is selected, otherwise fixed
localized UI copy plus Site Settings. Category query pages are self-canonical and
indexable unless the category requests `noIndex`. Page 2+ keeps `page` in canonical;
sort is excluded. Invalid categories are `noindex`.

Detail precedence is Project SEO, Project title/short description, then Site Settings.
A custom Project canonical is accepted only when it uses the configured site origin
and exactly matches the current locale route and slug. Vietnamese and English never
share one canonical. Both page types emit `vi`, `en`, and `x-default` alternates,
Open Graph, Twitter, favicon, and maintenance/draft `noindex`.

Listing JSON-LD is a `CollectionPage` with an `ItemList` for the current page. Detail
JSON-LD is `CreativeWork` and only includes present values such as image, date, year,
publisher, client, artist, location, and services. JSON is serialized with `<`
escaped; no duration, upload date, or invented metrics are emitted.

## Cache and revalidation

Listing/detail routes are dynamic SSR. This keeps query-param listings and
authenticated drafts isolated and makes published writes visible immediately.
Next metadata streaming is disabled with `htmlLimitedBots: /.*/` for complete initial
head metadata. Next 16 can still stream the layout before a page-level `notFound()`,
so the Node Proxy performs a public Local API preflight for exact detail publication
and out-of-range pagination. It returns a localized, `noindex` HTTP 404 before the
layout stream. Draft Mode bypasses this public preflight and the page then requires
an authenticated Payload session before reading draft data.
Phase 5 hooks still revalidate `/vi`, `/en`, both listings, current/previous slugs,
category tags, and Homepage tags. Draft/autosave changes return before invalidation.
The hooks remain useful if public reads move to ISR later; no draft result enters a
public cache.

Changing a slug revalidates both the old and new paths but does not redirect the old
URL. A future Redirect collection or external redirect map is required before editors
can preserve old links.

## Accessibility and responsive behavior

- one H1 per listing/detail page;
- semantic `main`, `section`, `article`, `figure`, `figcaption`, `dl`, `blockquote`;
- skip link, visible focus, keyboard category/pagination links and filmstrip;
- `aria-current` on filters, page links, and locale selection;
- Media alt falls back to localized Media alt; decorative overlays are not announced;
- no action depends only on hover;
- video has an accessible label/controls and never autoplays audible content;
- existing global reduced-motion rules apply.

At 360/390 px, cards and two-column blocks stack; filmstrip is the only intentional
horizontal scroller. At 768 px listing becomes two columns. At 1024 px project media
and text layouts become multi-column. At 1440/1920 px content is bounded while Hero
and full-width media remain fluid.

## Verification

Static:

```bash
npm run lint
npm run type-check
npm run build
docker compose config --quiet
docker build -t highlight-app:phase6-local .
git diff --check
```

Runtime should use an isolated database or an approved staging database. Create
published/draft/disabled projects, both locales, Media, every block type, manual and
automatic relationships, then verify:

- both localized listings and details;
- filter, each sort, pagination, empty and 404 behavior;
- draft preview/auth denial/exit and public draft isolation;
- Homepage embedded and collection modes;
- canonical, hreflang, Open Graph/Twitter, and parseable JSON-LD;
- revalidation after publish/delete/category updates;
- safe handling of traversal, malformed params, unsafe Lexical links, null Media,
  and unknown blocks;
- keyboard behavior and viewport widths 360, 390, 768, 1024, 1440, and 1920.

Do not treat a successful build as proof of these runtime cases.

## Current limitations

- Shared vi/en slugs have no redirect history.
- Category filters are query pages; there is no category detail route.
- Publication status is shared between locales.
- No HLS/DASH, video upload, search engine, Blog, ContactRequests, analytics runtime,
  object storage, or free-form page builder is included.
- Provider-side video captions/subtitles are used when available; the CMS does not
  author subtitle files.
- Lighthouse targets require production media, content, network, Caddy, and
  Cloudflare testing; Phase 6 does not claim scores from local smoke tests.
