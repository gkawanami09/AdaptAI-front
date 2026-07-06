import { useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { WeekDayPicker } from '../../components/calendar/WeekDayPicker'
import type { WeekDayItem } from '../../components/calendar/WeekDayPicker'
import { CardHeading } from '../../components/cards/CardHeading'
import { DayTaskCard } from '../../components/cards/DayTaskCard'
import { WeekOverviewCard } from '../../components/calendar/WeekOverviewCard'
import { PriorityListCard } from '../../components/cards/PriorityListCard'
import { StatsListCard } from '../../components/cards/StatsListCard'
import { PlusIcon, SparklesIcon } from '../../components/ui/icons'
import styles from './PlanoEstudos.module.css'

const PERIODO_OPTIONS = [
  { value: 'dia', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
]

// TODO: substituir pelos dados reais vindos do backend (progresso do período selecionado)
const PROGRESSO_POR_PERIODO: Record<string, { value: number; label: string }> = {
  dia: { value: 40, label: '40% do dia' },
  semana: { value: 18, label: '18% da semana' },
  mes: { value: 62, label: '62% do mês' },
}

// TODO: substituir pelos dados reais vindos do backend (dias da semana e tarefas)
const DIAS_DA_SEMANA: WeekDayItem[] = [
  { label: 'Dom', date: 15 },
  { label: 'Seg', date: 9, hasTasks: true },
  { label: 'Ter', date: 10, hasTasks: true },
  { label: 'Qua', date: 11, hasTasks: true },
  { label: 'Qui', date: 12, hasTasks: true },
  { label: 'Sex', date: 13, hasTasks: true },
  { label: 'Sáb', date: 14 },
]

const NOME_COMPLETO_DIA: Record<string, string> = {
  Dom: 'Domingo',
  Seg: 'Segunda',
  Ter: 'Terça',
  Qua: 'Quarta',
  Qui: 'Quinta',
  Sex: 'Sexta',
  Sáb: 'Sábado',
}

// TODO: substituir pelos dados reais vindos do backend (visão geral da semana)
const VISAO_GERAL_SEMANA = [
  {
    day: 'Seg',
    badges: [
      { label: 'Concluído', color: 'teal' as const },
      { label: 'Matemática', color: 'blue' as const },
    ],
    completed: 2,
    total: 2,
  },
  {
    day: 'Ter',
    badges: [
      { label: 'Biologia', color: 'green' as const },
      { label: 'Matemática', color: 'blue' as const },
    ],
    completed: 0,
    total: 2,
  },
  {
    day: 'Qua',
    badges: [
      { label: 'Física', color: 'gold' as const },
      { label: 'Química', color: 'purple' as const },
    ],
    completed: 0,
    total: 2,
  },
  {
    day: 'Qui',
    badges: [
      { label: 'Português', color: 'gold' as const },
      { label: 'História', color: 'red' as const },
    ],
    completed: 0,
    total: 2,
  },
  {
    day: 'Sex',
    badges: [{ label: 'Matemática', color: 'blue' as const }],
    completed: 0,
    total: 1,
  },
  {
    day: 'Sáb',
    badges: [
      { label: 'Biologia', color: 'green' as const },
      { label: 'Química', color: 'purple' as const },
    ],
    completed: 0,
    total: 2,
  },
  {
    day: 'Dom',
    restLabel: 'Descanso',
    completed: 0,
    total: 0,
  },
]

// TODO: substituir pelos dados reais vindos do backend (prioridades da semana)
const PRIORIDADES_DA_SEMANA = [
  {
    subject: 'Matemática',
    description: 'Abaixo da meta — 58%',
    priority: 'alta' as const,
    tone: 'blue' as const,
  },
  {
    subject: 'Química',
    description: 'Muitos erros recentes',
    priority: 'alta' as const,
    tone: 'purple' as const,
    icon: '🧪',
  },
  {
    subject: 'Física',
    description: 'Pouco tempo dedicado',
    priority: 'media' as const,
    tone: 'gold' as const,
    icon: '⚡',
  },
]

// TODO: substituir pelos dados reais vindos do backend (estatísticas do plano)
const ESTATISTICAS = [
  { label: 'Horas planejadas', value: '14h', color: 'purple' as const },
  { label: 'Horas concluídas', value: '3h15', color: 'teal' as const },
  { label: 'Tarefas restantes', value: '9', color: 'gold' as const },
]

// TODO: substituir pelos dados reais vindos do backend (tarefas do dia selecionado)
const TAREFAS_DO_DIA = [
  {
    icon: '📐',
    iconColor: 'blue' as const,
    title: 'Função quadrática',
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    duration: '45 min',
    completed: true,
  },
  {
    icon: '✍️',
    iconColor: 'purple' as const,
    title: 'Repertório sociocultural',
    subject: 'Redação',
    subjectColor: 'purple' as const,
    duration: '30 min',
    completed: true,
  },
]

export function PlanoEstudos() {
  const [periodo, setPeriodo] = useState('semana')
  const [diaSelecionado, setDiaSelecionado] = useState(9)
  const progresso = PROGRESSO_POR_PERIODO[periodo]

  const dia = DIAS_DA_SEMANA.find((item) => item.date === diaSelecionado)
  const tituloDia = dia ? `${NOME_COMPLETO_DIA[dia.label]}, ${dia.date} de junho` : ''

  function handlePrevWeek() {
    // TODO: conectar à navegação real de semanas (carregar dados da semana anterior)
    console.log('semana anterior')
  }

  function handleNextWeek() {
    // TODO: conectar à navegação real de semanas (carregar dados da próxima semana)
    console.log('próxima semana')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TitlePage title="Plano de Estudos" subtitle="Semana de 09 a 15 de julho · 2/11 tarefas concluídas" />

        <div className={styles.actions}>
          <Button pill fullWidth={false} icon={<SparklesIcon />} iconPosition="left">
            Reorganizar com IA
          </Button>
          <Button variant="outline" pill fullWidth={false} icon={<PlusIcon />} iconPosition="left">
            Adicionar tarefa
          </Button>
        </div>
      </div>

      <div className={styles.periodRow}>
        <SegmentedControl options={PERIODO_OPTIONS} value={periodo} onChange={setPeriodo} />
        <div className={styles.periodProgress}>
          <ProgressBar value={progresso.value} color="purple" size="md" />
        </div>
        <span className={styles.periodLabel}>{progresso.label}</span>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.mainColumn}>
          <WeekDayPicker
            days={DIAS_DA_SEMANA}
            selected={diaSelecionado}
            onSelect={setDiaSelecionado}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />

          <div className={styles.dayTasks}>
            <CardHeading>{tituloDia}</CardHeading>

            <div className={styles.dayTasksList}>
              {TAREFAS_DO_DIA.map((tarefa) => (
                <DayTaskCard
                  key={tarefa.title}
                  icon={tarefa.icon}
                  iconColor={tarefa.iconColor}
                  title={tarefa.title}
                  subject={tarefa.subject}
                  subjectColor={tarefa.subjectColor}
                  duration={tarefa.duration}
                  completed={tarefa.completed}
                />
              ))}
            </div>
          </div>

          <div className={styles.weekOverview}>
            <WeekOverviewCard title="Visão geral da semana" rows={VISAO_GERAL_SEMANA} />
          </div>
        </div>

        <div className={styles.sideColumn}>
          <PriorityListCard title="Prioridades da semana" items={PRIORIDADES_DA_SEMANA} />
          <StatsListCard title="estatística" items={ESTATISTICAS} />
        </div>
      </div>
    </div>
  )
}
