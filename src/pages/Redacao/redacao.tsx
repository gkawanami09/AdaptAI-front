import { useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { ThemeCard } from '../../components/cards/ThemeCard'
import { WritingCard } from '../../components/cards/WritingCard'
import styles from './Redacao.module.css'

export function Redacao() {
  const [redacao, setRedacao] = useState('')

  function handleEnviar() {
    // TODO: conectar ao backend — enviar a redação para correção da IA
    console.log('enviar redação para correção', redacao)
  }

  return (
    <main className={styles.page}>
      <TitlePage title="Treino de Redação" subtitle="Escreve, envie e receba correção da IA" />

      <div className={styles.contentRow}>
        <div className={styles.mainColumn}>
          <ThemeCard
            tag="Tema ENEM 2024"
            title="Desafios para o enfrentamento da invisibilidade dos povos indígenas no Brasil"
            description="Escreva um texto dissertativo-argumentativo de 7 a 30 linhas. Apresente uma proposta de intervenção que respeite os direitos humanos."
          />

          <div className={styles.writing}>
            <WritingCard value={redacao} onChange={setRedacao} minWords={100} onSubmit={handleEnviar} />
          </div>
        </div>

        <div className={styles.sideColumn} />
      </div>
    </main>
  )
}
