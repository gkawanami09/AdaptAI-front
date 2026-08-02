import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './QuickActions.module.css'

export type QuickAction = {
  id: string
  icon: ReactNode
  label: string
  onClick: () => void
}

type QuickActionsProps = {
  title: string
  actions: QuickAction[]
}

export function QuickActions({ title, actions }: QuickActionsProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.grid}>
        {actions.map((action) => (
          <button key={action.id} type="button" className={styles.action} onClick={action.onClick}>
            <span className={styles.icon}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </CardDiv>
  )
}
