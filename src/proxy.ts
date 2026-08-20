import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

import enMessages from '../messages/en.json'
import viMessages from '../messages/vi.json'
import { isSafeProjectSlug } from '@/fields/projectSlug'
import { routing } from '@/i18n/routing'
import { getProjectsSegment } from '@/lib/projects/routes'

const intlMiddleware = createMiddleware(routing)

function notFoundResponse(locale: 'en' | 'vi'): NextResponse {
  const labels =
    locale === 'vi' ? viMessages.ProjectsUI : enMessages.ProjectsUI
  const listing = `/${locale}/${getProjectsSegment(locale)}`
  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${labels.notFoundTitle}</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:1.25rem}
main{width:min(48rem,100%);border:1px solid #2a2a2a;background:#141414;padding:clamp(2rem,7vw,5rem);text-align:center}
strong{display:block;color:#ff5c00;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase}
h1{margin:1rem 0 0;font-size:clamp(2.5rem,8vw,5.5rem);line-height:.95}
p{margin:1.5rem auto 0;max-width:36rem;color:#a0a0a0;line-height:1.7}
a{display:inline-flex;margin-top:2rem;border:1px solid #ff5c00;background:#ff5c00;color:#fff;padding:.85rem 1.25rem;font-weight:700;text-decoration:none}
a:focus-visible{outline:2px solid #fff;outline-offset:4px}
</style>
</head>
<body><main><strong>404</strong><h1>${labels.notFoundTitle}</h1><p>${labels.notFoundDescription}</p><a href="${listing}">${labels.backToProjects}</a></main></body>
</html>`

  return new NextResponse(html, {
    status: 404,
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

function projectRouteResponse(request: NextRequest): NextResponse | null {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean)
  const locale = segments[0]
  if (locale !== 'vi' && locale !== 'en') return null

  const requestedSegment = segments[1]
  const expectedSegment = getProjectsSegment(locale)
  const isKnownProjectSegment =
    requestedSegment === 'du-an' || requestedSegment === 'projects'
  if (isKnownProjectSegment && requestedSegment !== expectedSegment) {
    return notFoundResponse(locale)
  }
  if (requestedSegment !== expectedSegment) return null
  if (segments.length > 3) return notFoundResponse(locale)

  if (segments.length === 3) {
    const slug = segments[2]
    if (!isSafeProjectSlug(slug)) return notFoundResponse(locale)
  }

  return null
}

export default function proxy(request: NextRequest) {
  const response = projectRouteResponse(request)
  if (response) return response

  return intlMiddleware(request)
}

export const config = {
  matcher: '/((?!api|admin|_next|_vercel|uploads|.*\\..*).*)',
}
