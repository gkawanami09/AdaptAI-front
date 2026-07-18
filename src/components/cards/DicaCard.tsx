import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { LightbulbIcon } from '../ui/icons'
import styles from './DicaCard.module.css'

type DicaCardProps = {
  title: string
  message: string
  icon?: ReactNode
}

export function DicaCard({ title, message, icon = <LightbulbIcon /> }: DicaCardProps) {
  return (
    <CardDiv tone="purple">
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
      </div>
      <p className={styles.message}>{message}</p>
    </CardDiv>
  )
}
