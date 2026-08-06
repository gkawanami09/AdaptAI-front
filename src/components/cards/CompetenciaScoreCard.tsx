import { CardDiv } from './CardDiv'
import { ProgressBar } from '../ui/ProgressBar'
import type { ProgressBarColor } from '../ui/ProgressBar'
import styles from './CompetenciaScoreCard.module.css'

type CompetenciaScoreCardProps = {
  number: number
  title: string
  description: string
  nota: number
  notaMaxima: number
  color: ProgressBarColor
}

export function CompetenciaScoreCard({ number, title, description, nota, notaMaxima, color }: CompetenciaScoreCardProps) {
  const percentual = Math.round((nota / notaMaxima) * 100)

  return (
    <CardDiv>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[`badge--${color}`]}`}>C{number}</span>
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          <span className={styles.description}>{description}</span>
        </div>
        <span className={styles.nota}>{nota}</span>
      </div>

      <div className={styles.barWrap}>
        <ProgressBar value={percentual} color={color} size="sm" />
      </div>
    </CardDiv>
  )
}
