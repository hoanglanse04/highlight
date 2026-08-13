import { Container } from '@/components/ui/Container'

export function MaintenanceScreen({
  message,
  siteName,
  title,
}: {
  message: string
  siteName: string
  title: string
}) {
  return (
    <main
      className="grid min-h-screen place-items-center px-5"
      id="main-content"
    >
      <Container className="max-w-3xl text-center">
        <p className="section-eyebrow">{siteName}</p>
        <h1 className="font-heading text-4xl font-bold tracking-[-0.05em] uppercase sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-base leading-7 text-muted sm:text-lg">
          {message}
        </p>
      </Container>
    </main>
  )
}
