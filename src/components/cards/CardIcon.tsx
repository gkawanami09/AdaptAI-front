import type { ReactNode } from 'react'
import styles from './CardIcon.module.css'

export type CardIconColor = 'purple' | 'green' | 'blue'

type CardIconProps = {
  children: ReactNode
  color?: CardIconColor
}

export function CardIcon({ children, color = 'purple' }: CardIconProps) {
  return <span className={`${styles.icon} ${styles[`icon--${color}`]}`}>{children}</span>
}
