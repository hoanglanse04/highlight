# Highlight Media content seeder

## Purpose

The content seeder creates an original bilingual editorial baseline for Highlight
Media. It uses Payload Local API, respects the existing `vi/en` localization model,
and defaults to drafts so an editor can verify business facts and Media before
publishing.

The seeder does not clone another production house. It never downloads remote files
or uses third-party logos, videos, phone numbers, social accounts, canonical URLs, or
analytics identifiers.

## Highlight channel content

The separate `npm run seed:channels` command imports a curated set of work that
Highlight Media has published on its official YouTube channel. It is intentionally
separate from `seed:content`: the general content seeder remains offline and never
downloads remote assets.

`seed:channels`:

- imports the orange brand logo from
  `seed-assets/highlight-media-logo-orange.png`;
- downloads curated YouTube thumbnails over HTTPS, validates their JPEG MIME type
  and enforces the Media 15 MiB limit;
- stores all imported images through the Payload Media collection so the persistent
  uploads bind mount and image sizes are used;
- creates or updates eight bilingual, published Projects by stable slug;
- assigns the official YouTube URL as the Project hero and hover-preview video;
- publishes the `TVC & Corporate` and `Events` categories with real cover images;
- selects the imported Projects for Homepage Featured Projects;
- uses the imported project frames for the Homepage About gallery; and
- assigns the new logo to Header, Footer and Site Settings.

The command is idempotent: Media is matched by stable internal title and Projects
are matched by slug. It never deletes existing records.

```bash
npm run seed:channels
```

The Facebook album currently requires an authenticated Meta session/API token for
reliable access. The seeder therefore does not scrape Facebook HTML or copy images
from search results. Add approved Facebook originals through Media Library, or
extend this seeder later with an authorized Meta API integration.

## Data created

- Site Settings with the Highlight Media brand, localized SEO defaults, optional
  verified contact details, and optional official social links.
- Header with About, Work, Services, disabled Stories, Contact, CTA, and the language
  switcher.
- Footer with bilingual description, navigation, optional contact details, and the
  current-year copyright line.
- Homepage SEO, Hero copy, About, Featured Projects heading, Project Categories
  heading, eight Services, optional verified Statistics, disabled Clients, disabled
  Stories, and Contact CTA.
- Nine Project Categories with stable slugs and original `vi/en` descriptions.

The seeder does not invent Projects, clients, news/stories, statistics, or business
details. Existing published Projects can be selected for Homepage Featured Projects;
no Project document is created without a separately reviewed structured input.

## Safety defaults

| Variable | Default | Behavior |
| --- | --- | --- |
| `SEED_DRY_RUN` | `false` | Inspect and report without writing when `true` |
| `SEED_FORCE` | `false` | Existing Globals/categories are skipped |
| `SEED_PUBLISH` | `false` | New or forced documents are saved as drafts |

Running the command twice with the defaults does not create duplicate categories and
does not overwrite editor-authored content. `SEED_FORCE=true` updates only the four
known Globals and the nine categories identified by stable slug. It never deletes
documents or Media.

Do not run `SEED_FORCE=true` against production until PostgreSQL and
`UPLOADS_HOST_PATH` have been backed up together.

## Environment variables

Optional verified business data:

- `HIGHLIGHT_LEGAL_NAME`
- `HIGHLIGHT_EMAIL`
- `HIGHLIGHT_PHONE`
- `HIGHLIGHT_ADDRESS_VI`
- `HIGHLIGHT_ADDRESS_EN`

Optional official social URLs:

- `HIGHLIGHT_FACEBOOK_URL`
- `HIGHLIGHT_INSTAGRAM_URL`
- `HIGHLIGHT_TIKTOK_URL`
- `HIGHLIGHT_YOUTUBE_URL`
- `HIGHLIGHT_VIMEO_URL`
- `HIGHLIGHT_LINKEDIN_URL`
- `HIGHLIGHT_BEHANCE_URL`

Hero Media:

- `HIGHLIGHT_HERO_MEDIA_ID`: existing Payload Media image used for image mode.
- `HIGHLIGHT_HERO_VIDEO_URL`: external HTTP(S) video URL owned/approved by Highlight.
- `HIGHLIGHT_HERO_POSTER_MEDIA_ID`: existing Payload Media poster required with the
  external video URL.

Video mode is preferred only when both URL and poster resolve. Otherwise a valid Hero
image is used. With neither option, Homepage remains a draft even when
`SEED_PUBLISH=true`.

Verified Statistics:

- `HIGHLIGHT_YEARS_EXPERIENCE`
- `HIGHLIGHT_PROJECTS_DELIVERED`
- `HIGHLIGHT_CLIENTS_COUNT`

Statistics stays disabled unless all three values are present, whole, and
non-negative. The seeder never supplies placeholder achievements.

Environment parsing rejects invalid email, phone, HTTP(S) URL, Media ID, boolean, and
numeric values. It also rejects the known third-party domain, social identifier, and
analytics identifier listed in the original reference request.

## Preparing Media

The seeder only reads Media already stored by Payload. It does not import
`seed-assets`, fetch remote URLs, write base64 data, or bypass Media validation.

1. Upload Hero/About/category images through `/admin`.
2. Enter localized Media alt text.
3. Put About candidates in Media folder `homepage` or `projects`. The seeder selects
   up to eight, preferring `homepage`.
4. Set Hero image/poster IDs through environment variables.
5. For a category cover, use one of these exact conventions:
   - internal title: `Highlight category <slug>`
   - internal title: `Category <slug>`
   - filename before Payload's unique suffix: `<slug>-cover`

Example for Events:

```text
internalTitle = Highlight category events
filename      = events-cover-8f31c2ab.webp
```

Category images are only searched in Media folder `projects`. A category without a
matching cover remains a draft when publish mode is requested.

## Commands

Dry-run against the configured database:

```bash
npm run seed:content:dry
```

Create drafts:

```bash
npm run seed:content
```

On a fresh database, create valid documents as published while leaving incomplete
Homepage/categories as drafts:

```bash
SEED_PUBLISH=true npm run seed:content
```

Publish or update records that were created by an earlier draft run. This is a force
update, so take and verify a backup first:

```bash
SEED_FORCE=true SEED_PUBLISH=true npm run seed:content
```

Force-update the seeder-owned records but keep the resulting versions as drafts:

```bash
SEED_FORCE=true npm run seed:content
```

Combine flags for a read-only report when needed:

```bash
SEED_DRY_RUN=true SEED_FORCE=true SEED_PUBLISH=true npm run seed:content
```

Inside the application container:

```bash
docker compose exec app npm run seed:content:dry
docker compose exec app npm run seed:content
```

The seeder is never called by `start:prod`, migrations, or container startup.

## Draft and publish behavior

- The default writes draft versions for all new seed records.
- Site Settings, Header, and Footer can publish without Media when publish mode is
  explicitly enabled.
- Homepage publishes only when a valid Hero image or video-plus-poster resolves.
- A Project Category publishes only when it has a valid cover image.
- Clients and Stories stay disabled until real items exist.
- Featured Projects stays disabled when no published/enabled Project exists.
- English fields are written separately while retaining the same array-row IDs as
  Vietnamese fields, preserving Payload localization.
- Public requests cannot read seed drafts under the existing access rules.

Homepage canonical fields are intentionally left empty. The existing SEO layer
builds `/vi` and `/en` canonical/hreflang URLs from `NEXT_PUBLIC_SITE_URL`, avoiding a
single non-localized canonical value shared by both locales.

## Idempotency report

Every run prints JSON with:

- `created`
- `updated`
- `skipped`
- `missingAssets`
- `drafts`
- `published`
- `errors`

Globals are considered existing when Payload returns persisted timestamps. Project
Categories are matched by stable slug. A second default run reports them as skipped.
No delete operation exists in the seeder.

## Verifying content

1. Run dry-run and review `missingAssets`.
2. Create drafts and open `/admin`.
3. Review Site Settings, Header, Footer, Homepage, and all nine categories.
4. Switch the Payload content locale between **Tiếng Việt** and **English**.
5. Confirm Media alt text and relationships.
6. Preview Homepage in both locales.
7. Publish only after all facts, links, images, and rights are confirmed.
8. Verify `/vi`, `/en`, `/vi/du-an`, and `/en/projects`.

The shared URL resolver maps the seed value `/projects` to `/vi/du-an` for Vietnamese
and `/en/projects` for English, including Header and Footer links.

## Troubleshooting

### Homepage remains a draft

Check `HIGHLIGHT_HERO_MEDIA_ID`, or provide both
`HIGHLIGHT_HERO_VIDEO_URL` and `HIGHLIGHT_HERO_POSTER_MEDIA_ID`. Confirm the referenced
documents exist in Media and are images.

### Category remains a draft

Move its cover to Media folder `projects` and use the exact internal-title or filename
convention above. Rerun with `SEED_FORCE=true` only after reviewing the existing
category and taking a backup.

### Contact, social, or Statistics is empty

Empty fields are intentional. Supply verified environment values and force-update
after review. Never insert copied third-party details just to fill the layout.

### Existing content is skipped

This is the safe default. Use Admin for ordinary editorial changes. Use
`SEED_FORCE=true` only when deliberately restoring the canonical seed baseline.

### Validation fails

Review the Zod error printed by `payload run`. Boolean flags accept only
`true`, `false`, `1`, or `0`; URLs must be HTTP(S); numeric values must be
non-negative integers.

## Backup reminder

PostgreSQL contains metadata and localized content. `UPLOADS_HOST_PATH` contains the
actual Media files. A complete backup requires both resources from the same
maintenance window. Database-only backup is not sufficient.
