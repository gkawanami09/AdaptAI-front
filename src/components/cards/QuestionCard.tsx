import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { Button } from '../ui/Button'
import { HelpCircleIcon, CheckSquareIcon, PencilIcon, XIcon } from '../ui/icons'
import type { QuestaoDificuldade } from '../../types/questoes'
import styles from './QuestionCard.module.css'

const DIFICULDADE_LABEL: Record<QuestaoDificuldade, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

const DIFICULDADE_COLOR: Record<QuestaoDificuldade, BadgeColor> = {
  facil: 'green',
  medio: 'gold',
  dificil: 'red',
}

type QuestionCardProps = {
  iconColor: CardIconColor
  enunciado: string
  ativo: boolean
  dificuldade: QuestaoDificuldade
  totalAlternativas: number
  onEditar?: () => void
  onExcluir?: () => void
}

export function QuestionCard({ iconColor, enunciado, ativo, dificuldade, totalAlternativas, onEditar, onExcluir }: QuestionCardProps) {
  return (
    <CardDiv>
      <div className={styles.top}>
        <CardIcon color={iconColor} shape="circle">
          <HelpCircleIcon />
        </CardIcon>
        {ativo ? <Badge color="teal">Publicada</Badge> : <Badge color="red">Inativa</Badge>}
      </div>

      <div className={styles.body}>
        <p className={styles.enunciado}>{enunciado}</p>

        <div className={styles.badges}>
          <Badge color={DIFICULDADE_COLOR[dificuldade]}>{DIFICULDADE_LABEL[dificuldade]}</Badge>
        </div>

        <span className={styles.meta}>
          <CheckSquareIcon className={styles.metaIcon} />
          {totalAlternativas} {totalAlternativas === 1 ? 'alternativa' : 'alternativas'}
        </span>
      </div>

      <div className={styles.actions}>
        <Button icon={<PencilIcon />} iconPosition="left" onClick={onEditar}>
          Editar questão
        </Button>
        <button type="button" className={styles.deleteButton} aria-label="Excluir questão" onClick={onExcluir}>
          <XIcon />
        </button>
      </div>
    </CardDiv>
  )
}
