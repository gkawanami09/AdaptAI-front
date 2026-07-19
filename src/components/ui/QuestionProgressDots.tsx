import styles from './QuestionProgressDots.module.css'

type QuestionProgressDotsProps = {
  total: number
  current: number
  answered?: boolean[]
  flagged?: boolean[]
  onSelect?: (index: number) => void
}

export function QuestionProgressDots({
  total,
  current,
  answered = [],
  flagged = [],
  onSelect,
}: QuestionProgressDotsProps) {
  return (
    <div className={styles.dots} role="group" aria-label={`Questão ${current + 1} de ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        const classes = [
          styles.dot,
          index === current ? styles['dot--current'] : answered[index] && styles['dot--done'],
          flagged[index] && styles['dot--flagged'],
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={index}
            type="button"
            className={classes}
            onClick={() => onSelect?.(index)}
            aria-label={`Ir para a questão ${index + 1}`}
            aria-current={index === current}
          />
        )
      })}
    </div>
  )
}
