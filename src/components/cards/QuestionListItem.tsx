import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import type { ProgressBarColor } from '../ui/ProgressBar'
import { ChevronRightIcon } from '../ui/icons'
import styles from './QuestionListItem.module.css'

type QuestionListItemProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  difficulty: string
  difficultyColor: BadgeColor
  exam: string
  completed: number
  total: number
  progressColor?: ProgressBarColor
  onClick?: () => void
}

export function QuestionListItem({
  icon,
  iconColor,
  title,
  difficulty,
  difficultyColor,
  exam,
  completed,
  total,
  progressColor = 'purple',
  onClick,
}: QuestionListItemProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <CardDiv>
        <div className={styles.row}>
          <CardIcon color={iconColor}>{icon}</CardIcon>

          <div className={styles.content}>
            <div className={styles.titleRow}>
              <CardHeading>{title}</CardHeading>
              <Badge color={difficultyColor}>{difficulty}</Badge>
              <span className={styles.exam}>{exam}</span>
            </div>

            <div className={styles.footer}>
              <span className={styles.count}>
                {completed}/{total} questões
              </span>
              {completed > 0 && (
                <div className={styles.progress}>
                  <ProgressBar value={(completed / total) * 100} color={progressColor} size="md" />
                </div>
              )}
            </div>
          </div>

          <ChevronRightIcon className={styles.chevron} />
        </div>
      </CardDiv>
    </button>
  )
}
