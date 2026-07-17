import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { ProgressBar } from '../ui/ProgressBar'
import { BoltIcon } from '../ui/icons'
import styles from './LevelProgressCard.module.css'

type LevelProgressCardProps = {
  level: number
  currentXp: number
  targetXp: number
}

export function LevelProgressCard({ level, currentXp, targetXp }: LevelProgressCardProps) {
  const percent = Math.min(100, Math.round((currentXp / targetXp) * 100))
  const remaining = Math.max(targetXp - currentXp, 0)

  return (
    <CardDiv>
      <div className={styles.header}>
        <div>
          <CardHeading>{`Nível ${level}`}</CardHeading>
          <p className={styles.subtitle}>
            {currentXp.toLocaleString('pt-BR')} / {targetXp.toLocaleString('pt-BR')} XP para Nível {level + 1}
          </p>
        </div>
        <span className={styles.remaining}>{remaining.toLocaleString('pt-BR')} XP restantes</span>
      </div>

      <div className={styles.barWrap}>
        <ProgressBar value={percent} color="purple" size="lg" />
        <span className={styles.barIcon} style={{ left: `${percent}%` }}>
          <BoltIcon />
        </span>
      </div>
    </CardDiv>
  )
}
