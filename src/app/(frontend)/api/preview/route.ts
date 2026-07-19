import { timingSafeEqual } from 'node:crypto'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, type PayloadRequest } from 'payload'

import { isAuthenticated } from '@/access/users'
import config from '@payload-config'

const allowedPreviewPaths = new Set(['/vi', '/en'])

function matchesSecret(received: string | null, expected: string | undefined): boolean {
  if (!received || !expected) return false

  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  )
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path || !allowedPreviewPaths.has(path)) {
    return new Response('Invalid preview path.', { status: 400 })
  }

  if (!matchesSecret(searchParams.get('previewSecret'), process.env.PREVIEW_SECRET)) {
    return new Response('Preview is not authorized.', { status: 403 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({
    headers: request.headers,
    req: request as unknown as PayloadRequest,
  })

  if (!isAuthenticated(user)) {
    const draft = await draftMode()
    draft.disable()
    return new Response('Preview requires an authenticated Payload user.', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
