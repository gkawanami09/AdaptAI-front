import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { LockIcon } from '../ui/icons'
import { XpBadge } from '../ui/XpBadge'
import styles from './AchievementCard.module.css'

export type AchievementRarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

const RARITY_CONFIG: Record<AchievementRarity, { label: string; badgeColor: BadgeColor }> = {
  comum: { label: 'Comum', badgeColor: 'gray' },
  incomum: { label: 'Incomum', badgeColor: 'blue' },
  raro: { label: 'Raro', badgeColor: 'purple' },
  epico: { label: 'Épico', badgeColor: 'gold' },
  lendario: { label: 'Lendário', badgeColor: 'red' },
}

type AchievementCardProps = {
  icon: ReactNode
  title: string
  description: string
  rarity: AchievementRarity
  xp?: number
  locked?: boolean
}

export function AchievementCard({ icon, title, description, rarity, xp, locked = false }: AchievementCardProps) {
  const config = RARITY_CONFIG[rarity]

  return (
    <CardDiv>
      <div className={`${styles.content}${locked ? ` ${styles['content--locked']}` : ''}`}>
        <span className={styles.iconWrap}>
          <span className={styles.icon}>{icon}</span>
          {locked && (
            <span className={styles.lockBadge}>
              <LockIcon />
            </span>
          )}
        </span>

        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>

        <div className={styles.badges}>
          <Badge color={config.badgeColor}>{config.label}</Badge>
          {!locked && xp !== undefined && <XpBadge>+{xp} XP</XpBadge>}
        </div>
      </div>
    </CardDiv>
  )
}
