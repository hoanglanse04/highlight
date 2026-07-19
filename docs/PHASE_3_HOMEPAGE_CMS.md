# Phase 3 — Homepage CMS, Header, Footer, and Site Settings

## Scope

Phase 3 adds four fixed Payload Globals and server-side data access for a future homepage frontend. It does not add Projects, Categories, Posts, ContactRequests, a free-form page builder, final frontend design, object storage, video uploads, email, or analytics execution.

The Globals appear in this order under the Payload Admin `Website` group:

1. Homepage
2. Header
3. Footer
4. Site Settings

Every Global is a singleton backed by PostgreSQL. Images are relationships to the existing `media` collection; Globals never create files or accept image URLs.

## Global schemas

### Homepage

- `seo`: localized meta/OG title and description, Media OG image, no-index flag, and validated canonical HTTP(S) URL.
- `hero`: enabled flag, localized heading, image or external-video mode, Media background/poster, validated external video URL, two localized CTAs, and scroll-indicator flag.
- `about`: localized heading/highlight, main Media image, Media gallery (maximum 8), and localized CTA.
- `featuredProjects`: fixed section heading and temporary embedded items (maximum 12). Items retain stable frontend-oriented names such as `title`, `coverImage`, `previewImage`, `link`, `enabled`, and `displayOrder` so a later Project relationship can replace the data source.
- `projectCategories`: temporary embedded homepage cards (maximum 12); no Categories collection is created.
- `services`: embedded services (maximum 12) with a whitelisted `iconKey` and optional Media image.
- `statistics`: numeric non-negative integer values with prefix/suffix and localized labels (maximum 12).
- `clients`: brand name, required Media logo, validated website URL, enabled/order (maximum 30).
- `stories`: temporary embedded stories (maximum 12); no Posts collection is created.
- `contactCTA`: localized CTA content, optional Media background, email, validated phone, and localized address. Social links deliberately remain in Site Settings.

Every homepage section has `enabled`, localized `eyebrow`, `title`, and `description` fields. Hero title is required for the locale being published. Long sections are collapsed by default in Admin. There are no block, raw HTML, CSS class, color, font, spacing, grid, animation, or arbitrary component fields.

### Header

- Media relationships: `logoLight`, `logoDark`.
- Behavior: `sticky`, `transparentOnHero`, `showLanguageSwitcher`.
- Navigation: maximum 10 items with internal name, localized label, validated internal/external URL, new-tab flag, enabled flag, and non-negative display order.
- Optional CTA group with localized label and validated URL.

### Footer

- Media logo and optional Media background.
- Localized short description and copyright.
- Maximum 6 navigation columns, each with localized title and maximum 12 localized links.
- Contact email, validated phone, and localized address.
- Social links are not duplicated here; frontend code should read them from Site Settings.

### Site Settings

- Brand: non-localized brand/legal names, `vi/en` default locale, read-only `vi` fallback locale, and Media favicon/default OG/logo mark.
- Contact: email, validated phone, and localized address.
- Social links: maximum 12 entries using `facebook`, `instagram`, `tiktok`, `youtube`, `vimeo`, `linkedin`, `behance`, or `other`.
- SEO defaults: localized title and description.
- System: maintenance flag, localized maintenance message, and validated default contact CTA URL.

No secrets or executable analytics configuration belong in Site Settings.

## Localization

Payload localization remains:

- default locale: `vi`
- locales: `vi`, `en`
- English fallback: `en -> vi`

All administrator-authored display copy is localized: eyebrow, title, description, label, subtitle, excerpt, address, SEO text, maintenance message, navigation copy, CTA copy, and copyright.

URLs, email, phone, year, numeric values, Media relationships, enabled flags, display order, internal names, client/brand names, and system selectors are not localized.

Payload validates required localized fields in the locale currently being edited. Editors should review both locale tabs before publishing. Because per-locale publication status is experimental in Payload 3.86, Phase 3 uses one stable `_status` for the whole Global; English content falls back to Vietnamese when untranslated.

## Access matrix

| Actor | Read published | Read current draft | Read versions | Update/save draft | Publish/restore |
| --- | --- | --- | --- | --- | --- |
| Super admin | Yes | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | Yes | Yes | Yes |
| Viewer | Yes | Yes | Yes | No | No |
| Unauthenticated public | Yes | No | No | No | No |

The rules are configured at Global level. Public `read` is constrained to `_status = published`; `readVersions` requires authentication; `update` requires a super-admin or editor. Admin UI visibility reflects the same server rules.

## Drafts, versions, and restore

All four Globals use:

```ts
versions: {
  drafts: {
    autosave: {
      interval: 2000,
      showSaveDraftButton: true,
    },
    validate: false,
  },
  max: 30,
}
```

- Draft saves may be incomplete; publish performs normal required-field validation.
- A normal public read does not request drafts and is additionally constrained to published status.
- Autosave writes version rows without modifying the last published Global.
- Admin's Versions view can compare and restore one of the retained 30 versions.
- Restoring requires update access; viewers can inspect history but cannot restore.

## Preview behavior

Payload's Preview button links to:

```text
/api/preview?path=/vi|/en&previewSecret=<server-only secret>
```

The route:

1. accepts only `/vi` or `/en`;
2. compares `PREVIEW_SECRET` using a timing-safe comparison;
3. authenticates the current Payload session;
4. enables Next.js Draft Mode and redirects to the selected locale.

Unauthenticated requests and incorrect secrets return HTTP 403. `/api/preview/exit?path=/vi|/en` disables Draft Mode. The secret is intentionally server-only and must not use a `NEXT_PUBLIC_` prefix.

Phase 3 configures secure Draft Mode and typed data access. The current frontend remains the Foundation placeholder, so visual rendering of preview data is deferred to Phase 4.

## Server-side data access

`src/lib/payload/websiteGlobals.ts` exports:

- `getHomepage(locale, draft?)`
- `getHeader(locale, draft?)`
- `getFooter(locale, draft?)`
- `getSiteSettings(locale, draft?)`

These helpers:

- use Payload Local API in server-only code;
- return generated Payload types or `null` for an empty/unpublished Global;
- use the requested `vi/en` locale with Vietnamese fallback;
- set `overrideAccess: false`;
- authenticate the current request before honoring `draft: true`;
- never query PostgreSQL directly or expose configuration secrets to Client Components.

In Phase 4, a Server Component should read Next.js `draftMode()` and pass its `isEnabled` value to these helpers.

## Validation

- Internal links must begin with one `/`; external links must be HTTP(S).
- Canonical, external-video, website, and social URLs must be HTTP(S).
- Phone values accept a conservative set of international digits and separators.
- Array sizes are capped by schema.
- Display order and statistics values are whole numbers greater than or equal to zero.
- Years are whole numbers from 1900 through 2100.
- Hero image mode requires `backgroundImage`.
- Hero external-video mode requires both `externalVideoURL` and `posterImage`.
- SEO title and descriptions have practical maximum lengths of 70 and 170 characters.
- Required Media fields are relationships to `media`, never separate uploads.

Server-side Payload validation enforces these rules for REST, GraphQL, Local API, and Admin writes. Draft validation remains relaxed so unfinished drafts can be saved; publishing enforces the rules.

## Admin workflow

### Edit and publish Homepage

1. Log in at `/admin` as super-admin or editor.
2. Open Website → Homepage.
3. Select `vi`, complete Hero and any enabled sections, and choose images from Media.
4. Save Draft, then switch to `en` and enter translations.
5. Use Preview for the current locale.
6. Publish only after both locale tabs and Media alt text have been reviewed.

### Restore a version

1. Open the Global and choose Versions.
2. Compare the target version with the current version.
3. Restore it as a draft.
4. Review both locales and Media relationships.
5. Publish explicitly when ready.

## Environment variable

Phase 3 adds:

| Variable | Purpose |
| --- | --- |
| `PREVIEW_SECRET` | Independent server-only secret protecting the Draft Mode entry route |

Generate it independently from `PAYLOAD_SECRET`, for example with `openssl rand -base64 48`. Docker Compose passes it only to the application service.

## Migration

Phase 3 migration:

```text
20260719_110501_phase_3_homepage_cms
```

It creates the four Global tables, localized child tables, embedded-array tables, four version-table families, status/platform/icon enums, Media foreign keys, and indexes. It does not modify the Phase 1 or Phase 2 migration files and does not drop Users or Media.

Apply migrations using the existing process:

```bash
npm run payload:migrate
```

Production `npm run start:prod` continues to run pending migrations before starting Next.js. Back up PostgreSQL and `UPLOADS_HOST_PATH` together before production migration even though Phase 3 does not change image files.

## Migration path to later modules

- `featuredProjects.items` can be replaced by Project relationships while a Phase 4 adapter preserves the frontend card shape.
- `projectCategories.items` can later be replaced by Category relationships.
- `stories.items` can later be replaced by Post relationships.
- Do not create both embedded and relationship sources in the same response. The future migration should define one canonical source and convert existing rows deliberately.

## Current limitations

- Phase 3 does not render the CMS data in the final homepage design; Phase 4 owns visual integration.
- Preview enables secure Draft Mode but the placeholder page does not yet display draft Global fields.
- Publication status is document-wide, not per locale, because localized status is experimental in Payload 3.86.
- There is no seed content. Empty Globals remain unpublished and helpers return `null` until editors create and publish valid content.
- Embedded Project/Category/Story items are temporary and deliberately do not create those collections.
- There is no scheduled publishing, visual editor, custom Admin component, automatic translation, revalidation hook, analytics execution, email, or object storage in this phase.
