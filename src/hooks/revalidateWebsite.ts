import { revalidatePath } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

export const revalidatePublishedWebsite: GlobalAfterChangeHook = ({
  doc,
  global,
  req,
}) => {
  if ((doc as { _status?: unknown } | undefined)?._status !== 'published')
    return doc

  try {
    revalidatePath('/vi', 'page')
    revalidatePath('/en', 'page')
  } catch (error) {
    req.payload.logger.warn({
      err:
        error instanceof Error ? error.message : 'Unknown revalidation error',
      global: global.slug,
      msg: 'Published website content was saved, but route revalidation failed.',
    })
  }

  return doc
}
