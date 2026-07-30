import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ClipboardIcon, PencilIcon, XIcon } from '../ui/icons'
import type { ListaTipo } from '../../types/listas'
import styles from './QuestionListCard.module.css'

const TIPO_LISTA_LABEL: Record<ListaTipo, string> = {
  fixa: 'Fixa',
  gerada_ia: 'Gerada por IA',
  questoes_erradas: 'Questões erradas',
  favoritas: 'Favoritas',
  revisao: 'Revisão',
}

type QuestionListCardProps = {
  iconColor: CardIconColor
  titulo: string
  materia: string
  tipoLista: ListaTipo
  totalQuestoes: number
  onEditar?: () => void
  onExcluir?: () => void
}

export function QuestionListCard({ iconColor, titulo, materia, tipoLista, totalQuestoes, onEditar, onExcluir }: QuestionListCardProps) {
  return (
    <CardDiv>
      <div className={styles.top}>
        <CardIcon color={iconColor}>
          <ClipboardIcon />
        </CardIcon>
        <Badge color="purple">{TIPO_LISTA_LABEL[tipoLista]}</Badge>
      </div>

      <div className={styles.body}>
        <CardHeading>{titulo}</CardHeading>
        {materia && <Badge color="blue">{materia}</Badge>}
        <span className={styles.meta}>
          <ClipboardIcon className={styles.metaIcon} />
          {totalQuestoes} {totalQuestoes === 1 ? 'questão' : 'questões'}
        </span>
      </div>

      <div className={styles.actions}>
        <Button icon={<PencilIcon />} iconPosition="left" onClick={onEditar}>
          Editar lista
        </Button>
        <button type="button" className={styles.deleteButton} aria-label={`Excluir ${titulo}`} onClick={onExcluir}>
          <XIcon />
        </button>
      </div>
    </CardDiv>
  )
}
