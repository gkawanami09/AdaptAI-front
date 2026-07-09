import { useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { ThemeCard } from '../../components/cards/ThemeCard'
import { WritingCard } from '../../components/cards/WritingCard'
import { CompetenciasCard } from '../../components/cards/CompetenciasCard'
import { RepertorioCard } from '../../components/cards/RepertorioCard'
import { DicaCard } from '../../components/cards/DicaCard'
import styles from './Redacao.module.css'

// TODO: substituir pelos dados reais vindos do backend (banco de repertórios sugeridos)
const REPERTORIOS = [
  'Constituição Federal de 1988, Art. 5º — igualdade perante a lei',
  'ODS 4 da ONU — Educação de qualidade para todos',
  "Paulo Freire: 'A educação é um ato de amor'",
  'IBGE 2023: 11 milhões de analfabetos no Brasil',
  'Lei de Diretrizes e Bases da Educação (LDB)',
]

// TODO: substituir pelo texto oficial (pode variar por vestibular/edital)
const COMPETENCIAS = [
  {
    number: 1,
    title: 'Domínio da norma culta',
    description: 'Gramática, ortografia e pontuação',
    color: 'blue' as const,
  },
  {
    number: 2,
    title: 'Compreensão da proposta',
    description: 'Entender e desenvolver o tema',
    color: 'teal' as const,
  },
  {
    number: 3,
    title: 'Seleção e organização',
    description: 'Argumentos e repertório sociocultural',
    color: 'purple' as const,
  },
  {
    number: 4,
    title: 'Mecanismos linguísticos',
    description: 'Coesão e coerência textual',
    color: 'gold' as const,
  },
  {
    number: 5,
    title: 'Proposta de intervenção',
    description: 'Solução detalhada e respeitosa',
    color: 'red' as const,
  },
]

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

        <div className={styles.sideColumn}>
          <CompetenciasCard title="5 Competências ENEM" items={COMPETENCIAS} />
          <RepertorioCard title="Banco de repertórios" items={REPERTORIOS} />
          <DicaCard
            title="Dica da Ada"
            message="Use dados do IBGE ou leis específicas para enriquecer seu repertório. Isso valoriza a Competência 3!"
          />
        </div>
      </div>
    </main>
  )
}
