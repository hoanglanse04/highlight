import { Container } from '@/components/ui/Container'

export function HomepageEmptyState({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <main
      className="grid min-h-screen place-items-center px-5"
      id="main-content"
    >
      <Container className="text-center">
        <p className="section-eyebrow">{title}</p>
        <p className="mx-auto mt-4 max-w-xl text-muted">{description}</p>
      </Container>
    </main>
  )
}
