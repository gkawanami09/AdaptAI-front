import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './LessonSummaryCard.module.css'

type LessonSummaryCardProps = {
  title: string
  children: ReactNode
}

export function LessonSummaryCard({ title, children }: LessonSummaryCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>
      <div className={styles.body}>{children}</div>
    </CardDiv>
  )
}

type LessonChildrenProps = {
  children: ReactNode
}

export function LessonParagraph({ children }: LessonChildrenProps) {
  return <p className={styles.paragraph}>{children}</p>
}

export function LessonHighlight({ children }: LessonChildrenProps) {
  return <div className={styles.highlight}>{children}</div>
}
