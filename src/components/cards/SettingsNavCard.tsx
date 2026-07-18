import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { ChevronRightIcon } from '../ui/icons'
import styles from './SettingsNavCard.module.css'

export type SettingsNavItem = {
  id: string
  icon: ReactNode
  iconColor: CardIconColor
  label: string
}

type SettingsNavCardProps = {
  items: SettingsNavItem[]
  activeId: string
  onChange: (id: string) => void
}

export function SettingsNavCard({ items, activeId, onChange }: SettingsNavCardProps) {
  return (
    <CardDiv>
      <div className={styles.list}>
        {items.map((item) => {
          const active = item.id === activeId

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.item}${active ? ` ${styles['item--active']}` : ''}`}
              onClick={() => onChange(item.id)}
            >
              <CardIcon color={item.iconColor} shape="circle" size="sm">
                {item.icon}
              </CardIcon>
              <span className={styles.label}>{item.label}</span>
              {active && <ChevronRightIcon className={styles.chevron} />}
            </button>
          )
        })}
      </div>
    </CardDiv>
  )
}
