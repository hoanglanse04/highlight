import {
  RichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { ComponentProps } from 'react'

import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { resolveSafeHref } from '@/lib/urls'

type RichTextData = ComponentProps<typeof RichText>['data']

function convertersFor(locale: AppLocale): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    autolink: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      if (!resolveSafeHref(node.fields.url, locale)) return <>{children}</>
      return (
        <SmartLink
          href={node.fields.url}
          locale={locale}
          openInNewTab={node.fields.newTab}
        >
          {children}
        </SmartLink>
      )
    },
    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const Heading = node.tag === 'h1' ? 'h2' : node.tag
      return <Heading>{children}</Heading>
    },
    link: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      if (!resolveSafeHref(node.fields.url, locale)) return <>{children}</>
      return (
        <SmartLink
          href={node.fields.url}
          locale={locale}
          openInNewTab={node.fields.newTab}
        >
          {children}
        </SmartLink>
      )
    },
  })
}

export function ProjectRichText({
  className = '',
  data,
  locale,
}: {
  className?: string
  data: RichTextData
  locale: AppLocale
}) {
  return (
    <RichText
      className={`project-rich-text ${className}`}
      converters={convertersFor(locale)}
      data={data}
    />
  )
}
