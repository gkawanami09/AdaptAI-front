import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { ProgressBar } from '../ui/ProgressBar'
import { XpBadge } from '../ui/XpBadge'
import styles from './WeeklyMissionsCard.module.css'

export type WeeklyMission = {
  label: string
  xp: number
  current: number
  target: number
}

type WeeklyMissionsCardProps = {
  title: string
  icon: ReactNode
  missions: WeeklyMission[]
}

export function WeeklyMissionsCard({ title, icon, missions }: WeeklyMissionsCardProps) {
  return (
    <CardDiv>
      <div className={styles.header}>
        <span className={styles.headerIcon}>{icon}</span>
        <CardHeading>{title}</CardHeading>
      </div>

      <div className={styles.list}>
        {missions.map((mission) => (
          <div key={mission.label} className={styles.item}>
            <div className={styles.itemTop}>
              <span className={styles.label}>{mission.label}</span>
              <XpBadge>+{mission.xp}</XpBadge>
            </div>
            <div className={styles.progressRow}>
              <ProgressBar value={(mission.current / mission.target) * 100} color="gold" size="sm" />
              <span className={styles.fraction}>
                {mission.current}/{mission.target}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
