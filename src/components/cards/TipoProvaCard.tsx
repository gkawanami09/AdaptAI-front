import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { FileTextIcon, PencilIcon, XIcon } from '../ui/icons'
import styles from './TipoProvaCard.module.css'

type TipoProvaCardProps = {
  iconColor: CardIconColor
  nome: string
  descricao?: string | null
  ativo: boolean
  onEditar?: () => void
  onExcluir?: () => void
}

export function TipoProvaCard({ iconColor, nome, descricao, ativo, onEditar, onExcluir }: TipoProvaCardProps) {
  return (
    <CardDiv>
      <div className={styles.top}>
        <CardIcon color={iconColor}>
          <FileTextIcon />
        </CardIcon>
        {ativo ? <Badge color="teal">Ativo</Badge> : <Badge color="gold">Inativo</Badge>}
      </div>

      <div className={styles.body}>
        <CardHeading>{nome}</CardHeading>
        {descricao && <p className={styles.descricao}>{descricao}</p>}
      </div>

      <div className={styles.actions}>
        <Button icon={<PencilIcon />} iconPosition="left" onClick={onEditar}>
          Editar
        </Button>
        <button type="button" className={styles.deleteButton} aria-label={`Excluir ${nome}`} onClick={onExcluir}>
          <XIcon />
        </button>
      </div>
    </CardDiv>
  )
}
