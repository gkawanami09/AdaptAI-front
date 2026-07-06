import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './StatsListCard.module.css'

export type StatColor = 'purple' | 'teal' | 'gold'

export type StatItem = {
  label: string
  value: string
  color: StatColor
}

type StatsListCardProps = {
  title: string
  items: StatItem[]
}

export function StatsListCard({ title, items }: StatsListCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.label}>
            <span className={styles.label}>{item.label}</span>
            <span className={`${styles.value} ${styles[`value--${item.color}`]}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
