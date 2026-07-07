import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import { ClockIcon, CheckCircleIcon, PlayIcon } from '../ui/icons'
import styles from './AulaCard.module.css'

export type AulaStatus = 'concluida' | 'em-andamento'

type AulaCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  subject: string
  subjectColor: BadgeColor
  duration: string
  difficulty: string
  progress: number
  status: AulaStatus
  featured?: boolean
  onAction?: () => void
}

export function AulaCard({
  icon,
  iconColor,
  title,
  subject,
  subjectColor,
  duration,
  difficulty,
  progress,
  status,
  featured,
  onAction,
}: AulaCardProps) {
  const concluida = status === 'concluida'

  return (
    <CardDiv>
      <div className={styles.header}>
        <CardIcon color={iconColor}>{icon}</CardIcon>
        {featured && <Badge color="gold">⭐ Mais cobrado</Badge>}
      </div>

      <div className={styles.body}>
        <CardHeading>{title}</CardHeading>
        <div className={styles.meta}>
          <Badge color={subjectColor}>{subject}</Badge>
          <span className={styles.metaText}>
            <ClockIcon className={styles.metaIcon} />
            {duration} · {difficulty}
          </span>
        </div>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.progressLabel}>Progresso</span>
        <span className={styles.progressValue}>{progress}%</span>
      </div>
      <ProgressBar value={progress} color={concluida ? 'teal' : 'purple'} size="md" />

      <div className={styles.action}>
        <Button
          variant={concluida ? 'success' : 'primary'}
          icon={concluida ? <CheckCircleIcon /> : <PlayIcon />}
          iconPosition="left"
          onClick={onAction}
        >
          {concluida ? 'Concluída' : 'Continuar'}
        </Button>
      </div>
    </CardDiv>
  )
}
