import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { AlertCircleIcon } from '../ui/icons'
import styles from './AlertCard.module.css'

type AlertCardProps = {
  title: string
  message: string
}

export function AlertCard({ title, message }: AlertCardProps) {
  return (
    <CardDiv accent="gold">
      <div className={styles.header}>
        <AlertCircleIcon className={styles.icon} />
        <CardHeading>{title}</CardHeading>
      </div>
      <p className={styles.message}>{message}</p>
    </CardDiv>
  )
}
