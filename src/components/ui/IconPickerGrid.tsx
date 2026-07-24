import type { ReactNode } from 'react'
import { CardIcon } from '../cards/CardIcon'
import type { CardIconColor } from '../cards/CardIcon'
import { PlusIcon } from './icons'
import styles from './IconPickerGrid.module.css'

export type IconPickerOption = {
  value: string
  icon: ReactNode
  color?: CardIconColor
  hex?: string
}

type IconPickerGridProps = {
  options: IconPickerOption[]
  value: string
  onChange: (value: string) => void
  onAddCustom?: () => void
}

export function IconPickerGrid({ options, value, onChange, onAddCustom }: IconPickerGridProps) {
  return (
    <div className={styles.grid}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.option}${option.value === value ? ` ${styles['option--active']}` : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
          aria-label={`Selecionar ícone ${option.value}`}
        >
          <CardIcon color={option.color} hex={option.hex}>
            {option.icon}
          </CardIcon>
        </button>
      ))}

      {onAddCustom && (
        <button type="button" className={styles.addButton} onClick={onAddCustom} aria-label="Adicionar ícone personalizado">
          <PlusIcon />
        </button>
      )}
    </div>
  )
}
