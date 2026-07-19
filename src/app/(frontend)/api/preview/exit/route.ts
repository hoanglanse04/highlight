import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

const allowedExitPaths = new Set(['/vi', '/en'])

export async function GET(request: Request): Promise<Response> {
  const path = new URL(request.url).searchParams.get('path') ?? '/vi'

  if (!allowedExitPaths.has(path)) {
    return new Response('Invalid preview exit path.', { status: 400 })
  }

  const draft = await draftMode()
  draft.disable()
  redirect(path)
}
