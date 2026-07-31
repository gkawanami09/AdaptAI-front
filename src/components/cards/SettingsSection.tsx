import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './SettingsSection.module.css'

type SettingsSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.content}>{children}</div>
    </CardDiv>
  )
}
