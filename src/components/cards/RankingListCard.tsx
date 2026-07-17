import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { ProgressBar } from '../ui/ProgressBar'
import type { ProgressBarColor } from '../ui/ProgressBar'
import styles from './RankingListCard.module.css'

export type RankingItem = {
  label: string
  percent: number
  color: ProgressBarColor
}

type RankingListCardProps = {
  title: string
  items: RankingItem[]
}

const TOP_RANK_STYLE = ['rank--1', 'rank--2', 'rank--3'] as const

export function RankingListCard({ title, items }: RankingListCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item, index) => {
          const rank = index + 1
          const rankClass = TOP_RANK_STYLE[index] ? styles[TOP_RANK_STYLE[index]] : styles['rank--muted']

          return (
            <div className={styles.row} key={item.label}>
              <span className={`${styles.rank} ${rankClass}`}>{rank}</span>

              <div className={styles.content}>
                <div className={styles.top}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={`${styles.value} ${styles[`value--${item.color}`]}`}>{item.percent}%</span>
                </div>
                <ProgressBar value={item.percent} color={item.color} />
              </div>
            </div>
          )
        })}
      </div>
    </CardDiv>
  )
}
