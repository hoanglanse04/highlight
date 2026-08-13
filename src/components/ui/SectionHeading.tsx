type SectionHeadingProps = {
  align?: 'left' | 'center'
  description?: string | null
  eyebrow?: string | null
  fallbackTitle?: string
  title?: string | null
}

export function SectionHeading({
  align = 'left',
  description,
  eyebrow,
  fallbackTitle,
  title,
}: SectionHeadingProps) {
  if (!eyebrow && !title && !description && !fallbackTitle) return null

  return (
    <header
      className={
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'
      }
    >
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {!title && fallbackTitle ? (
        <h2 className="sr-only">{fallbackTitle}</h2>
      ) : null}
      {description ? (
        <p className="section-description">{description}</p>
      ) : null}
    </header>
  )
}
