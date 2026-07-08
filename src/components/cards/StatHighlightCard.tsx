import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './StatHighlightCard.module.css'

type StatHighlightCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  value: string
  label: string
}

export function StatHighlightCard({ icon, iconColor, value, label }: StatHighlightCardProps) {
  return (
    <CardDiv>
      <div className={styles.content}>
        <CardIcon color={iconColor} shape="circle">
          {icon}
        </CardIcon>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </CardDiv>
  )
}
