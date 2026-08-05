import { useEffect, useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { GroupedBarChart } from '../../components/charts/GroupedBarChart'
import { AreaLineChart } from '../../components/charts/AreaLineChart'
import { RankingListCard } from '../../components/cards/RankingListCard'
import { HeatmapCard } from '../../components/cards/HeatmapCard'
import { MonthlyGoalsCard } from '../../components/cards/MonthlyGoalsCard'
import { TargetIcon, TrendingUpIcon, FireIcon, BoltIcon } from '../../components/ui/icons'
import styles from './Progresso.module.css'

import { getProgresso } from '../../services/progresso'
import type { GetProgressoResponse } from '../../types/progresso'

export function Progresso() {
  const [dados, setDados] = useState<GetProgressoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarProgresso() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getProgresso()
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarProgresso()
  }, [])

  return (
    <main className={styles.page}>
      <TitlePage title="Meu progresso" subtitle="Você evoluiu mais em biologia e português essa semana" />

      {carregando ? (
        <CardDiv>
          <p>Carregando progresso...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p>Não foi possível carregar o progresso.</p>
          <Button fullWidth={false} onClick={carregarProgresso}>
            Tentar novamente
          </Button>
        </CardDiv>
      ) : (
        <>
          <div className={styles.summaryRow}>
            <StatHighlightCard
              icon={<TargetIcon />}
              iconColor="green"
              value={`${dados.resumo.meta_mensal_percentual}%`}
              label="Meta mensal"
              align="left"
              iconShape="square"
            />
            <StatHighlightCard
              icon={<TrendingUpIcon />}
              iconColor="purple"
              value={dados.resumo.horas_estudadas}
              label="Horas estudadas"
              align="left"
              iconShape="square"
            />
            <StatHighlightCard
              icon={<FireIcon />}
              iconColor="gold"
              value={`${dados.resumo.ofensiva_dias} dias`}
              label="Ofensiva atual"
              align="left"
              iconShape="square"
            />
            <StatHighlightCard
              icon={<BoltIcon />}
              iconColor="gold"
              value={dados.resumo.xp_total.toLocaleString('pt-BR')}
              label="XP total"
              align="left"
              iconShape="square"
            />
          </div>

          <div className={styles.chartsRow}>
            <GroupedBarChart
              title="Evolução de acertos (%)"
              categories={dados.evolucao_acertos.categories}
              series={dados.evolucao_acertos.series}
            />
            <AreaLineChart title="Horas estudadas por dia" data={dados.horas_por_dia} />
          </div>

          <div className={styles.chartsRow}>
            <RankingListCard title="Ranking de matérias" items={dados.ranking_materias} />
            <HeatmapCard
              title="Mapa de calor — Maio/Junho"
              subtitle="Dias que você estudou"
              weekdayLabels={dados.heatmap.weekday_labels}
              weeks={dados.heatmap.weeks}
            />
          </div>

          <div className={styles.fullRow}>
            <MonthlyGoalsCard title="Metas mensais — Junho" items={dados.metas_mensais} />
          </div>
        </>
      )}
    </main>
  )
}
