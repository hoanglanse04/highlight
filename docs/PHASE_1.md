# Phase 1 — Foundation

## Scope

This phase connects Next.js App Router, Payload CMS, PostgreSQL, Tailwind CSS and `next-intl`. It intentionally contains no Projects, Media, Homepage, Header, Footer, SiteSettings or ContactRequests schema.

## Repository architecture

```text
src/
├── app/
│   ├── (frontend)/[locale]/    # /vi and /en public routes
│   └── (payload)/              # /admin and /api
├── access/                     # Payload access-control functions
├── collections/                # Users now; Media/Projects later
├── i18n/                       # next-intl routing and request config
├── styles/                     # Tailwind and design tokens
├── blocks/                     # Reserved for future CMS blocks
├── components/                 # Shared UI components
├── features/                   # Feature-owned UI and server logic
├── globals/                    # Payload globals added in Phase 3
├── hooks/                      # Shared hooks
├── lib/                        # Server/client utilities
└── types/                      # Handwritten shared types
messages/                       # Fixed UI translations
migrations/                     # Payload/PostgreSQL migrations
public/uploads/                 # Container mount target only
```

## Packages

Runtime: Next.js, React, Payload, Payload PostgreSQL adapter, Payload Next integration, Lexical, Payload UI, `next-intl`, Tailwind CSS, Motion, Zod, React Hook Form, GraphQL and Sharp.

Tooling: TypeScript, ESLint with Next rules, PostCSS, Prettier and `cross-env`.

Motion, Zod and React Hook Form are installed because they are part of the approved stack. They are not used to implement out-of-scope homepage animation or contact forms in this phase.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | PostgreSQL connection string for host-based development |
| `PAYLOAD_SECRET` | Payload signing/encryption secret |
| `NEXT_PUBLIC_SERVER_URL` | Canonical Payload/app origin |
| `NEXT_PUBLIC_SITE_URL` | Public website origin reserved for metadata |
| `POSTGRES_DB` | Compose database name |
| `POSTGRES_USER` | Compose database user |
| `POSTGRES_PASSWORD` | Compose database password |
| `UPLOADS_HOST_PATH` | Persistent VPS upload directory |
| `DOMAIN` | Caddy site address |
| `CADDY_EMAIL` | ACME account email |

## Payload data model

Collections in Phase 1:

- `Users`: authentication plus `super-admin`, `editor`, and `viewer` roles. Public sign-up is disabled by access control. The first account is promoted to `super-admin` so a clean installation can be bootstrapped at `/admin`.

Globals in Phase 1: none.

Deferred by the agreed phases:

- Phase 2: `Media`.
- Phase 3: `Homepage`, `SiteSettings`, `Header`, and `Footer` globals.
- Later/optional: `ContactRequests`.
- Explicitly out of scope: `Projects` and project category/detail modules.

## Assumptions requiring production values

- Replace the placeholder domain and ACME email before deployment.
- Generate a unique `PAYLOAD_SECRET` and PostgreSQL password.
- Create `/var/www/highlight-media/uploads` on the VPS and make it writable by UID/GID `1000:1000` used by the Node image.
- The first user created at `/admin` is the handover owner and receives `super-admin`.
- Viewer accounts may log in to Admin, but access rules prevent user mutations. Phase 3 content schemas must reuse the role rules to make all viewer content access read-only.
- Node 22 is the production runtime; the declared minimum remains Node 20.9 because that is the framework minimum.
- An outbound email adapter is not selected. Payload writes password-reset email to the server console until an SMTP or transactional email provider is chosen.
- Cloudflare SSL mode, the real domain, Caddy ACME email, backup destination/retention automation and the initial handover administrator identity still require production decisions.

## Dependency audit note

The patched PostCSS and DOMPurify versions are pinned with package overrides. `npm audit --omit=dev` still reports five moderate entries that all trace to `esbuild@0.18` inside `drizzle-kit`, which is bundled by Payload's PostgreSQL adapter. The advisory affects esbuild's development server; this application does not expose that server. There is currently no compatible upstream fix reported by npm. Recheck when upgrading Payload.

## Local development

1. Copy `.env.example` to `.env`, replace secrets, and use a localhost `DATABASE_URI`.
2. Start PostgreSQL (locally or with Compose).
3. Run `npm install`, then `npm run dev`.
4. Open `http://localhost:3000/admin` and create the first administrator.

For local Compose, set `UPLOADS_HOST_PATH=./uploads`, set both public URLs to `http://localhost`, and set `DOMAIN=localhost`.

## Production deployment

1. Point Cloudflare DNS at the VPS and keep ports 80/443 reachable.
2. Create the upload directory and assign it to UID/GID 1000.
3. Copy `.env.example` to `.env`, use HTTPS URLs, and replace every placeholder.
4. Run `docker compose config` to validate interpolation.
5. Run `docker compose up -d --build`.

PostgreSQL persists in the `postgres_data` named volume. Uploads persist in the host bind mount configured by `UPLOADS_HOST_PATH`. Caddy certificates and runtime state persist in `caddy_data` and `caddy_config`.
