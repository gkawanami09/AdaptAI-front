import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import styles from './TemaRedacaoCard.module.css'

type TemaRedacaoCardProps = {
  tag: string
  tagColor?: BadgeColor
  title: string
  description: string
  onClick?: () => void
}

export function TemaRedacaoCard({ tag, tagColor = 'purple', title, description, onClick }: TemaRedacaoCardProps) {
  return (
    <button type="button" className={styles.trigger} onClick={onClick}>
      <CardDiv tone="purple">
        <Badge color={tagColor}>{tag}</Badge>
        <div className={styles.title}>
          <CardHeading>{title}</CardHeading>
        </div>
        <p className={styles.description}>{description}</p>
      </CardDiv>
    </button>
  )
}
