import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { ProgressBar } from '../ui/ProgressBar'
import type { ProgressBarColor } from '../ui/ProgressBar'
import styles from './MonthlyGoalsCard.module.css'

export type MonthlyGoalItem = {
  label: string
  value: number
  target: number
  color: ProgressBarColor
}

type MonthlyGoalsCardProps = {
  title: string
  items: MonthlyGoalItem[]
}

export function MonthlyGoalsCard({ title, items }: MonthlyGoalsCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.grid}>
        {items.map((item) => {
          const percent = Math.round((item.value / item.target) * 100)

          return (
            <div className={styles.goal} key={item.label}>
              <span className={styles.value}>
                <span className={`${styles.current} ${styles[`current--${item.color}`]}`}>{item.value}</span>
                <span className={styles.target}>/{item.target}</span>
              </span>
              <span className={styles.label}>{item.label}</span>
              <ProgressBar value={percent} color={item.color} size="md" />
              <span className={styles.percent}>{percent}%</span>
            </div>
          )
        })}
      </div>
    </CardDiv>
  )
}
