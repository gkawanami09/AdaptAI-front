import { TitlePage } from '../../components/ui/TitlePage'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { GroupedBarChart } from '../../components/charts/GroupedBarChart'
import { AreaLineChart } from '../../components/charts/AreaLineChart'
import { RankingListCard } from '../../components/cards/RankingListCard'
import { HeatmapCard } from '../../components/cards/HeatmapCard'
import { MonthlyGoalsCard } from '../../components/cards/MonthlyGoalsCard'
import { TargetIcon, TrendingUpIcon, FireIcon, BoltIcon } from '../../components/ui/icons'
import styles from './Progresso.module.css'

// TODO: substituir pelos dados reais vindos do backend (resumo de progresso do aluno)
const RESUMO = [
  { icon: <TargetIcon />, iconColor: 'green' as const, value: '62%', label: 'Meta mensal' },
  { icon: <TrendingUpIcon />, iconColor: 'purple' as const, value: '47h', label: 'Horas estudadas' },
  { icon: <FireIcon />, iconColor: 'gold' as const, value: '8 dias', label: 'Ofensiva atual' },
  { icon: <BoltIcon />, iconColor: 'gold' as const, value: '4.820', label: 'XP total' },
]

// TODO: substituir pelos dados reais vindos do backend (evolução de acertos por matéria)
const EVOLUCAO_ACERTOS = {
  categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  series: [
    { name: 'Matemática', color: 'blue' as const, values: [58, 62, 65, 70] },
    { name: 'Biologia', color: 'green' as const, values: [72, 70, 74, 78] },
    { name: 'História', color: 'red' as const, values: [62, 64, 68, 70] },
  ],
}

// TODO: substituir pelos dados reais vindos do backend (horas estudadas por dia da semana)
const HORAS_POR_DIA = [
  { label: 'Seg', value: 2.6 },
  { label: 'Ter', value: 1.8 },
  { label: 'Qua', value: 3.2 },
  { label: 'Qui', value: 2.2 },
  { label: 'Sex', value: 2.9 },
  { label: 'Sab', value: 1.3 },
  { label: 'Dom', value: 0.6 },
]

// TODO: substituir pelos dados reais vindos do backend (ranking de desempenho por matéria)
const RANKING_MATERIAS = [
  { label: 'Biologia', percent: 78, color: 'green' as const },
  { label: 'Português', percent: 72, color: 'gold' as const },
  { label: 'História', percent: 65, color: 'red' as const },
  { label: 'Matemática', percent: 58, color: 'blue' as const },
  { label: 'Física', percent: 45, color: 'orange' as const },
  { label: 'Química', percent: 40, color: 'purple' as const },
]

const HEATMAP_WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

// TODO: substituir pelos dados reais vindos do backend (dias estudados em maio/junho, nível 0-4)
const HEATMAP_SEMANAS = [
  [0, 3, 3, 0, 0, 4, 0],
  [3, 1, 3, 0, 3, 3, 4],
  [4, 0, 4, 3, 3, 3, 4],
  [3, 3, 0, 3, 3, 4, 0],
  [3, 3, 0, 4, 0, 3, 0],
]

// TODO: substituir pelos dados reais vindos do backend (metas mensais do aluno)
const METAS_MENSAIS = [
  { label: 'Questões resolvidas', value: 320, target: 500, color: 'purple' as const },
  { label: 'Horas de estudo', value: 47, target: 80, color: 'blue' as const },
  { label: 'Simulados feitos', value: 2, target: 4, color: 'teal' as const },
]

export function Progresso() {
  return (
    <main className={styles.page}>
      <TitlePage title="Meu progresso" subtitle="Você evoluiu mais em biologia e português essa semana" />

      <div className={styles.summaryRow}>
        {RESUMO.map((item) => (
          <StatHighlightCard
            key={item.label}
            icon={item.icon}
            iconColor={item.iconColor}
            value={item.value}
            label={item.label}
            align="left"
            iconShape="square"
          />
        ))}
      </div>

      <div className={styles.chartsRow}>
        <GroupedBarChart
          title="Evolução de acertos (%)"
          categories={EVOLUCAO_ACERTOS.categories}
          series={EVOLUCAO_ACERTOS.series}
        />
        <AreaLineChart title="Horas estudadas por dia" data={HORAS_POR_DIA} maxValue={3.2} />
      </div>

      <div className={styles.chartsRow}>
        <RankingListCard title="Ranking de matérias" items={RANKING_MATERIAS} />
        <HeatmapCard
          title="Mapa de calor — Maio/Junho"
          subtitle="Dias que você estudou"
          weekdayLabels={HEATMAP_WEEKDAYS}
          weeks={HEATMAP_SEMANAS}
        />
      </div>

      <div className={styles.fullRow}>
        <MonthlyGoalsCard title="Metas mensais — Junho" items={METAS_MENSAIS} />
      </div>
    </main>
  )
}
