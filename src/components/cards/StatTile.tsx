import type { ReactNode } from 'react'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './StatTile.module.css'

type StatTileProps = {
  icon: ReactNode
  iconColor: CardIconColor
  label: string
  value: ReactNode
}

export function StatTile({ icon, iconColor, label, value }: StatTileProps) {
  return (
    <div className={styles.tile}>
      <CardIcon color={iconColor} size="sm">
        {icon}
      </CardIcon>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  )
}
