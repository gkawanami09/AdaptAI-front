import styles from './AnswerOption.module.css'

type AnswerOptionProps = {
  letter: string
  text: string
  selected: boolean
  onSelect?: () => void
  readOnly?: boolean
  state?: 'correct' | 'incorrect' | 'neutral'
}

export function AnswerOption({ letter, text, selected, onSelect, readOnly, state }: AnswerOptionProps) {
  const stateClass = readOnly && state && state !== 'neutral' ? ` ${styles[`option--${state}`]}` : ''

  return (
    <button
      type="button"
      className={`${styles.option}${selected ? ` ${styles['option--selected']}` : ''}${stateClass}`}
      onClick={readOnly ? undefined : onSelect}
      aria-pressed={selected}
      aria-disabled={readOnly}
    >
      <span
        className={`${styles.letter}${selected ? ` ${styles['letter--selected']}` : ''}${stateClass ? ` ${styles[`letter--${state}`]}` : ''}`}
      >
        {letter}
      </span>
      <span className={styles.text}>{text}</span>
    </button>
  )
}
