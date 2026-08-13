import { headers } from 'next/headers'
import { getPayload, type PayloadRequest } from 'payload'

import { isAuthenticated } from '@/access/users'
import config from '@payload-config'

export type ProjectPreviewContext = {
  draft: boolean
  request?: PayloadRequest
}

export async function getProjectPreviewContext(
  draftModeEnabled: boolean,
): Promise<ProjectPreviewContext> {
  if (!draftModeEnabled) return { draft: false }

  const requestHeaders = await headers()
  const request = { headers: requestHeaders } as unknown as PayloadRequest
  const payload = await getPayload({ config })
  const { user } = await payload.auth({
    headers: requestHeaders,
    req: request,
  })

  if (!isAuthenticated(user)) return { draft: false }
  request.user = user
  request.payload = payload

  return { draft: true, request }
}
