import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { GripVerticalIcon, XIcon } from '../ui/icons'
import type { QuestaoDificuldade } from '../../types/questoes'
import styles from './SortableQuestionItem.module.css'

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

type SortableQuestionItemProps = {
  id: string
  enunciado: string
  dificuldade: QuestaoDificuldade
  onRemove: () => void
}

export function SortableQuestionItem({ id, enunciado, dificuldade, onRemove }: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.item}>
      <button type="button" className={styles.handle} {...attributes} {...listeners} aria-label="Reordenar">
        <GripVerticalIcon />
      </button>

      <div className={styles.body}>
        <p className={styles.enunciado}>{enunciado}</p>
        <Badge color={DIFICULDADE_COLOR[dificuldade]}>{DIFICULDADE_LABEL[dificuldade]}</Badge>
      </div>

      <button type="button" className={styles.removeButton} onClick={onRemove} aria-label="Remover questão">
        <XIcon />
      </button>
    </div>
  )
}
