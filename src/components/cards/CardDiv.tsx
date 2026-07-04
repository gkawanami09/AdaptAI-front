import type { ReactNode } from 'react'
import styles from './CardDiv.module.css'

export type CardAccent = 'blue' | 'green' | 'purple' | 'gold' | 'teal'

type CardDivProps = {
  children: ReactNode
  accent?: CardAccent
}

export function CardDiv({ children, accent }: CardDivProps) {
  const classes = [styles.container, accent && styles[`accent--${accent}`]].filter(Boolean).join(' ')

  return <div className={classes}>{children}</div>
}
