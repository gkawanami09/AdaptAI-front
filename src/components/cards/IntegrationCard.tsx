import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardIcon } from './CardIcon'
import type { CardIconColor } from './CardIcon'
import { Badge } from '../ui/Badge'
import { Switch } from '../ui/Switch'
import styles from './IntegrationCard.module.css'

type IntegrationCardProps = {
  icon: ReactNode
  iconColor: CardIconColor
  nome: string
  descricao: string
  ativo: boolean
  onToggle: (ativo: boolean) => void
  children?: ReactNode
}

export function IntegrationCard({ icon, iconColor, nome, descricao, ativo, onToggle, children }: IntegrationCardProps) {
  return (
    <CardDiv>
      <div className={styles.top}>
        <div className={styles.identity}>
          <CardIcon color={iconColor} shape="circle" size="sm">
            {icon}
          </CardIcon>
          <div className={styles.text}>
            <span className={styles.nome}>{nome}</span>
            <span className={styles.descricao}>{descricao}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {ativo ? <Badge color="teal">Ativo</Badge> : <Badge color="gray">Inativo</Badge>}
          <Switch checked={ativo} onChange={onToggle} label={`Ativar ${nome}`} />
        </div>
      </div>

      {children && <div className={styles.body}>{children}</div>}
    </CardDiv>
  )
}
