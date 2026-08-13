import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type ContainerProps<TElement extends ElementType> = {
  as?: TElement
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children' | 'className'>

export function Container<TElement extends ElementType = 'div'>({
  as,
  children,
  className = '',
  ...props
}: ContainerProps<TElement>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={`mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12 xl:px-16 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
