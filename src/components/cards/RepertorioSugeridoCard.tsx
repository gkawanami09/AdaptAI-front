import { CardDiv } from './CardDiv'
import { BookIcon } from '../ui/icons'
import styles from './RepertorioSugeridoCard.module.css'

type RepertorioSugeridoCardProps = {
  nome: string
  descricao: string
}

export function RepertorioSugeridoCard({ nome, descricao }: RepertorioSugeridoCardProps) {
  return (
    <CardDiv>
      <div className={styles.content}>
        <BookIcon className={styles.icon} />
        <div className={styles.info}>
          <span className={styles.nome}>{nome}</span>
          <span className={styles.descricao}>{descricao}</span>
        </div>
      </div>
    </CardDiv>
  )
}
