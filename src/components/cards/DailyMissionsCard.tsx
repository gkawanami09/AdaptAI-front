import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { XpBadge } from '../ui/XpBadge'
import { CheckIcon } from '../ui/icons'
import styles from './DailyMissionsCard.module.css'

export type DailyMission = {
  label: string
  xp: number
  completed: boolean
}

type DailyMissionsCardProps = {
  title: string
  icon: ReactNode
  missions: DailyMission[]
}

export function DailyMissionsCard({ title, icon, missions }: DailyMissionsCardProps) {
  return (
    <CardDiv>
      <div className={styles.header}>
        <span className={styles.headerIcon}>{icon}</span>
        <CardHeading>{title}</CardHeading>
      </div>

      <div className={styles.list}>
        {missions.map((mission) => (
          <div key={mission.label} className={`${styles.row}${mission.completed ? ` ${styles['row--done']}` : ''}`}>
            <span className={`${styles.checkbox}${mission.completed ? ` ${styles['checkbox--done']}` : ''}`}>
              {mission.completed && <CheckIcon />}
            </span>
            <span className={`${styles.label}${mission.completed ? ` ${styles['label--done']}` : ''}`}>
              {mission.label}
            </span>
            <XpBadge>+{mission.xp}</XpBadge>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
