import { CardDiv } from './CardDiv'
import type { RedacaoCompetenciaNota } from '../../types/redacaoCorrecao'
import styles from './ScoreHeaderCard.module.css'

type ScoreHeaderCardProps = {
  notaTotal: number
  notaMaxima: number
  competencias: RedacaoCompetenciaNota[]
  statusLabel: string
  mensagemMotivacional: string
}

export function ScoreHeaderCard({ notaTotal, notaMaxima, competencias, statusLabel, mensagemMotivacional }: ScoreHeaderCardProps) {
  return (
    <CardDiv tone="purple">
      <div className={styles.grid}>
        <div className={styles.scoreColumn}>
          <span className={styles.scoreLabel}>Nota total</span>
          <span className={styles.scoreValue}>{notaTotal}</span>
          <span className={styles.scoreMax}>de {notaMaxima}</span>

          <div className={styles.competencias}>
            {competencias.map((competencia) => (
              <div className={styles.competenciaTile} key={competencia.number}>
                <span className={styles.competenciaNota}>{competencia.nota}</span>
                <span className={styles.competenciaLabel}>C{competencia.number}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statusColumn}>
          <span className={styles.statusLabel}>Status</span>
          <span className={styles.statusValue}>{statusLabel}</span>
          <p className={styles.statusMessage}>{mensagemMotivacional}</p>
        </div>
      </div>
    </CardDiv>
  )
}
