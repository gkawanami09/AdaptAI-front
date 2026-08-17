import { CardDiv } from './CardDiv'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { AnswerOption } from './AnswerOption'
import { CheckCircleIcon, XIcon } from '../ui/icons'
import styles from './QuestionReviewCard.module.css'

type QuestionReviewCardAlternativa = {
  letra: string
  texto: string
}

type QuestionReviewCardProps = {
  numero: number
  enunciado: string
  materia: string
  materiaColor?: BadgeColor
  assunto?: string
  dificuldade?: string
  dificuldadeColor?: BadgeColor
  alternativas: QuestionReviewCardAlternativa[]
  respostaAluno: string | null
  respostaCorreta: string
  acertou: boolean
}

export function QuestionReviewCard({
  numero,
  enunciado,
  materia,
  materiaColor = 'purple',
  assunto,
  dificuldade,
  dificuldadeColor,
  alternativas,
  respostaAluno,
  respostaCorreta,
  acertou,
}: QuestionReviewCardProps) {
  return (
    <CardDiv tone={acertou ? 'green' : 'red'}>
      <div className={styles.header}>
        <span className={styles.numero}>Questão {numero}</span>
        <span className={`${styles.status}${acertou ? ` ${styles['status--correct']}` : ` ${styles['status--wrong']}`}`}>
          {acertou ? <CheckCircleIcon className={styles.statusIcon} /> : <XIcon className={styles.statusIcon} />}
          {acertou ? 'Acertou' : 'Errou'}
        </span>
      </div>

      <div className={styles.meta}>
        <Badge color={materiaColor}>{materia}</Badge>
        {assunto && <Badge color="gray">{assunto}</Badge>}
        {dificuldade && <Badge color={dificuldadeColor ?? 'gray'}>{dificuldade}</Badge>}
      </div>

      <p className={styles.enunciado}>{enunciado}</p>

      <div className={styles.options}>
        {alternativas.map((alternativa) => (
          <AnswerOption
            key={alternativa.letra}
            letter={alternativa.letra}
            text={alternativa.texto}
            selected={alternativa.letra === respostaAluno}
            readOnly
            state={
              alternativa.letra === respostaCorreta ? 'correct' : alternativa.letra === respostaAluno ? 'incorrect' : 'neutral'
            }
          />
        ))}
      </div>

      <div className={styles.summary}>
        <span>
          Sua resposta: <strong>{respostaAluno ?? '—'}</strong>
        </span>
        <span>
          Resposta correta: <strong>{respostaCorreta}</strong>
        </span>
      </div>
    </CardDiv>
  )
}
