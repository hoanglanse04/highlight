import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { isAllowedPreviewPath } from '@/lib/projects/previewPaths'

export async function GET(request: Request): Promise<Response> {
  const path = new URL(request.url).searchParams.get('path') ?? '/vi'

  if (!isAllowedPreviewPath(path, true)) {
    return new Response('Invalid preview exit path.', { status: 400 })
  }

  const draft = await draftMode()
  draft.disable()
  redirect(path)
}
