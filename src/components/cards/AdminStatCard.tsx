import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './AdminStatCard.module.css'

type AdminStatCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  label: string
  value: ReactNode
  sublabel?: ReactNode
}

export function AdminStatCard({ icon, iconColor, label, value, sublabel }: AdminStatCardProps) {
  return (
    <CardDiv>
      <div className={styles.row}>
        <CardIcon color={iconColor}>{icon}</CardIcon>
        <div className={styles.info}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
          {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
        </div>
      </div>
    </CardDiv>
  )
}
