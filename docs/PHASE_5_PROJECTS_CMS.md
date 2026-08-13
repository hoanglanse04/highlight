# Phase 5 — Projects CMS

Phase 5 adds the structured project authoring system only. Public project listing,
category, detail, and filter pages remain Phase 6 work.

## Architecture

- `project-categories` owns localized taxonomy and category SEO.
- `projects` owns localized project content, categorization, media, structured detail
  blocks, SEO, publishing state, and related projects.
- All images are relationships to `media`; no extra upload field or object storage was
  introduced.
- Project video fields store supported external URLs only: YouTube, Vimeo, direct MP4,
  or direct WebM.
- Server Components can use `src/lib/payload/projects.ts`; client components must not
  query Payload directly.

## Collections and fields

### Project Categories

Admin group: **Projects**. The title shown in Admin is `internalName`.

- Basic: `internalName`, localized `title`, shared `slug`, localized
  `shortDescription`, localized rich-text `fullDescription`, and whitelisted `iconKey`.
- Media: required `coverImage`, optional `heroImage`, optional `heroVideoURL`.
- SEO: localized title/description/OG text, Media OG image, `noIndex`, canonical URL.
- Publishing: `enabled`, `featured`, and non-negative `displayOrder`.
- Internal: `adminNotes`, readable only by authenticated users.
- Drafts, autosave, versions, restore; at most 30 versions per document.

`projectCount` is intentionally not persisted. Phase 6 can calculate it with a count
query so it cannot become stale.

### Projects

Admin group: **Projects**. The form is split into Basic Information, Categorization,
Hero Media, Gallery, Project Facts, Content, Relationships, SEO, Publishing, and
Internal Notes.

- Basic: `internalName`, localized `title`, shared `slug`, localized `subtitle`,
  required localized `shortDescription`, localized rich-text `introduction`, client,
  artist, year, project date, and localized location.
- Categorization: required `primaryCategory`, up to five non-duplicate
  `secondaryCategories`, and up to 10 embedded localized service labels.
- Hero/card media: required cover image; optional card poster; optional
  `hoverPreviewVideoURL`; image or external-video hero with conditional required
  image/video poster/URL validation. The hover preview accepts YouTube, Vimeo, direct
  MP4, or WebM independently from the Hero media choice.
- Gallery: up to 50 Media relationships with localized caption, credit, and order.
- Facts/statistics: up to 20 ordered localized facts and 20 non-negative numeric
  statistics.
- Content: up to 40 blocks from the fixed whitelist below.
- Relationships: up to eight projects, no self-reference, population depth capped.
- Publishing: `featured`, non-negative `featuredOrder`, `enabled`, and `displayOrder`.
- SEO and internal notes follow the same behavior as categories.
- Drafts, autosave, versions, restore; at most 50 versions per document.

## Content block whitelist

1. `richText`: localized Lexical content, fixed width and alignment choices.
2. `fullWidthImage`: Media image, localized alt override/caption, credit, fixed aspect
   and fit choices.
3. `twoColumnImages`: two Media images, localized captions, fixed ratio/mobile order.
4. `imageGallery`: localized heading, grid/masonry/filmstrip, 2–4 columns, at most 30
   ordered Media images.
5. `externalVideo`: supported URL, required poster, fixed aspect ratio and playback
   flags; autoplay requires muted.
6. `quote`: localized quote/role, author, optional Media portrait.
7. `projectFacts`: use the project-level facts or an ordered custom override.
8. `statistics`: use the project-level statistics or an ordered custom override.
9. `textImage`: localized rich text plus Media image and whitelisted presentation
   choices.
10. `relatedProjects`: automatic strategy or up to eight manual projects, with
    self-reference rejected.

There are no raw HTML, CSS, color, component-name, or arbitrary block fields. Rich
text uses the configured Payload Lexical editor and is stored as structured JSON.

## Localization

Displayed editorial text is localized for `vi` and `en`. URLs, slugs, numeric values,
dates, brand/client names, flags, ordering, and relationships are shared. English
falls back to Vietnamese through the root Payload localization configuration.
Publication status is shared by both locales; experimental `localizeStatus` is not
enabled.

## Slug strategy

Both locale URLs use one slug. On create, a missing slug is generated from
`internalName` (or title as fallback), stripped to ASCII, lowercased, converted to
kebab-case, and capped at 120 characters. Payload/PostgreSQL enforce uniqueness.

The reserved values are `admin`, `api`, `vi`, `en`, `projects`, `du-an`, `preview`,
`health`, `uploads`, `login`, `new`, and `edit`. Traversal and punctuation cannot pass
the slug validator.

Once a document exists, title changes do not rewrite its slug. An editor may change it
explicitly, but Phase 5 has no Redirect collection: changing a published slug breaks
the old URL. `previousSlugs` is not stored yet.

## Access matrix

| Actor | Read documents | Read drafts/versions | Create | Update/publish/restore | Delete |
| --- | --- | --- | --- | --- | --- |
| super-admin | Yes | Yes | Yes | Yes | Yes |
| editor | Yes | Yes | Yes | Yes | Yes |
| viewer | Yes | Yes | No | No | No |
| public | Published only | No | No | No | No |

Collection-level access enforces these rules. Public list/detail helpers additionally
require `enabled=true`. They omit `internalName` and `adminNotes`. Draft helpers throw
unless supplied an authenticated Payload request and still use `overrideAccess:false`.

## Drafts, versions, and Admin workflow

1. Create and publish at least one category with a Media cover.
2. Create a project, select its primary category, enter both locales, and select Media.
3. Choose an image hero, or choose external video and provide a supported URL and
   poster. Add only the fixed content blocks needed by the case study.
4. **Save Draft** stores an authenticated preview/version only. **Publish** makes the
   document readable publicly; set `enabled=false` to suppress it in public helpers.
5. Open the Versions view, choose a historical version, and restore it. Restoring does
   not bypass the editor/viewer access rules.

Autosave runs every 2000 ms with draft validation disabled so an incomplete work in
progress can be saved. Publish operations still receive server field validation.

## Preview

Category previews target `/vi/du-an?category=<slug>` or
`/en/projects?category=<slug>`. Project previews target the corresponding planned
detail URL. `/api/preview` compares `PREVIEW_SECRET` timing-safely, authenticates the
Payload user, validates an exact route/slug allowlist, enables Next Draft Mode, and
redirects internally. External origins, extra query keys, traversal, and unsafe slugs
are rejected.

Phase 5 intentionally does not create those frontend routes, so the final redirect can
show a 404 until Phase 6. The preview entrypoint and Draft Mode cookie are already
ready and protected. Public requests never gain draft access.

## Revalidation

Published changes and deletes invalidate `/vi`, `/en`, both future project listings,
the old/current project detail paths, and the `projects`, `project-categories`, and
`homepage` tags. Project/category slug tags and the primary category tag are also
invalidated. Autosave and ordinary draft updates return before invalidation. Hooks use
Next cache APIs directly and make no internal HTTP request.

## Typed data helpers

`src/lib/payload/projects.ts` exports:

- `getProjectCategories`
- `getProjectCategoryBySlug`
- `getProjects`
- `getProjectBySlug`
- `getFeaturedProjects`
- `getRelatedProjects`
- `getProjectsByCategory`

They use Payload Local API, generated types, `vi` fallback, controlled depth,
pagination, backend filters, and a closed sort enum (`newest`, `oldest`, `title`,
`displayOrder`, `featuredOrder`). Card queries select only card fields and do not load
content blocks.

## Homepage compatibility and Phase 6 migration

No embedded Homepage item was removed. Featured Projects now has `sourceMode`,
`selectedProjects`, `collectionLimit`, and `collectionFilterFeatured`; Project
Categories has `sourceMode`, `selectedCategories`, and `collectionLimit`.

The migration defaults both modes to `manualEmbedded`, including existing Homepage
rows and versions. Phase 4 components render the old embedded arrays in this mode and
return no collection output when an administrator deliberately chooses collection
mode. Phase 6 should implement collection rendering, map legacy embedded records to
real documents, verify URLs/media, select them in Homepage, then change `sourceMode`.
Do not delete embedded records until that migration is verified and separately scoped.

## Migration

Run:

```bash
npm run payload:migrate
npm run generate:types
npm run generate:importmap
```

`20260722_085138_phase_5_projects_cms` creates Project/Category document, localization,
version, block, and relationship tables and extends Homepage. Phase 1–3 migrations are
unchanged. The generated foreign keys use `ON DELETE SET NULL` for Media: deleting an
in-use image does not cascade-delete a project, but a previously required relationship
becomes empty and must be repaired before the next valid publish. Admins should check
usage before deleting Media.

## Backup and restore

Project metadata, localized text, block JSON/table rows, relationships, and versions
are in PostgreSQL. Image binaries remain under `UPLOADS_HOST_PATH`. A PostgreSQL dump
alone is not a complete backup. Back up the database and uploads directory as one
consistent set, and restore both before validating project relationships and public
URLs. Phase 5 adds no cron or new binary storage.

## Current limitations and Phase 6 plan

- No public project/category/list/filter route or metadata renderer exists yet.
- Homepage collection source mode is schema-ready but not rendered by Phase 4.
- Category counts and automatic related-project resolution are deferred to Phase 6.
- Slug redirects/history and Media usage tracking are not implemented.
- Publication status is not per-locale.
- No seed is installed; initial categories are entered manually to avoid overwriting
  user data.
- There is no video upload, object storage, search engine, Blog, CRM, or free-form page
  builder.

Phase 6 should consume the typed helpers, implement listing/category/detail pages,
resolve automatic related projects, render the fixed blocks safely, build metadata,
and switch Homepage collection modes only after content migration is reviewed.
