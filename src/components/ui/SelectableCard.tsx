import type { ReactNode } from 'react'
import { CheckIcon } from './icons'
import styles from './SelectableCard.module.css'

type SelectableCardProps = {
  title: string
  description?: string
  icon?: ReactNode
  selected: boolean
  onClick: () => void
}

export function SelectableCard({ title, description, icon, selected, onClick }: SelectableCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card}${selected ? ` ${styles['card--selected']}` : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>
        <strong className={styles.title}>{title}</strong>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      <span className={`${styles.checkbox}${selected ? ` ${styles['checkbox--checked']}` : ''}`}>
        {selected && <CheckIcon />}
      </span>
    </button>
  )
}
