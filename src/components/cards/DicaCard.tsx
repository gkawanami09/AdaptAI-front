import { CardDiv } from './CardDiv'
import { LightbulbIcon } from '../ui/icons'
import styles from './DicaCard.module.css'

type DicaCardProps = {
  title: string
  message: string
}

export function DicaCard({ title, message }: DicaCardProps) {
  return (
    <CardDiv tone="purple">
      <div className={styles.header}>
        <LightbulbIcon className={styles.icon} />
        <span className={styles.title}>{title}</span>
      </div>
      <p className={styles.message}>{message}</p>
    </CardDiv>
  )
}
