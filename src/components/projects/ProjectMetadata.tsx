import type { PublicProject } from '@/lib/payload/projects'
import type { ProjectCategory } from '@/payload-types'

type MetadataItem = {
  label: string
  value: string
}

function categoryName(value: number | ProjectCategory): string | null {
  return typeof value === 'object' ? value.title : null
}

export function ProjectMetadata({
  labels,
  locale,
  project,
}: {
  labels: {
    artist: string
    category: string
    client: string
    date: string
    location: string
    secondaryCategories: string
    services: string
    year: string
  }
  locale: 'en' | 'vi'
  project: PublicProject
}) {
  const secondary = (project.secondaryCategories ?? [])
    .map(categoryName)
    .filter((value): value is string => Boolean(value))
    .join(', ')
  const services = (project.services ?? []).map((service) => service.label).join(', ')
  const items: Array<MetadataItem | null> = [
    project.clientName ? { label: labels.client, value: project.clientName } : null,
    project.artistName ? { label: labels.artist, value: project.artistName } : null,
    categoryName(project.primaryCategory)
      ? { label: labels.category, value: categoryName(project.primaryCategory)! }
      : null,
    secondary ? { label: labels.secondaryCategories, value: secondary } : null,
    project.year ? { label: labels.year, value: String(project.year) } : null,
    project.projectDate
      ? {
          label: labels.date,
          value: new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
            new Date(project.projectDate),
          ),
        }
      : null,
    project.location ? { label: labels.location, value: project.location } : null,
    services ? { label: labels.services, value: services } : null,
  ]

  const visible = items.filter((item): item is MetadataItem => Boolean(item))
  if (!visible.length) return null

  return (
    <dl className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
      {visible.map((item) => (
        <div className="bg-surface p-5 sm:p-6" key={item.label}>
          <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-brand uppercase">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm leading-6 text-white/85">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
