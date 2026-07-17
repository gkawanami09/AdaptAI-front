import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import styles from './StatHighlightCard.module.css'

type StatHighlightCardProps = {
  icon: ReactNode
  // Sem iconColor, o ícone é renderizado "puro" (sem fundo colorido) — útil para emojis
  // que já carregam sua própria cor, como nos cards de Conquistas.
  iconColor?: CardIconColor
  value: string
  label: string
  align?: 'center' | 'left'
  iconShape?: 'circle' | 'square'
}

export function StatHighlightCard({
  icon,
  iconColor,
  value,
  label,
  align = 'center',
  iconShape = 'circle',
}: StatHighlightCardProps) {
  return (
    <CardDiv>
      <div className={`${styles.content}${align === 'left' ? ` ${styles['content--left']}` : ''}`}>
        {iconColor ? (
          <CardIcon color={iconColor} shape={iconShape}>
            {icon}
          </CardIcon>
        ) : (
          <span className={styles.plainIcon}>{icon}</span>
        )}
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </CardDiv>
  )
}
