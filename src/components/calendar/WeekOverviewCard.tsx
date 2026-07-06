import { CardDiv } from '../cards/CardDiv'
import { CardHeading } from '../cards/CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import styles from './WeekOverviewCard.module.css'

export type WeekOverviewRow = {
  day: string
  badges?: { label: string; color: BadgeColor }[]
  restLabel?: string
  completed: number
  total: number
}

type WeekOverviewCardProps = {
  title: string
  rows: WeekOverviewRow[]
}

export function WeekOverviewCard({ title, rows }: WeekOverviewCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.day}>
            <span className={styles.day}>{row.day}</span>

            <div className={styles.badges}>
              {row.badges && row.badges.length > 0 ? (
                row.badges.map((badge) => (
                  <Badge key={badge.label} color={badge.color}>
                    {badge.label}
                  </Badge>
                ))
              ) : (
                <span className={styles.rest}>{row.restLabel}</span>
              )}
            </div>

            <span className={styles.count}>
              {row.completed}/{row.total}
            </span>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
