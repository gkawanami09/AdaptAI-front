import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { CheckCircleIcon, XIcon, ChevronRightIcon } from '../ui/icons'
import styles from './AnsweredQuestionListItem.module.css'

function formatarData(dataIso: string) {
  const data = new Date(dataIso)
  if (Number.isNaN(data.getTime())) return null
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

type AnsweredQuestionListItemProps = {
  subject: string
  subjectColor: BadgeColor
  assunto?: string
  question: string
  exam: string
  difficulty: string
  difficultyColor: BadgeColor
  listaTitulo: string
  correta: boolean
  respostaAluno?: string
  respostaCorreta?: string
  respondidaEm?: string
  onClick?: () => void
}

export function AnsweredQuestionListItem({
  subject,
  subjectColor,
  assunto,
  question,
  exam,
  difficulty,
  difficultyColor,
  listaTitulo,
  correta,
  respostaAluno,
  respostaCorreta,
  respondidaEm,
  onClick,
}: AnsweredQuestionListItemProps) {
  const dataFormatada = respondidaEm ? formatarData(respondidaEm) : null

  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <CardDiv tone={correta ? 'green' : 'red'}>
        <div className={styles.row}>
          <span className={`${styles.statusIcon}${correta ? ` ${styles['statusIcon--correct']}` : ` ${styles['statusIcon--wrong']}`}`}>
            {correta ? <CheckCircleIcon className={styles.icon} /> : <XIcon className={styles.icon} />}
          </span>

          <div className={styles.content}>
            <div className={styles.titleRow}>
              <Badge color={subjectColor}>{subject}</Badge>
              {assunto && <Badge color="gray">{assunto}</Badge>}
              <Badge color={difficultyColor}>{difficulty}</Badge>
              <span className={styles.exam}>{exam}</span>
            </div>

            <CardHeading>{question}</CardHeading>
            <span className={styles.lista}>{listaTitulo}</span>

            {(respostaAluno || respostaCorreta || dataFormatada) && (
              <div className={styles.meta}>
                {respostaAluno && <span>Você marcou: {respostaAluno}</span>}
                {!correta && respostaCorreta && <span>Correta: {respostaCorreta}</span>}
                {dataFormatada && <span>{dataFormatada}</span>}
              </div>
            )}
          </div>

          <ChevronRightIcon className={styles.chevron} />
        </div>
      </CardDiv>
    </button>
  )
}
