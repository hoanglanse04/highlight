import { getEnabledItems } from '@/lib/content/homepage'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'projectFacts' }
>

export function ProjectFactsBlock({
  block,
  project,
  title,
}: {
  block: Block
  project: PublicProject
  title: string
}) {
  const facts = getEnabledItems(
    block.source === 'custom' ? block.customFacts : project.projectFacts,
  )
  if (!facts.length) return null

  return (
    <section className="project-block mx-auto max-w-6xl px-5 sm:px-8">
      <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
        {title}
      </h2>
      <dl className="mt-8 grid gap-px bg-border sm:grid-cols-2">
        {facts.map((fact) => (
          <div className="bg-surface p-5 sm:p-7" key={fact.id ?? fact.label}>
            <dt className="text-[0.65rem] font-bold tracking-[0.16em] text-brand uppercase">
              {fact.label}
            </dt>
            <dd className="mt-3 text-base leading-7">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
