import styles from './SegmentedControl.module.css'

type SegmentedControlOption = {
  value: string
  label: string
}

type SegmentedControlProps = {
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className={styles.segmented} role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={`${styles.segment}${option.value === value ? ` ${styles['segment--active']}` : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
