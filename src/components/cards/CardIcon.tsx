import type { ReactNode } from 'react'
import styles from './CardIcon.module.css'

export type CardIconColor = 'purple' | 'green' | 'blue' | 'gold' | 'red'

type CardIconProps = {
  children: ReactNode
  color?: CardIconColor
  shape?: 'square' | 'circle'
  size?: 'sm' | 'md'
}

export function CardIcon({ children, color = 'purple', shape = 'square', size = 'md' }: CardIconProps) {
  const classes = [
    styles.icon,
    styles[`icon--${color}`],
    shape === 'circle' && styles['icon--circle'],
    size === 'sm' && styles['icon--sm'],
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
