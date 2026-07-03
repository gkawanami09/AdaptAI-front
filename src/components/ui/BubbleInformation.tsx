import type { ReactNode } from 'react'
import styles from './BubbleInformation.module.css'

export type BubbleVariant = 'blue' | 'green' | 'purple' | 'gold'

type BubbleInformationProps = {
  icon: ReactNode
  title: string
  information: string
  variant?: BubbleVariant
}

export function BubbleInformation({ icon, title, information, variant = 'blue' }: BubbleInformationProps) {
  const classes = [styles.container, styles[`container--${variant}`]].join(' ')

  return (
    <div className={classes}>
      <div className={styles.topRow}>
        <span className={styles.icon}>{icon}</span>
        <p className={styles.title}>{title}</p>
      </div>
      <p className={styles.information}>{information}</p>
    </div>
  )
}
