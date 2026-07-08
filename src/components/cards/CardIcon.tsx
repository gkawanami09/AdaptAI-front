import type { ReactNode } from 'react'
import styles from './CardIcon.module.css'

export type CardIconColor = 'purple' | 'green' | 'blue' | 'gold' | 'red'

type CardIconProps = {
  children: ReactNode
  color?: CardIconColor
  shape?: 'square' | 'circle'
}

export function CardIcon({ children, color = 'purple', shape = 'square' }: CardIconProps) {
  const classes = [styles.icon, styles[`icon--${color}`], shape === 'circle' && styles['icon--circle']]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
