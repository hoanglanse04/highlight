'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={false}
      transition={{ duration: reduced ? 0 : 0.55, ease: 'easeOut' }}
      viewport={{ amount: 0.12, once: true }}
      whileInView={reduced ? undefined : { opacity: [0.94, 1], y: [12, 0] }}
    >
      {children}
    </motion.div>
  )
}

export function MotionCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={false}
      transition={{ duration: reduced ? 0 : 0.2 }}
      whileHover={reduced ? undefined : { y: -5 }}
    >
      {children}
    </motion.div>
  )
}
