import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { BookIcon, StarIcon } from '../ui/icons'
import styles from './RepertorioCard.module.css'

type RepertorioCardProps = {
  title: string
  items: string[]
}

export function RepertorioCard({ title, items }: RepertorioCardProps) {
  return (
    <CardDiv>
      <div className={styles.header}>
        <BookIcon className={styles.headerIcon} />
        <CardHeading>{title}</CardHeading>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <div className={styles.item} key={item}>
            <StarIcon className={styles.itemIcon} />
            <span className={styles.itemText}>{item}</span>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
