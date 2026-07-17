import type { ReactNode } from 'react'
import styles from './XpBadge.module.css'

type XpBadgeProps = {
  children: ReactNode
}

export function XpBadge({ children }: XpBadgeProps) {
  return <span className={styles.badge}>{children}</span>
}
