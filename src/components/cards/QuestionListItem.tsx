import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import type { ProgressBarColor } from '../ui/ProgressBar'
import { Button } from '../ui/Button'
import { PlayIcon, ChevronRightIcon, RefreshIcon, EyeIcon, TrashIcon } from '../ui/icons'
import type { BancoQuestoesListaStatus } from '../../types/bancoQuestoes'
import styles from './QuestionListItem.module.css'

const STATUS_LABEL: Record<BancoQuestoesListaStatus, { label: string; badgeColor: BadgeColor }> = {
  nao_iniciado: { label: 'Não iniciado', badgeColor: 'gray' },
  em_andamento: { label: 'Em andamento', badgeColor: 'blue' },
  concluido: { label: 'Concluído', badgeColor: 'teal' },
}

type QuestionListItemProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  description?: string
  difficulty: string
  difficultyColor: BadgeColor
  exam: string
  status: BancoQuestoesListaStatus
  completed: number
  total: number
  accuracyPercent?: number
  progressColor?: ProgressBarColor
  personalizada?: boolean
  onIniciar?: () => void
  onRevisar?: () => void
  onRefazer?: () => void
  onExcluir?: () => void
  refazerLoading?: boolean
  excluirLoading?: boolean
}

export function QuestionListItem({
  icon,
  iconColor,
  title,
  description,
  difficulty,
  difficultyColor,
  exam,
  status,
  completed,
  total,
  accuracyPercent,
  progressColor = 'purple',
  personalizada,
  onIniciar,
  onRevisar,
  onRefazer,
  onExcluir,
  refazerLoading,
  excluirLoading,
}: QuestionListItemProps) {
  const statusConfig = STATUS_LABEL[status]

  return (
    <CardDiv>
      <div className={styles.row}>
        <CardIcon color={iconColor}>{icon}</CardIcon>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <Badge color={difficultyColor}>{difficulty}</Badge>
            <Badge color={statusConfig.badgeColor}>{statusConfig.label}</Badge>
            <span className={styles.exam}>{exam}</span>
          </div>

          <CardHeading>{title}</CardHeading>
          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.footer}>
            <span className={styles.count}>
              {completed}/{total} questões respondidas
            </span>
            {completed > 0 && (
              <div className={styles.progress}>
                <ProgressBar value={(completed / total) * 100} color={progressColor} size="md" />
              </div>
            )}
            {completed > 0 && accuracyPercent !== undefined && (
              <span className={`${styles.accuracy}${accuracyPercent >= 60 ? ` ${styles['accuracy--good']}` : ` ${styles['accuracy--low']}`}`}>
                {Math.round(accuracyPercent)}% de acerto
              </span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {status === 'concluido' ? (
            <>
              {onRevisar && (
                <Button
                  variant="outline"
                  pill
                  size="sm"
                  fullWidth={false}
                  icon={<EyeIcon />}
                  iconPosition="left"
                  onClick={onRevisar}
                  title="Veja suas respostas e confira os erros."
                >
                  Revisar
                </Button>
              )}
              <Button
                pill
                size="sm"
                fullWidth={false}
                icon={<RefreshIcon />}
                iconPosition="left"
                onClick={onRefazer}
                disabled={refazerLoading}
                title="Comece o plano novamente sem ver as respostas."
              >
                Refazer
              </Button>
            </>
          ) : (
            <Button
              pill
              size="sm"
              fullWidth={false}
              icon={status === 'em_andamento' ? <ChevronRightIcon /> : <PlayIcon />}
              iconPosition="left"
              onClick={onIniciar}
            >
              {status === 'em_andamento' ? 'Continuar' : 'Começar'}
            </Button>
          )}

          {personalizada && onExcluir && (
            <Button
              variant="outline"
              pill
              size="sm"
              fullWidth={false}
              icon={<TrashIcon />}
              iconPosition="left"
              onClick={onExcluir}
              disabled={excluirLoading}
              title="Excluir esta lista personalizada."
            >
              Excluir
            </Button>
          )}
        </div>
      </div>
    </CardDiv>
  )
}
