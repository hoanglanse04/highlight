import { serializeJsonLd } from '@/lib/projects/structuredData'

export function ProjectJsonLd({ data }: { data: unknown }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  )
}
