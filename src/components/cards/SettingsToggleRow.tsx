import { Switch } from '../ui/Switch'
import styles from './SettingsToggleRow.module.css'

type SettingsToggleRowProps = {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SettingsToggleRow({ label, description, checked, onChange }: SettingsToggleRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
