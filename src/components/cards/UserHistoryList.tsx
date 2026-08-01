import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import type { HistoricoItem, HistoricoTipo } from '../../types/usuarios'
import styles from './UserHistoryList.module.css'

const TIPO_LABEL: Record<HistoricoTipo, string> = {
  questao: 'Questão',
  lista: 'Lista',
  prova: 'Prova',
  aula: 'Aula',
  conquista: 'Conquista',
}

const TIPO_COLOR: Record<HistoricoTipo, BadgeColor> = {
  questao: 'blue',
  lista: 'purple',
  prova: 'gold',
  aula: 'teal',
  conquista: 'green',
}

type UserHistoryListProps = {
  itens: HistoricoItem[]
}

export function UserHistoryList({ itens }: UserHistoryListProps) {
  return (
    <div className={styles.list}>
      {itens.map((item) => (
        <div className={styles.item} key={item.id}>
          <Badge color={TIPO_COLOR[item.tipo]}>{TIPO_LABEL[item.tipo]}</Badge>
          <div className={styles.info}>
            <span className={styles.descricao}>{item.descricao}</span>
            <span className={styles.data}>{item.data}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
