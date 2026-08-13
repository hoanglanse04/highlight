import { getEnabledItems } from '@/lib/content/homepage'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'statistics' }
>

export function StatisticsBlock({
  block,
  project,
  title,
}: {
  block: Block
  project: PublicProject
  title: string
}) {
  const items = getEnabledItems(
    block.source === 'custom' ? block.customItems : project.statistics,
  )
  if (!items.length) return null

  return (
    <section className="project-block mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
      <h2 className="sr-only">{title}</h2>
      <dl className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div className="bg-surface p-6 sm:p-8" key={item.id ?? item.label}>
            <dd className="font-heading text-5xl font-bold tracking-[-0.055em] text-brand sm:text-6xl">
              {item.prefix}
              {item.value}
              {item.suffix}
            </dd>
            <dt className="mt-3 text-sm leading-6 text-muted">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
