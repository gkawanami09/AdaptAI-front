import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './AlertsSection.module.css'

export type AlertItem = {
  id: string
  icon: ReactNode
  severidade: 'alta' | 'media'
  descricao: string
  detalhe?: string
  link: string
}

type AlertsSectionProps = {
  title: string
  items: AlertItem[]
  linkLabel?: string
  onLinkClick?: () => void
}

export function AlertsSection({ title, items, linkLabel, onLinkClick }: AlertsSectionProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.list}>
        {items.map((item) => (
          <a key={item.id} href={item.link} className={styles.item}>
            <span className={`${styles.icon} ${styles[`icon--${item.severidade}`]}`}>{item.icon}</span>
            {item.descricao}
            {item.detalhe && <span className={styles.detalhe}>{item.detalhe}</span>}
          </a>
        ))}
      </div>

      {linkLabel && (
        <div className={styles.footer}>
          <button type="button" className={styles.link} onClick={onLinkClick}>
            {linkLabel} →
          </button>
        </div>
      )}
    </CardDiv>
  )
}
