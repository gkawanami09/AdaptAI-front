import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Switch } from '../ui/Switch'
import styles from './NotificationSettingsCard.module.css'

export type NotificationSetting = {
  id: string
  label: string
  description: string
  enabled: boolean
}

type NotificationSettingsCardProps = {
  title: string
  items: NotificationSetting[]
  onToggle: (id: string, enabled: boolean) => void
}

export function NotificationSettingsCard({ title, items, onToggle }: NotificationSettingsCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.description}>{item.description}</span>
            </div>
            <Switch checked={item.enabled} onChange={(checked) => onToggle(item.id, checked)} label={item.label} />
          </div>
        ))}
      </div>
    </CardDiv>
  )
}
