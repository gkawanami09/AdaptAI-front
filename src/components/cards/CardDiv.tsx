import type { ReactNode } from 'react'
import styles from './CardDiv.module.css'

export type CardAccent = 'blue' | 'green' | 'purple' | 'gold' | 'teal'
export type CardTone = 'green' | 'purple'

type CardDivProps = {
  children: ReactNode
  accent?: CardAccent
  tone?: CardTone
}

export function CardDiv({ children, accent, tone }: CardDivProps) {
  const classes = [styles.container, accent && styles[`accent--${accent}`], tone && styles[`tone--${tone}`]]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
