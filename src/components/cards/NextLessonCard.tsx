import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import styles from './NextLessonCard.module.css'

type NextLessonCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  lessonTitle: string
  duration: string
  difficulty: string
}

export function NextLessonCard({ icon, iconColor, title, lessonTitle, duration, difficulty }: NextLessonCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.row}>
        <CardIcon color={iconColor}>{icon}</CardIcon>
        <div className={styles.info}>
          <span className={styles.lessonTitle}>{lessonTitle}</span>
          <span className={styles.meta}>
            {duration} · {difficulty}
          </span>
        </div>
      </div>
    </CardDiv>
  )
}
