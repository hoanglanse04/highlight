export function ProjectEmptyState({
  description,
  title,
}: {
  description?: string
  title: string
}) {
  return (
    <div className="border border-border bg-surface px-6 py-16 text-center sm:px-10">
      <p className="font-heading text-2xl font-semibold tracking-[-0.035em]">
        {title}
      </p>
      {description ? (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
          {description}
        </p>
      ) : null}
    </div>
  )
}
