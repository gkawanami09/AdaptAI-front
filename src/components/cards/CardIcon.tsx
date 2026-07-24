import type { ReactNode } from 'react'
import styles from './CardIcon.module.css'

export type CardIconColor = 'purple' | 'green' | 'blue' | 'gold' | 'red'

type CardIconProps = {
  children: ReactNode
  color?: CardIconColor
  hex?: string
  shape?: 'square' | 'circle'
  size?: 'sm' | 'md'
}

export function CardIcon({ children, color = 'purple', hex, shape = 'square', size = 'md' }: CardIconProps) {
  const classes = [
    styles.icon,
    !hex && styles[`icon--${color}`],
    shape === 'circle' && styles['icon--circle'],
    size === 'sm' && styles['icon--sm'],
  ]
    .filter(Boolean)
    .join(' ')

  const style = hex ? { background: `${hex}22`, color: hex } : undefined

  return (
    <span className={classes} style={style}>
      {children}
    </span>
  )
}
