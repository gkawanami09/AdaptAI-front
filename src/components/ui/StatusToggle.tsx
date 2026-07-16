import { CheckCircleIcon } from './icons'
import styles from './StatusToggle.module.css'

export type StatusToggleColor = 'green' | 'gold'

type StatusToggleOption = {
  value: string
  label: string
  color: StatusToggleColor
}

type StatusToggleProps = {
  options: StatusToggleOption[]
  value: string
  onChange: (value: string) => void
}

export function StatusToggle({ options, value, onChange }: StatusToggleProps) {
  return (
    <div className={styles.toggle} role="radiogroup">
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.option}${active ? ` ${styles[`option--active-${option.color}`]}` : ''}`}
            onClick={() => onChange(option.value)}
          >
            {active ? (
              <CheckCircleIcon className={`${styles.dotIcon} ${styles[`dotIcon--${option.color}`]}`} />
            ) : (
              <span className={styles.dotEmpty} />
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
