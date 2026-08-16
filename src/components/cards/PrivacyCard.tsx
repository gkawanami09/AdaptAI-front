import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { ChevronRightIcon } from '../ui/icons'
import styles from './PrivacyCard.module.css'

export type PrivacyAction = {
  id: string
  label: string
  description: string
  danger?: boolean
}

const ACTIONS: PrivacyAction[] = [
  { id: 'alterar-senha', label: 'Alterar senha', description: 'Atualize a senha da sua conta' },
  { id: 'excluir-conta', label: 'Excluir conta', description: 'Ação irreversível', danger: true },
]

type PrivacyCardProps = {
  onAction: (id: string) => void
}

export function PrivacyCard({ onAction }: PrivacyCardProps) {
  return (
    <CardDiv>
      <CardHeading>Privacidade e Segurança</CardHeading>

      <div className={styles.list}>
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`${styles.row}${action.danger ? ` ${styles['row--danger']}` : ''}`}
            onClick={() => onAction(action.id)}
          >
            <div className={styles.info}>
              <span className={styles.label}>{action.label}</span>
              <span className={styles.description}>{action.description}</span>
            </div>
            <ChevronRightIcon className={styles.chevron} />
          </button>
        ))}
      </div>
    </CardDiv>
  )
}
