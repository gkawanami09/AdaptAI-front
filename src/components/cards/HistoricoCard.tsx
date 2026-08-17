import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { ChevronRightIcon } from '../ui/icons'
import styles from './HistoricoCard.module.css'

export type HistoricoItem = {
  day: string
  title: string
  tempo: string
  score: number
  acertos: number
  onClick?: () => void
}

type HistoricoCardProps = {
  title: string
  items: HistoricoItem[]
}

export function HistoricoCard({ title, items }: HistoricoCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <button type="button" className={styles.row} key={item.title} onClick={item.onClick}>
            <span className={styles.dayBadge}>{item.day}</span>

            <div className={styles.info}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemMeta}>Tempo: {item.tempo}</span>
            </div>

            <div className={styles.result}>
              <span className={styles.score}>{item.score}</span>
              <span className={styles.acertos}>{item.acertos}% acertos</span>
            </div>

            <ChevronRightIcon className={styles.chevron} />
          </button>
        ))}
      </div>
    </CardDiv>
  )
}
