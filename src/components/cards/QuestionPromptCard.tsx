import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import styles from './QuestionPromptCard.module.css'

type QuestionPromptCardProps = {
  subject: string
  subjectColor: BadgeColor
  examInfo: string
  question: ReactNode
}

export function QuestionPromptCard({ subject, subjectColor, examInfo, question }: QuestionPromptCardProps) {
  return (
    <CardDiv tone="purple">
      <div className={styles.meta}>
        <Badge color={subjectColor}>{subject}</Badge>
        <span className={styles.examInfo}>{examInfo}</span>
      </div>
      <p className={styles.question}>{question}</p>
    </CardDiv>
  )
}
