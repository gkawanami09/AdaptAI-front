import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './CompetenciasCard.module.css'

export type CompetenciaColor = 'blue' | 'teal' | 'purple' | 'gold' | 'red'

export type CompetenciaItem = {
  number: number
  title: string
  description: string
  color: CompetenciaColor
}

type CompetenciasCardProps = {
  title: string
  items: CompetenciaItem[]
}

export function CompetenciasCard({ title, items }: CompetenciasCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.row} key={item.number}>
            <span className={`${styles.badge} ${styles[`badge--${item.color}`]}`}>{item.number}</span>

            <div className={styles.info}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemDescription}>{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
