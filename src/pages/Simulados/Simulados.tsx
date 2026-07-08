import { TitlePage } from '../../components/ui/TitlePage'
import { SimuladoCard } from '../../components/cards/SimuladoCard'
import { HistoricoCard } from '../../components/cards/HistoricoCard'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { TargetIcon, ClockIcon, BarChartIcon } from '../../components/ui/icons'
import styles from './Simulados.module.css'

// TODO: substituir pelos dados reais vindos do backend (resumo de desempenho em simulados)
const RESUMO = [
  { icon: <TargetIcon />, iconColor: 'purple' as const, value: '620', label: 'Nota estimada' },
  { icon: <ClockIcon />, iconColor: 'blue' as const, value: '5h22', label: 'Tempo médio' },
  { icon: <BarChartIcon />, iconColor: 'green' as const, value: '68%', label: 'Taxa de acerto' },
]

// TODO: substituir pelos dados reais vindos do backend (catálogo de simulados)
const SIMULADOS = [
  {
    icon: '📋',
    iconColor: 'purple' as const,
    title: 'Simulado ENEM Completo',
    description: '180 questões · 4 áreas',
    tag: 'Completo',
    tagColor: 'purple' as const,
    duration: '5h30',
  },
  {
    icon: '📐',
    iconColor: 'blue' as const,
    title: 'Simulado Rápido — Matemática',
    description: '30 questões · 1 área',
    tag: 'Rápido',
    tagColor: 'blue' as const,
    duration: '1h',
  },
  {
    icon: '🔄',
    iconColor: 'red' as const,
    title: 'Revisão de Questões Erradas',
    description: 'Baseado nos seus erros',
    tag: 'Personalizado',
    tagColor: 'red' as const,
    duration: '45 min',
  },
  {
    icon: '🎯',
    iconColor: 'green' as const,
    title: 'Treino por Área',
    description: 'Escolha uma área do ENEM',
    tag: 'Flexível',
    tagColor: 'teal' as const,
    duration: '1h30',
  },
]

// TODO: substituir pelos dados reais vindos do backend (histórico de simulados do usuário)
const HISTORICO = [
  { day: '02', title: 'Simulado ENEM — 02/06', tempo: '5h12', score: 620, acertos: 68 },
  { day: '25', title: 'Simulado ENEM — 25/05', tempo: '5h30', score: 598, acertos: 64 },
  { day: '18', title: 'Simulado ENEM — 18/05', tempo: '5h45', score: 572, acertos: 60 },
]

export function Simulados() {
  return (
    <main className={styles.page}>
      <TitlePage title="Simulados" subtitle="Treine como se fosse o dia da prova" />

      <div className={styles.summaryRow}>
        {RESUMO.map((item) => (
          <StatHighlightCard
            key={item.label}
            icon={item.icon}
            iconColor={item.iconColor}
            value={item.value}
            label={item.label}
          />
        ))}
      </div>

      <div className={styles.grid}>
        {SIMULADOS.map((simulado) => (
          <SimuladoCard
            key={simulado.title}
            icon={simulado.icon}
            iconColor={simulado.iconColor}
            title={simulado.title}
            description={simulado.description}
            tag={simulado.tag}
            tagColor={simulado.tagColor}
            duration={simulado.duration}
          />
        ))}
      </div>

      <div className={styles.historico}>
        <HistoricoCard title="Histórico de simulados" items={HISTORICO} />
      </div>
    </main>
  )
}
