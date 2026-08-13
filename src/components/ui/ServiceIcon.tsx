import type { Homepage } from '@/payload-types'

type Service = NonNullable<NonNullable<Homepage['services']>['items']>[number]
type IconKey = NonNullable<Service['iconKey']>

const paths: Record<IconKey, React.ReactNode> = {
  video: (
    <>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="m17 9 4-2v10l-4-2" />
    </>
  ),
  camera: (
    <>
      <path d="M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </>
  ),
  editing: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="M8 5v14M16 5v14M4 9h4M16 9h4M4 15h4M16 15h4" />
    </>
  ),
  drone: (
    <>
      <path d="M8 9h8l2 6H6l2-6Z" />
      <path d="M8 9 5 6M16 9l3-3M3 6h4M17 6h4M12 15v3" />
    </>
  ),
  event: (
    <>
      <path d="M5 4v3M19 4v3M4 8h16v12H4z" />
      <path d="m8 14 2 2 5-5" />
    </>
  ),
  creative: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M8.2 15.5A7 7 0 1 1 15.8 15.5C15 16.2 15 17 15 18H9c0-1 0-1.8-.8-2.5Z" />
    </>
  ),
  social: (
    <>
      <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="m11 10 2 3" />
    </>
  ),
  livestream: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" />
    </>
  ),
}

export function ServiceIcon({ iconKey }: { iconKey?: IconKey | null }) {
  if (!iconKey || !paths[iconKey]) return null

  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      {paths[iconKey]}
    </svg>
  )
}
