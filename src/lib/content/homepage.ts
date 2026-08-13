type OrderableItem = {
  displayOrder?: number | null
  enabled?: boolean | null
}

export function getEnabledItems<T extends OrderableItem>(
  items: T[] | null | undefined,
  limit?: number,
): T[] {
  const sorted = [...(items ?? [])]
    .filter((item) => item.enabled !== false)
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0))

  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export function isSectionEnabled<T extends { enabled?: boolean | null }>(
  section: T | null | undefined,
): section is T {
  return Boolean(section && section.enabled !== false)
}
