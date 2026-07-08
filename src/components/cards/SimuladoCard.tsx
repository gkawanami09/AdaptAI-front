import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { ClockIcon, ChevronRightIcon } from '../ui/icons'
import styles from './SimuladoCard.module.css'

type SimuladoCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  description: string
  tag: string
  tagColor: BadgeColor
  duration: string
  onClick?: () => void
}

export function SimuladoCard({
  icon,
  iconColor,
  title,
  description,
  tag,
  tagColor,
  duration,
  onClick,
}: SimuladoCardProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <CardDiv>
        <div className={styles.row}>
          <CardIcon color={iconColor}>{icon}</CardIcon>

          <div className={styles.content}>
            <CardHeading>{title}</CardHeading>
            <p className={styles.description}>{description}</p>

            <div className={styles.footer}>
              <Badge color={tagColor}>{tag}</Badge>
              <span className={styles.duration}>
                <ClockIcon className={styles.durationIcon} />
                {duration}
              </span>
            </div>
          </div>

          <ChevronRightIcon className={styles.chevron} />
        </div>
      </CardDiv>
    </button>
  )
}
