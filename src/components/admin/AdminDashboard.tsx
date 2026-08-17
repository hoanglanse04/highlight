import type { AdminViewServerProps } from 'payload'

type AdminLocale = 'en' | 'vi'
type Action = {
  description: string
  href: string
  icon: string
  label: string
}
type AdminDashboardLabels = {
  activityEmpty: string
  activityEmptyDescription: string
  activityTitle: string
  actions: Record<'editHomepage' | 'newProject' | 'uploadMedia', {
    description: string
    label: string
  }>
  contentOverview: string
  dashboardLabel: string
  metrics: Record<'categories' | 'media' | 'projects' | 'website', {
    helper: string
    title: string
  }>
  quickActions: string
  subtitle: string
  title: string
  unavailable: string
}

function getLocaleCode(locale: unknown): AdminLocale {
  if (typeof locale === 'string' && locale === 'en') {
    return 'en'
  }

  if (
    locale &&
    typeof locale === 'object' &&
    'code' in locale &&
    (locale as { code?: unknown }).code === 'en'
  ) {
    return 'en'
  }

  return 'vi'
}

async function getAdminDashboardLabels(locale: AdminLocale) {
  const messages = (await import(`../../../messages/${locale}.json`)).default as {
    AdminCMS: AdminDashboardLabels
  }

  return messages.AdminCMS
}

async function getCollectionCount({
  collection,
  props,
}: {
  collection: 'media' | 'project-categories' | 'projects'
  props: AdminViewServerProps
}): Promise<{ error: boolean; value: number }> {
  try {
    const result = await props.payload.count({
      collection,
      overrideAccess: false,
      req: props.initPageResult.req,
    })

    return { error: false, value: result.totalDocs }
  } catch {
    return { error: true, value: 0 }
  }
}

async function getWebsiteContentCount(
  props: AdminViewServerProps,
): Promise<{ error: boolean; value: number }> {
  const globalSlugs = ['homepage', 'header', 'footer', 'site-settings'] as const

  try {
    const results = await Promise.all(
      globalSlugs.map((slug) =>
        props.payload.findGlobal({
          req: props.initPageResult.req,
          slug,
        }),
      ),
    )

    return {
      error: false,
      value: results.filter(Boolean).length,
    }
  } catch {
    return { error: true, value: 0 }
  }
}

function canAccess(
  props: AdminViewServerProps,
  type: 'collections' | 'globals',
  slug: string,
) {
  const visibleEntities =
    props.visibleEntities ?? props.initPageResult.visibleEntities
  const entities = visibleEntities?.[type] as readonly string[] | undefined

  return entities?.includes(slug) ?? false
}

export async function AdminDashboard(props: AdminViewServerProps) {
  const locale = getLocaleCode(props.locale)
  const t = await getAdminDashboardLabels(locale)

  const [projects, categories, media, website] = await Promise.all([
    getCollectionCount({ collection: 'projects', props }),
    getCollectionCount({ collection: 'project-categories', props }),
    getCollectionCount({ collection: 'media', props }),
    getWebsiteContentCount(props),
  ])

  const actions: Action[] = [
    canAccess(props, 'collections', 'projects')
      ? {
          description: t.actions.newProject.description,
          href: '/admin/collections/projects/create',
          icon: '+',
          label: t.actions.newProject.label,
        }
      : null,
    canAccess(props, 'collections', 'media')
      ? {
          description: t.actions.uploadMedia.description,
          href: '/admin/collections/media/create',
          icon: '^',
          label: t.actions.uploadMedia.label,
        }
      : null,
    canAccess(props, 'globals', 'homepage')
      ? {
          description: t.actions.editHomepage.description,
          href: '/admin/globals/homepage',
          icon: '>',
          label: t.actions.editHomepage.label,
        }
      : null,
  ].filter(Boolean) as Action[]

  const metrics = [
    {
      ...t.metrics.projects,
      error: projects.error,
      value: projects.value,
    },
    {
      ...t.metrics.categories,
      error: categories.error,
      value: categories.value,
    },
    {
      ...t.metrics.media,
      error: media.error,
      value: media.value,
    },
    {
      ...t.metrics.website,
      error: website.error,
      value: website.value,
    },
  ]

  return (
    <main className="highlight-dashboard ambient-page">
      <section className="highlight-dashboard__hero">
        <div>
          <p className="highlight-dashboard__eyebrow">{t.dashboardLabel}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        {actions[0] ? (
          <a className="highlight-dashboard__primary-action" href={actions[0].href}>
            <span aria-hidden="true">+</span>
            {actions[0].label}
          </a>
        ) : null}
      </section>

      <section
        aria-labelledby="highlight-dashboard-metrics"
        className="highlight-dashboard__section"
      >
        <div className="highlight-dashboard__section-header">
          <h2 id="highlight-dashboard-metrics">{t.contentOverview}</h2>
        </div>
        <div className="highlight-dashboard__metrics">
          {metrics.map((metric) => (
            <article className="highlight-dashboard__metric" key={metric.title}>
              <strong>{metric.error ? '-' : metric.value}</strong>
              <h3>{metric.title}</h3>
              <p>{metric.error ? t.unavailable : metric.helper}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="highlight-dashboard__grid">
        <div className="highlight-dashboard__activity">
          <div className="highlight-dashboard__section-header">
            <h2>{t.activityTitle}</h2>
          </div>
          <div className="highlight-dashboard__empty">
            <span aria-hidden="true" />
            <h3>{t.activityEmpty}</h3>
            <p>{t.activityEmptyDescription}</p>
          </div>
        </div>

        <aside className="highlight-dashboard__quick-actions">
          <div className="highlight-dashboard__section-header">
            <h2>{t.quickActions}</h2>
          </div>
          <div className="highlight-dashboard__actions">
            {actions.map((action) => (
              <a className="highlight-dashboard__action" href={action.href} key={action.href}>
                <span className="highlight-dashboard__action-icon" aria-hidden="true">
                  {action.icon}
                </span>
                <span className="highlight-dashboard__action-copy">
                  <strong>{action.label}</strong>
                  <small>{action.description}</small>
                </span>
                <span className="highlight-dashboard__action-arrow" aria-hidden="true">
                  &gt;
                </span>
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
