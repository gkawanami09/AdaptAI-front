import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Button } from '../ui/Button'
import { SendIcon } from '../ui/icons'
import styles from './WritingCard.module.css'

type WritingCardProps = {
  value: string
  onChange: (value: string) => void
  minWords?: number
  onSubmit?: () => void
}

function countWords(text: string) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function WritingCard({ value, onChange, minWords = 100, onSubmit }: WritingCardProps) {
  const words = countWords(value)
  const chars = value.length

  return (
    <CardDiv>
      <div className={styles.header}>
        <CardHeading>Sua redação</CardHeading>
        <span className={styles.counter}>
          {words} palavras · {chars} caracteres
        </span>
      </div>

      <textarea
        className={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Escreva sua redação aqui... Lembre-se: introdução, desenvolvimento (2 parágrafos) e conclusão com proposta de intervenção."
      />

      <div className={styles.footer}>
        <span className={styles.hint}>
          <span className={styles.hintDot} />
          Mínimo recomendado: {minWords} palavras
        </span>

        <Button pill fullWidth={false} icon={<SendIcon />} iconPosition="left" onClick={onSubmit}>
          Enviar para correção
        </Button>
      </div>
    </CardDiv>
  )
}
