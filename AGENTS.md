# Highlight repository guidance

- Keep the frontend and Payload CMS in this single Next.js App Router application.
- Use TypeScript strict mode and the `@/*` import alias.
- Keep public UI strings in `messages/vi.json` and `messages/en.json`.
- Use Payload localized fields for administrator-authored translatable content, with Vietnamese as the fallback locale.
- Do not add the Projects collection or project routes until the Project phase is explicitly requested.
- Do not store uploads as PostgreSQL binary data or inside an ephemeral container filesystem.
- Run `npm run lint`, `npm run type-check`, and `npm run build` before completing a code change.
