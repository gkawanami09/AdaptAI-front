import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ClockIcon, FileTextIcon, FolderIcon, PencilIcon, PlayIcon, StarIcon } from '../ui/icons'
import type { AulaDificuldade } from '../../types/aulas'
import styles from './AulaAdminCard.module.css'

const DIFICULDADE_LABEL: Record<AulaDificuldade, string> = {
  basico: 'Básico',
  medio: 'Médio',
  dificil: 'Difícil',
}

const DIFICULDADE_COLOR: Record<AulaDificuldade, BadgeColor> = {
  basico: 'green',
  medio: 'gold',
  dificil: 'red',
}

type AulaAdminCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  resumo?: string | null
  ativo: boolean
  dificuldade: AulaDificuldade
  maisCobrado: boolean
  totalTextos: number
  totalVideos: number
  duracaoTotalMin: number
  onVerConteudos?: () => void
  onEditar?: () => void
}

export function AulaAdminCard({
  icon,
  iconColor,
  title,
  resumo,
  ativo,
  dificuldade,
  maisCobrado,
  totalTextos,
  totalVideos,
  duracaoTotalMin,
  onVerConteudos,
  onEditar,
}: AulaAdminCardProps) {
  return (
    <CardDiv>
      <div className={styles.top}>
        <CardIcon color={iconColor} shape="circle">
          {icon}
        </CardIcon>
        {ativo ? <Badge color="teal">Ativa</Badge> : <Badge color="red">Inativa</Badge>}
      </div>

      <div className={styles.body}>
        <CardHeading>{title}</CardHeading>
        {resumo && <p className={styles.resumo}>{resumo}</p>}

        <div className={styles.badges}>
          <Badge color={DIFICULDADE_COLOR[dificuldade]}>{DIFICULDADE_LABEL[dificuldade]}</Badge>
          {maisCobrado && (
            <Badge color="gold">
              <StarIcon className={styles.badgeIcon} /> Mais cobrada
            </Badge>
          )}
        </div>

        <div className={styles.metrics}>
          <span className={styles.metric}>
            <FileTextIcon className={styles.metricIcon} />
            {totalTextos} {totalTextos === 1 ? 'Texto' : 'Textos'}
          </span>
          <span className={styles.metric}>
            <PlayIcon className={styles.metricIcon} />
            {totalVideos} {totalVideos === 1 ? 'Vídeo' : 'Vídeos'}
          </span>
          <span className={styles.metric}>
            <ClockIcon className={styles.metricIcon} />
            {duracaoTotalMin} min
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button icon={<FolderIcon />} iconPosition="left" onClick={onVerConteudos}>
          Ver conteúdos
        </Button>
        <button type="button" className={styles.editButton} aria-label={`Editar ${title}`} onClick={onEditar}>
          <PencilIcon />
        </button>
      </div>
    </CardDiv>
  )
}
