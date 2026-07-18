import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import type { ThemePreference } from '../../hooks/useTheme'
import styles from './AppearanceCard.module.css'

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'claro', label: 'Claro' },
  { value: 'escuro', label: 'Escuro' },
  { value: 'sistema', label: 'Sistema' },
]

type AppearanceCardProps = {
  value: ThemePreference
  onChange: (value: ThemePreference) => void
}

export function AppearanceCard({ value, onChange }: AppearanceCardProps) {
  return (
    <CardDiv>
      <CardHeading>Aparência</CardHeading>

      <span className={styles.label}>Tema</span>

      <div className={styles.options}>
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.option}${option.value === value ? ` ${styles['option--selected']}` : ''}`}
            onClick={() => onChange(option.value)}
          >
            <span className={`${styles.preview} ${styles[`preview--${option.value}`]}`} />
            <span className={styles.optionLabel}>{option.label}</span>
          </button>
        ))}
      </div>
    </CardDiv>
  )
}
