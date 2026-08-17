import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import { ClockIcon, PlayIcon, CheckIcon } from '../ui/icons'
import styles from './ActivityCard.module.css'

export type ActivityStatus = 'concluido' | 'em-andamento' | 'nao-iniciado'
export type ActivityColor = 'purple' | 'green' | 'blue'

type StatusConfig = {
  label?: string
  badgeColor?: 'teal' | 'blue'
  accent?: 'teal' | 'purple'
  progressColor?: 'teal' | 'purple'
  showButton: boolean
}

const STATUS_CONFIG: Record<ActivityStatus, StatusConfig> = {
  concluido: { label: 'Concluído', badgeColor: 'teal', accent: 'teal', progressColor: 'teal', showButton: false },
  'em-andamento': {
    label: 'Em andamento',
    badgeColor: 'blue',
    accent: 'purple',
    progressColor: 'purple',
    showButton: true,
  },
  'nao-iniciado': { showButton: true },
}

type ActivityCardProps = {
  icon: ReactNode
  subject: string
  subjectColor: ActivityColor
  status: ActivityStatus
  title: string
  duration: string
  progress?: number
  onStart?: () => void
  onComplete?: () => void
}

export function ActivityCard({ icon, subject, subjectColor, status, title, duration, progress, onStart, onComplete }: ActivityCardProps) {
  const config = STATUS_CONFIG[status]

  return (
    <CardDiv accent={config.accent}>
      <div className={styles.row}>
        <CardIcon color={subjectColor}>{icon}</CardIcon>

        <div className={styles.content}>
          <div className={styles.badges}>
            <Badge color={subjectColor}>{subject}</Badge>
            {config.label && <Badge color={config.badgeColor}>{config.label}</Badge>}
          </div>

          <CardHeading>{title}</CardHeading>

          <div className={styles.footer}>
            <span className={styles.duration}>
              <ClockIcon className={styles.durationIcon} />
              {duration}
            </span>
            {progress !== undefined && config.progressColor && (
              <div className={styles.progress}>
                <ProgressBar value={progress} color={config.progressColor} />
              </div>
            )}
          </div>
        </div>

        {config.showButton && (
          <div className={styles.actions}>
            {onComplete && (
              <Button pill size="sm" fullWidth={false} variant="outline" icon={<CheckIcon />} iconPosition="left" onClick={onComplete}>
                Concluir
              </Button>
            )}
            <Button pill size="sm" fullWidth={false} icon={<PlayIcon />} iconPosition="left" onClick={onStart}>
              Começar
            </Button>
          </div>
        )}
      </div>
    </CardDiv>
  )
}
