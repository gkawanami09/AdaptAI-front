import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './RankingBarList.module.css'

export type RankingBarListItem = {
  id: string
  icon?: React.ReactNode
  label: string
  percentual: number
  color: 'purple' | 'green' | 'blue' | 'gold' | 'red' | 'teal'
}

type RankingBarListProps = {
  title: string
  items: RankingBarListItem[]
  linkLabel?: string
  onLinkClick?: () => void
}

export function RankingBarList({ title, items, linkLabel, onLinkClick }: RankingBarListProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.id}>
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span className={styles.label}>{item.label}</span>
            <div className={styles.barTrack}>
              <div
                className={`${styles.barFill} ${styles[`barFill--${item.color}`]}`}
                style={{ width: `${item.percentual}%` }}
              />
            </div>
            <span className={styles.percentual}>{item.percentual.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {linkLabel && (
        <button type="button" className={styles.link} onClick={onLinkClick}>
          {linkLabel} →
        </button>
      )}
    </CardDiv>
  )
}
