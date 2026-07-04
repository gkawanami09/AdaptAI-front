import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeColor = 'purple' | 'green' | 'blue' | 'teal'

type BadgeProps = {
  children: ReactNode
  color?: BadgeColor
}

export function Badge({ children, color = 'purple' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[`badge--${color}`]}`}>{children}</span>
}
