# Phase 2 — Media Management

## Scope and architecture

Phase 2 adds the Payload `media` upload collection only. Homepage globals, Projects, Categories, Posts, contact forms, block builders, object storage, and large video uploads remain out of scope.

Each Media document has two parts:

- PostgreSQL stores localized metadata, technical image metadata, filenames, dimensions, generated-size records, and timestamps.
- `UPLOADS_HOST_PATH` stores the original image and generated files. No file data, base64, or binary blob is stored in PostgreSQL.

The canonical file URL stored by Payload is:

```text
/api/media/file/<unique-filename>
```

Caddy proxies this URL to the application. Payload checks the collection `read` rule, streams the file from disk, and returns public immutable cache headers. Application code must use the `url` and `sizes.*.url` values returned by Payload.

`/app/public/uploads` is the persistent storage mount, not the public URL contract. Next.js production builds do not dynamically add files created after build to the static `public` manifest, so `/uploads/<filename>` is intentionally not used. Payload's file handler is the single serving path.

## Storage paths

| Environment | Path |
| --- | --- |
| Production VPS host | `${UPLOADS_HOST_PATH}`; default `/var/www/highlight-media/uploads` |
| Application container | `/app/public/uploads` |
| Local host development | `<repository>/public/uploads` |
| Temporary multipart files | `/tmp/payload-uploads` inside the app container |

The Compose `uploads-init` service creates the mounted upload directory and applies owner `1000:1000` and mode `0750` before the non-root application starts. Files created by the application use the container user's normal umask and are not made world-writable.

For host-based development, create the directory without broad permissions:

```bash
install -d -m 0750 public/uploads
```

For a production VPS, run once if the directory is managed outside Compose:

```bash
sudo install -d -o 1000 -g 1000 -m 0750 /var/www/highlight-media/uploads
```

## Environment variables

Phase 2 adds no environment variable. It uses the existing:

| Variable | Purpose |
| --- | --- |
| `UPLOADS_HOST_PATH` | Host bind-mount path containing the real image files |
| `NEXT_PUBLIC_SERVER_URL` | Origin used by Payload to produce absolute file URLs |
| `DATABASE_URI` | PostgreSQL connection containing Media metadata |

## Media schema

Business fields:

- `internalTitle`: optional internal title, restricted to authenticated users; generated from the original filename when omitted.
- `alt`: required localized text (`vi`, `en`).
- `caption`: optional localized textarea (`vi`, `en`).
- `credit`: optional non-localized text.
- `tags`: optional array of up to 30 text tags.
- `folder`: `homepage`, `projects`, `clients`, `stories`, `team`, or `general`.
- `usageNotes`: optional internal textarea, hidden from unauthenticated API reads.

Payload supplies `filename`, `mimeType`, `filesize`, `width`, `height`, `url`, `thumbnailURL`, focal-point coordinates, generated sizes, `createdAt`, and `updatedAt`.

The `folder` value is organizational metadata. It does not move files into physical subdirectories, which keeps Payload's local file handler and deletion behavior straightforward.

### Localized alt limitation

`alt` is `localized: true` and `required: true`. Payload validates the locale currently being edited. A new upload created under the default `vi` locale therefore requires Vietnamese alt text. Switch the Admin locale to `en` and add English alt text afterward. English reads fall back to Vietnamese until that translation is entered.

Requiring both locales in the initial single-locale upload form would require custom Admin UI and is intentionally deferred. Operational review should treat a missing English value as incomplete content even though fallback remains available.

## Accepted files and validation

Accepted MIME types:

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`

GIF is not enabled because animated processing and storage are unnecessary for the current portfolio scope. SVG is not enabled because there is no sanitize workflow in Phase 2.

Maximum file size is 15 MiB (`15 * 1024 * 1024` bytes). Oversized multipart requests abort with HTTP 413.

Validation runs server-side:

1. The declared MIME must be in the allowlist.
2. Sharp must decode the image successfully within the input-pixel limit.
3. The decoded format must match the declared MIME.
4. Payload performs its own buffer-based file-type validation against the allowlist.

Remote URL paste/upload is disabled. Script, executable, HTML, PHP, SVG, and disguised non-image uploads are rejected.

## Filename policy

The server ignores client path components and builds the filename from a normalized basename:

1. Remove directory components.
2. Convert Vietnamese characters to ASCII where possible.
3. Lowercase and convert separators to hyphens.
4. Use the canonical extension detected by Sharp.
5. Append eight random hexadecimal characters.
6. Let Payload check the database and filesystem for any remaining collision.

Example:

```text
Ảnh Dự Án Mới.JPG -> anh-du-an-moi-8f31c2ab.jpg
```

This policy prevents traversal and overwrites and makes one-year `immutable` cache headers safe.

## Generated image sizes

The original image is retained without format conversion. Generated files preserve aspect ratio and original format.

| Name | Width | Upscale |
| --- | ---: | --- |
| `thumbnail` | 400 px | No |
| `small` | 768 px | No |
| `medium` | 1280 px | No |
| `large` | 1920 px | No |

Payload uses `thumbnail` for Admin previews. Focal point and crop controls remain available, but the default generated widths do not apply a fixed crop.

## Access matrix

| Actor | Read metadata/files | Create | Update | Delete |
| --- | --- | --- | --- | --- |
| Super admin | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | Yes | Yes |
| Viewer | Yes | No | No | No |
| Unauthenticated | Yes, except internal fields | No | No | No |

`internalTitle` and `usageNotes` are excluded from unauthenticated API responses by field access control. Public file access is intentional because these images will be used by the public website.

## Upload verification

1. Log in at `/admin` as a super admin or editor.
2. Open Content → Media.
3. Select the `vi` locale and upload an accepted image with Vietnamese alt text.
4. Confirm the original and four generated sizes appear in the document.
5. Open the returned Payload `url` in a private browser window and expect HTTP 200.
6. Switch to `en`, add English `alt` and optional `caption`, then save.
7. Confirm a viewer can browse Media but cannot create, update, or delete it.

To inspect files on the VPS:

```bash
find "$UPLOADS_HOST_PATH" -maxdepth 1 -type f -printf '%f %s bytes\n'
```

## Migration procedure

The application production entrypoint runs all pending Payload migrations before starting Next.js.

Manual status and migration:

```bash
npm run payload -- migrate:status
npm run payload:migrate
```

For Compose:

```bash
docker compose run --rm app npm run payload:migrate
docker compose up -d app
```

Do not edit or delete the Phase 1 migration. The Phase 2 migration only adds Media tables, localized metadata, generated-size columns, and the Media lock relationship.

## Backup and restore

A PostgreSQL backup alone is not a Media backup. Always back up both resources in the same maintenance window:

1. PostgreSQL: Media metadata and file references.
2. `UPLOADS_HOST_PATH`: original images and generated sizes.

Example backup:

```bash
pg_dump "$DATABASE_URI" --format=custom --file=highlight-database.dump
sudo tar -C /var/www/highlight-media -czf highlight-uploads.tar.gz uploads
```

Example restore into an empty, prepared environment:

```bash
pg_restore --dbname="$DATABASE_URI" --clean --if-exists highlight-database.dump
sudo tar -C /var/www/highlight-media -xzf highlight-uploads.tar.gz
sudo chown -R 1000:1000 /var/www/highlight-media/uploads
sudo chmod 0750 /var/www/highlight-media/uploads
```

Coordinate restore time so database rows and files come from matching backups. After restore, sample several original and generated URLs before reopening Admin editing.

## Troubleshooting

### Sharp or generated sizes fail

- Confirm `sharp` is installed as a production dependency: `npm ls sharp`.
- Confirm the running image is the Node 22 Alpine image built by this repository, not a host `node_modules` bind mount.
- Check `docker compose logs app` for decoder, pixel-limit, or permission errors.
- Rebuild without reusing host dependencies: `docker compose build app`.
- Test with a known-valid JPEG or PNG larger than 1920 px.

### Permission denied

- Run `docker compose run --rm uploads-init`.
- Verify the host directory owner is UID/GID `1000:1000` and mode `0750`.
- Verify `UPLOADS_HOST_PATH` resolves to the intended explicit directory before changing ownership.
- Do not fix permissions with `chmod 777`.

### Database row exists but file is missing

- Verify the bind mount is present in `docker compose config`.
- Check that the correct VPS directory was mounted after deployment or restore.
- Restore the matching uploads backup; recreating metadata does not recreate image bytes.

### Upload returns 400 or 413

- HTTP 413 means the image exceeds 15 MiB.
- HTTP 400 indicates a disallowed/incorrect MIME, decode failure, MIME/content mismatch, missing localized alt, or unsupported SVG/GIF.

## Remaining limitations

- English alt text is required when editing English but is not forced in the initial Vietnamese upload transaction.
- There is no automatic translation, image deduplication by content hash, malware scanner, or SVG sanitizer.
- Existing Media files are public; per-document private media is not implemented.
- Folder selection is metadata only, not a physical directory hierarchy.
- Backup automation and retention scheduling remain a deployment concern; Phase 2 documents but does not install cron jobs.
