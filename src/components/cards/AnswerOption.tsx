import styles from './AnswerOption.module.css'

type AnswerOptionProps = {
  letter: string
  text: string
  selected: boolean
  onSelect: () => void
}

export function AnswerOption({ letter, text, selected, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      className={`${styles.option}${selected ? ` ${styles['option--selected']}` : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={`${styles.letter}${selected ? ` ${styles['letter--selected']}` : ''}`}>{letter}</span>
      <span className={styles.text}>{text}</span>
    </button>
  )
}
