/* THIS FILE FOLLOWS THE PAYLOAD-GENERATED APP ROUTER CONTRACT. */
import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'

import { importMap } from '../importMap'

type AdminNotFoundProps = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({
  params,
  searchParams,
}: AdminNotFoundProps): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default function AdminNotFound({ params, searchParams }: AdminNotFoundProps) {
  return NotFoundPage({ config, params, searchParams, importMap })
}
