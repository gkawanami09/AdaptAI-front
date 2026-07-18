import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { CheckIcon } from '../ui/icons'
import styles from './ModuleLessonsCard.module.css'

export type ModuleLessonStatus = 'concluida' | 'atual' | 'bloqueada'

export type ModuleLesson = {
  order: number
  label: string
  status: ModuleLessonStatus
}

type ModuleLessonsCardProps = {
  title: string
  lessons: ModuleLesson[]
}

export function ModuleLessonsCard({ title, lessons }: ModuleLessonsCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {lessons.map((lesson) => (
          <div
            key={lesson.order}
            className={`${styles.row}${lesson.status === 'atual' ? ` ${styles['row--atual']}` : ''}`}
          >
            <span className={`${styles.badge} ${styles[`badge--${lesson.status}`]}`}>
              {lesson.status === 'concluida' ? <CheckIcon /> : lesson.order}
            </span>
            <span className={`${styles.label} ${styles[`label--${lesson.status}`]}`}>{lesson.label}</span>
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
