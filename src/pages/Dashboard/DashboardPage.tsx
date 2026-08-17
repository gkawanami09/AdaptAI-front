import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import type { UserProfile } from '../../types/auth'
import styles from './DashboardPage.module.css'
import { TitlePage } from '../../components/ui/TitlePage'
import { BubbleInformation } from '../../components/ui/BubbleInformation'
import { ClockIcon, CheckSquareIcon, BoltIcon, FireIcon } from '../../components/ui/icons'
import { TitleSession } from '../../components/ui/TitleSession'
import { ActivityCard } from '../../components/cards/ActivityCard'
import { AlertCard } from '../../components/cards/AlertCard'
import { CardDiv } from '../../components/cards/CardDiv'
import { Button } from '../../components/ui/Button'
import { GraphBars } from '../../components/graph/GraphBars'
import { SubjectProgressList } from '../../components/graph/SubjectProgressList'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import { useAchievementNotifications } from '../../contexts/AchievementNotificationContext'

import { getDashboardAluno } from '../../services/dashboardAluno'
import { patchConcluirTarefa } from '../../services/planoEstudos'
import type { DashboardAlunoPlanoItem, GetDashboardAlunoResponse } from '../../types/dashboardAluno'

function formatarDuracao(minutos: number) {
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto > 0 ? `${horas}h${resto}` : `${horas}h`
}

function resolverLinkAtividade(item: DashboardAlunoPlanoItem): string | undefined {
  if (!item.conteudo_slug) return undefined

  switch (item.tipo) {
    case 'aula':
      return `/aulas/${item.conteudo_slug}`
    case 'questoes':
    case 'lista':
      return `/questoes/${item.conteudo_slug}`
    case 'redacao':
      return `/redacao/${item.conteudo_slug}`
    default:
      return undefined
  }
}

export function DashboardPage() {
  const perfil = useOutletContext<UserProfile | null>()
  const navigate = useNavigate()
  const location = useLocation()
  const { checkForNewAchievements } = useAchievementNotifications()

  const [dados, setDados] = useState<GetDashboardAlunoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    (location.state as { toast?: { type: ToastType; message: string } } | null)?.toast ?? null,
  )

  useEffect(() => {
    if (location.state) navigate('.', { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function carregarDashboard() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getDashboardAluno()
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDashboard()
    checkForNewAchievements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleConcluirAtividade(itemId: string) {
    const itemAtual = dados?.plano_do_dia.find((item) => item.id === itemId)
    if (!itemAtual || itemAtual.status === 'concluido') return

    setDados((atual) =>
      atual
        ? {
            ...atual,
            plano_do_dia: atual.plano_do_dia.map((item) => (item.id === itemId ? { ...item, status: 'concluido' } : item)),
            resumo: { ...atual.resumo, tarefas_concluidas: atual.resumo.tarefas_concluidas + 1 },
          }
        : atual,
    )

    try {
      await patchConcluirTarefa(itemId)
      checkForNewAchievements()
    } catch (err) {
      console.error(err)
      setDados((atual) =>
        atual
          ? {
              ...atual,
              plano_do_dia: atual.plano_do_dia.map((item) => (item.id === itemId ? { ...item, status: itemAtual.status } : item)),
              resumo: { ...atual.resumo, tarefas_concluidas: atual.resumo.tarefas_concluidas - 1 },
            }
          : atual,
      )
      setToast({ type: 'error', message: 'Não foi possível concluir a tarefa. Tente novamente.' })
    }
  }

  return (
    <main className={styles.page}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <TitlePage
        title={`E aí, ${perfil?.nome ?? 'Aluno'}! 👋`}
        subtitle="Aqui está seu plano de estudos de hoje. Você está indo muito bem!"
      />

      {carregando ? (
        <CardDiv>
          <p className={styles.emptyState}>Carregando dashboard...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p className={styles.emptyState}>Não foi possível carregar o dashboard.</p>
          <div className={styles.retryRow}>
            <Button fullWidth={false} onClick={carregarDashboard}>
              Tentar novamente
            </Button>
          </div>
        </CardDiv>
      ) : (
        <>
          <div className={styles.cardsRow}>
            <BubbleInformation
              icon={<ClockIcon />}
              title="Tempo estudado"
              information={formatarDuracao(dados.resumo.tempo_estudado_min)}
              variant="blue"
            />
            <BubbleInformation
              icon={<CheckSquareIcon />}
              title="Tarefas concluídas"
              information={`${dados.resumo.tarefas_concluidas}/${dados.resumo.tarefas_totais}`}
              variant="green"
            />
            <BubbleInformation
              icon={<BoltIcon />}
              title="XP da semana"
              information={`${dados.resumo.xp_semana.toLocaleString('pt-BR')} XP`}
              variant="purple"
            />
            <BubbleInformation
              icon={<FireIcon />}
              title="Ofensiva atual"
              information={`${dados.resumo.ofensiva_dias} dias`}
              variant="gold"
            />
          </div>

          <div className={styles.overviewRow}>
            <div className={styles.planColumn}>
              <TitleSession title="Plano de hoje" linkTo="/plano-de-estudos" />
              <div className={styles.activityList}>
                {dados.plano_do_dia.length === 0 ? (
                  <CardDiv>
                    <p className={styles.emptyState}>Nenhuma atividade planejada para hoje.</p>
                  </CardDiv>
                ) : (
                  dados.plano_do_dia.map((item) => (
                    <ActivityCard
                      key={item.id}
                      icon={item.icone}
                      subject={item.materia}
                      subjectColor={item.materia_cor}
                      status={item.status}
                      title={item.titulo}
                      duration={formatarDuracao(item.duracao_min)}
                      progress={item.progresso}
                      onStart={() => {
                        const link = resolverLinkAtividade(item)
                        if (link) navigate(link)
                      }}
                      onComplete={() => handleConcluirAtividade(item.id)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className={styles.graphColumn}>
              <GraphBars
                title="Evolução semanal"
                data={dados.evolucao_semanal.map((ponto) => ({ label: ponto.dia_semana, value: ponto.percentual }))}
              />
              <SubjectProgressList
                title="Desempenho por matéria"
                linkTo="/progresso"
                data={dados.desempenho_por_materia.map((item) => ({
                  label: item.materia,
                  value: item.percentual,
                  color: item.cor,
                }))}
              />
              {dados.alertas.map((alerta) => (
                <AlertCard key={alerta.id} title={alerta.titulo} message={alerta.mensagem} />
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
