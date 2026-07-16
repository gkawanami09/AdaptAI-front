import styles from './UnderlineTabs.module.css'

type UnderlineTabsOption = {
  value: string
  label: string
}

type UnderlineTabsProps = {
  options: UnderlineTabsOption[]
  value: string
  onChange: (value: string) => void
}

export function UnderlineTabs({ options, value, onChange }: UnderlineTabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={`${styles.tab}${option.value === value ? ` ${styles['tab--active']}` : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
