import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { WeekDayPicker } from '../../components/calendar/WeekDayPicker'
import { CardHeading } from '../../components/cards/CardHeading'
import { CardDiv } from '../../components/cards/CardDiv'
import { DayTaskCard } from '../../components/cards/DayTaskCard'
import { WeekOverviewCard } from '../../components/calendar/WeekOverviewCard'
import { PriorityListCard } from '../../components/cards/PriorityListCard'
import { StatsListCard } from '../../components/cards/StatsListCard'
import { PlusIcon, SparklesIcon } from '../../components/ui/icons'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import styles from './PlanoEstudos.module.css'

import { getPlanoEstudos, postReorganizarPlanoComIA } from '../../services/planoEstudos'
import type { GetPlanoEstudosResponse, PlanoEstudosPeriodo } from '../../types/planoEstudos'

const PERIODO_OPTIONS: { value: PlanoEstudosPeriodo; label: string }[] = [
  { value: 'dia', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
]

function formatarDataISO(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function parseDataISO(dataIso: string) {
  const [ano, mes, dia] = dataIso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

function formatarDuracao(minutos: number) {
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto > 0 ? `${horas}h${resto}` : `${horas}h`
}

export function PlanoEstudos() {
  const navigate = useNavigate()
  const [periodo, setPeriodo] = useState<PlanoEstudosPeriodo>('semana')
  const [dataReferencia, setDataReferencia] = useState(() => new Date())
  const [dados, setDados] = useState<GetPlanoEstudosResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [reorganizando, setReorganizando] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  async function carregarPlano() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getPlanoEstudos({ periodo, data: formatarDataISO(dataReferencia) })
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarPlano()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo, dataReferencia])

  function handlePrevWeek() {
    const proxima = new Date(dataReferencia)
    proxima.setDate(proxima.getDate() - 7)
    setDataReferencia(proxima)
  }

  function handleNextWeek() {
    const proxima = new Date(dataReferencia)
    proxima.setDate(proxima.getDate() + 7)
    setDataReferencia(proxima)
  }

  function handleSelecionarDia(diaSelecionado: number) {
    const dia = dados?.dias_da_semana.find((item) => item.data === diaSelecionado)
    if (dia) setDataReferencia(parseDataISO(dia.data_iso))
  }

  async function handleReorganizarComIA() {
    setReorganizando(true)
    try {
      await postReorganizarPlanoComIA()
      await carregarPlano()
      setToast({ type: 'success', message: 'Plano reorganizado com sucesso.' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Não foi possível reorganizar o plano. Tente novamente.' })
    } finally {
      setReorganizando(false)
    }
  }

  const diaSelecionadoNumero = dataReferencia.getDate()
  const diaAtual = dados?.dias_da_semana.find((item) => item.data_iso === formatarDataISO(dataReferencia))

  return (
    <div className={styles.container}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className={styles.header}>
        <TitlePage title="Plano de Estudos" subtitle={dados?.intervalo_label ?? ''} />

        <div className={styles.actions}>
          <Button
            pill
            fullWidth={false}
            icon={<SparklesIcon />}
            iconPosition="left"
            onClick={handleReorganizarComIA}
            disabled={reorganizando}
          >
            Reorganizar com IA
          </Button>
          <Button variant="outline" pill fullWidth={false} icon={<PlusIcon />} iconPosition="left">
            Adicionar tarefa
          </Button>
          <Button pill fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={() => navigate('/plano-de-estudos/criar')}>
            Criar plano de estudos
          </Button>
        </div>
      </div>

      {carregando ? (
        <CardDiv>
          <p className={styles.emptyState}>Carregando plano de estudos...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p className={styles.emptyState}>Não foi possível carregar o plano de estudos.</p>
          <div className={styles.retryRow}>
            <Button fullWidth={false} onClick={carregarPlano}>
              Tentar novamente
            </Button>
          </div>
        </CardDiv>
      ) : (
        <>
          <div className={styles.periodRow}>
            <SegmentedControl options={PERIODO_OPTIONS} value={periodo} onChange={(value) => setPeriodo(value as PlanoEstudosPeriodo)} />
            <div className={styles.periodProgress}>
              <ProgressBar value={dados.progresso.percentual} color="purple" size="md" />
            </div>
            <span className={styles.periodLabel}>{dados.progresso.label}</span>
          </div>

          <div className={styles.contentRow}>
            <div className={styles.mainColumn}>
              <WeekDayPicker
                days={dados.dias_da_semana.map((dia) => ({ label: dia.label, date: dia.data, hasTasks: dia.tem_tarefas }))}
                selected={diaSelecionadoNumero}
                onSelect={handleSelecionarDia}
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
              />

              <div className={styles.dayTasks}>
                <CardHeading>{diaAtual?.label ?? ''}</CardHeading>

                <div className={styles.dayTasksList}>
                  {dados.tarefas_do_dia.length === 0 ? (
                    <p className={styles.emptyState}>Nenhuma tarefa para este dia.</p>
                  ) : (
                    dados.tarefas_do_dia.map((tarefa) => (
                      <DayTaskCard
                        key={tarefa.id}
                        icon={tarefa.icone}
                        iconColor={tarefa.icone_cor}
                        title={tarefa.titulo}
                        subject={tarefa.materia}
                        subjectColor={tarefa.materia_cor}
                        duration={formatarDuracao(tarefa.duracao_min)}
                        completed={tarefa.concluida}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className={styles.weekOverview}>
                <WeekOverviewCard
                  title="Visão geral da semana"
                  rows={dados.visao_geral_semana.map((linha) => ({
                    day: linha.dia,
                    badges: linha.badges,
                    restLabel: linha.descanso_label,
                    completed: linha.concluidas,
                    total: linha.total,
                  }))}
                />
              </div>
            </div>

            <div className={styles.sideColumn}>
              <PriorityListCard
                title="Prioridades da semana"
                items={dados.prioridades_da_semana.map((item) => ({
                  subject: item.materia,
                  description: item.descricao,
                  priority: item.prioridade,
                  tone: item.tom,
                  icon: item.icone,
                }))}
              />
              <StatsListCard
                title="estatística"
                items={dados.estatisticas.map((item) => ({ label: item.label, value: item.valor, color: item.cor }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
