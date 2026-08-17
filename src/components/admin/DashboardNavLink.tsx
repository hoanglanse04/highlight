'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin' || pathname === '/admin/'

  return (
    <div className="highlight-admin-dashboard-nav">
      <Link
        aria-current={isActive ? 'page' : undefined}
        className={`nav__link highlight-admin-dashboard-nav__link${isActive ? ' active' : ''}`}
        href="/admin"
      >
        <span className="highlight-admin-dashboard-nav__mark" aria-hidden="true" />
        <span>Dashboard</span>
      </Link>
    </div>
  )
}
