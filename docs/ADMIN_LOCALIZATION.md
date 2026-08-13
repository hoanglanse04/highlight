# Payload Admin localization

Payload Admin uses Vietnamese as its only interface language. This setting is
independent from CMS content localization and public website localization.

## Three independent language layers

| Layer | Configuration | Behavior |
| --- | --- | --- |
| Payload Admin interface | `i18n` in `src/payload.config.ts` | Fixed to the official Payload Vietnamese language bundle |
| CMS-authored content | `localization` in `src/payload.config.ts` | Editors switch between `vi` and `en`; English falls back to Vietnamese |
| Public website UI | `next-intl` in `src/i18n` and `messages` | Vietnamese at `/vi`, English at `/en`; `/` redirects to `/vi` |

The Admin language setting does not remove or rename the Payload content-locale
selector. Selecting **Tiếng Việt** or **English** changes the localized field values
being edited, not the language of Admin buttons and navigation.

## Configuration

Payload 3.86 exports its official Vietnamese dictionary from `payload/i18n/vi`.
The root configuration uses:

```ts
i18n: {
  fallbackLanguage: 'vi',
  supportedLanguages: {
    vi,
  },
}
```

Keeping only `vi` in `supportedLanguages` makes the Admin interface consistently
Vietnamese and sets the Admin document language to `vi`. The separate
`localization.locales` list remains `vi` and `en`, with `vi` as the default and
fallback locale.

Project-owned collection names, Global names, field labels, descriptions, select
options, tabs, accordions, and custom validation messages are written in Vietnamese.
Technical names such as URL, SEO, Open Graph, Media, Hero, slug, HTTP(S), YouTube,
Vimeo, and locale codes retain their familiar forms where translating them would
reduce clarity.

## Editorial workflow

1. Sign in at `/admin`; the Admin shell and system actions appear in Vietnamese.
2. Choose **Tiếng Việt** in the content-locale selector and edit Vietnamese values.
3. Choose **English** in the same selector and edit English values.
4. Save a draft or publish using the Vietnamese Admin controls.
5. Verify published content at `/vi` and `/en`.

If an English localized value is empty, Payload falls back to Vietnamese. URLs,
email, phone, dates, numbers, slugs, flags, ordering, and relationships remain shared
between locales.

## Limitations

Payload's official Vietnamese dictionary covers the core Admin, authentication,
draft/version, upload, and Lexical interfaces. A browser-native message or a string
owned by a third-party component may remain in its upstream language when Payload
does not expose a translation key. Do not edit generated files or `node_modules` to
override such strings.

