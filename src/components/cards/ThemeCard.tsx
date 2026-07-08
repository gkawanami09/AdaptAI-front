import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import styles from './ThemeCard.module.css'

type ThemeCardProps = {
  tag: string
  tagColor?: BadgeColor
  title: string
  description: string
}

export function ThemeCard({ tag, tagColor = 'purple', title, description }: ThemeCardProps) {
  return (
    <CardDiv tone="purple">
      <Badge color={tagColor}>{tag}</Badge>
      <div className={styles.title}>
        <CardHeading>{title}</CardHeading>
      </div>
      <p className={styles.description}>{description}</p>
    </CardDiv>
  )
}
