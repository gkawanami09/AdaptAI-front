import { CardDiv } from '../cards/CardDiv'
import { TitleSession } from '../ui/TitleSession'
import { ProgressBar } from '../ui/ProgressBar'
import type { ProgressBarColor } from '../ui/ProgressBar'
import styles from './SubjectProgressList.module.css'

export type SubjectProgressDatum = {
  label: string
  value: number
  color: ProgressBarColor
}

type SubjectProgressListProps = {
  title: string
  linkTo?: string
  data: SubjectProgressDatum[]
}

export function SubjectProgressList({ title, linkTo, data }: SubjectProgressListProps) {
  return (
    <CardDiv>
      <TitleSession title={title} linkTo={linkTo} />

      <div className={styles.list}>
        {data.map((item) => (
          <div className={styles.row} key={item.label}>
            <div className={styles.rowHeader}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.value}%</span>
            </div>
            <ProgressBar value={item.value} color={item.color} size="md" />
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
