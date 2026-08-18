import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { FolderIcon, PencilIcon, XIcon } from '../ui/icons'
import styles from './MateriaCard.module.css'

export type MateriaStatus = 'ativa' | 'rascunho'

type MateriaCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  title: string
  area: string
  status: MateriaStatus
  modulos: number
  aulas: number
  onVerModulos?: () => void
  onEditar?: () => void
  onExcluir?: () => void
}

export function MateriaCard({ icon, iconColor, title, area, status, modulos, aulas, onVerModulos, onEditar, onExcluir }: MateriaCardProps) {
  return (
    <CardDiv>
      <div className={styles.top}>
        <CardIcon color={iconColor}>{icon}</CardIcon>
        {status === 'ativa' ? <Badge color="teal">Ativa</Badge> : <Badge color="gold">Rascunho</Badge>}
      </div>

      <div className={styles.body}>
        <CardHeading>{title}</CardHeading>
        <Badge color="blue">{area}</Badge>
        <span className={styles.meta}>
          <FolderIcon className={styles.metaIcon} />
          {modulos} módulos · {aulas} aulas
        </span>
      </div>

      <div className={styles.actions}>
        <Button icon={<FolderIcon />} iconPosition="left" onClick={onVerModulos}>
          Ver módulos
        </Button>
        <button type="button" className={styles.editButton} aria-label={`Editar ${title}`} onClick={onEditar}>
          <PencilIcon />
        </button>
        <button type="button" className={styles.deleteButton} aria-label={`Excluir ${title}`} onClick={onExcluir}>
          <XIcon />
        </button>
      </div>
    </CardDiv>
  )
}
