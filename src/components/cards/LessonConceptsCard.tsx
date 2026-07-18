import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { CheckIcon } from '../ui/icons'
import styles from './LessonConceptsCard.module.css'

export type LessonConcept = {
  id: string
  label: string
  checked: boolean
}

type LessonConceptsCardProps = {
  title: string
  items: LessonConcept[]
  onToggle: (id: string, checked: boolean) => void
}

export function LessonConceptsCard({ title, items, onToggle }: LessonConceptsCardProps) {
  const marcados = items.filter((item) => item.checked).length

  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.row}
            onClick={() => onToggle(item.id, !item.checked)}
            aria-pressed={item.checked}
          >
            <span className={`${styles.checkbox}${item.checked ? ` ${styles['checkbox--checked']}` : ''}`}>
              {item.checked && <CheckIcon />}
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>

      <span className={styles.counter}>
        {marcados}/{items.length} conceitos marcados
      </span>
    </CardDiv>
  )
}
