import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { SelectField } from '../../components/ui/SelectField'
import { CardDiv } from '../../components/cards/CardDiv'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import { GrowthChart } from '../../components/charts/GrowthChart'
import type { GrowthChartSeriesColor } from '../../components/charts/GrowthChart'
import { TodayActivityCard } from '../../components/cards/TodayActivityCard'
import { ActivityFeed } from '../../components/cards/ActivityFeed'
import { RankingBarList } from '../../components/cards/RankingBarList'
import { QuickActions } from '../../components/cards/QuickActions'
import { AlertsSection } from '../../components/cards/AlertsSection'
import type { CardIconColor } from '../../components/cards/CardIcon'
import {
  AlertCircleIcon,
  BookIcon,
  ClipboardIcon,
  ClockIcon,
  FileTextIcon,
  FireIcon,
  FlagIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
} from '../../components/ui/icons'
import styles from './AdminDashboard.module.css'

import { getDashboard } from '../../services/dashboard'
import type { DashboardPeriodo, GetDashboardResponse } from '../../types/dashboard'

const PERIODO_LABEL: Record<DashboardPeriodo, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '90d': 'Últimos 90 dias',
  '12m': 'Últimos 12 meses',
}

const CONTEUDO_COLORS: Array<'purple' | 'blue' | 'green' | 'gold' | 'teal'> = ['purple', 'blue', 'green', 'gold', 'teal']

const ATIVIDADE_ICON: Record<string, { icon: React.ReactNode; color: CardIconColor }> = {
  materia_criada: { icon: <BookIcon />, color: 'purple' },
  questao_editada: { icon: <PencilIcon />, color: 'gold' },
  usuario_suspenso: { icon: <UserIcon />, color: 'red' },
  prova_criada: { icon: <FileTextIcon />, color: 'blue' },
  lista_publicada: { icon: <ClipboardIcon />, color: 'green' },
}

const ALERTA_ICON: Record<string, React.ReactNode> = {
  storage: <AlertCircleIcon />,
  provas_sem_questoes: <FireIcon />,
  aulas_sem_conteudo: <FlagIcon />,
  usuarios_denunciados: <FlagIcon />,
  integracoes_desconectadas: <AlertCircleIcon />,
}

function formatarQuando(criadoEm: string) {
  const data = new Date(criadoEm)
  const hoje = new Date()
  const isHoje = data.toDateString() === hoje.toDateString()
  const ontem = new Date(hoje)
  ontem.setDate(hoje.getDate() - 1)
  const isOntem = data.toDateString() === ontem.toDateString()
  const horario = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (isHoje) return `Hoje, ${horario}`
  if (isOntem) return `Ontem, ${horario}`
  return `${data.toLocaleDateString('pt-BR')}, ${horario}`
}

function formatarVariacao(valor: number, sufixo = '') {
  const seta = valor >= 0 ? '↑' : '↓'
  return `${seta} ${Math.abs(valor).toFixed(1)}${sufixo} vs mês anterior`
}

export function AdminDashboard() {
  const navigate = useNavigate()

  const [periodo, setPeriodo] = useState<DashboardPeriodo>('30d')
  const [dados, setDados] = useState<GetDashboardResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarDashboard() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getDashboard({ periodo })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo])

  const conteudoItens = dados
    ? [
        { chave: 'materias', label: 'Matérias', valor: dados.conteudo.materias },
        { chave: 'topicos', label: 'Tópicos', valor: dados.conteudo.topicos },
        { chave: 'aulas', label: 'Aulas', valor: dados.conteudo.aulas },
        { chave: 'questoes', label: 'Questões', valor: dados.conteudo.questoes },
        { chave: 'provas', label: 'Provas', valor: dados.conteudo.provas },
        { chave: 'listas', label: 'Listas', valor: dados.conteudo.listas },
      ]
    : []
  const conteudoMax = Math.max(...conteudoItens.map((item) => item.valor), 1)

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <TitlePage title="Dashboard" subtitle="Visão geral da plataforma" />

          <div className={styles.headerActions}>
            <SelectField
              id="periodo-dashboard"
              label="Período"
              value={periodo}
              onChange={(event) => setPeriodo(event.target.value as DashboardPeriodo)}
            >
              {Object.entries(PERIODO_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

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
            <div className={styles.statsRow}>
              <AdminStatCard
                icon={<UsersIcon />}
                iconColor="purple"
                label="Usuários"
                value={dados.kpis.total_usuarios.toLocaleString('pt-BR')}
                sublabel={formatarVariacao(dados.kpis.total_usuarios_variacao_pct, '%')}
              />
              <AdminStatCard
                icon={<BookIcon />}
                iconColor="green"
                label="Questões respondidas"
                value={dados.kpis.questoes_respondidas.toLocaleString('pt-BR')}
                sublabel={formatarVariacao(dados.kpis.questoes_respondidas_variacao_pct, '%')}
              />
              <AdminStatCard
                icon={<FileTextIcon />}
                iconColor="gold"
                label="Provas realizadas"
                value={dados.kpis.provas_realizadas.toLocaleString('pt-BR')}
                sublabel={formatarVariacao(dados.kpis.provas_realizadas_variacao_pct, '%')}
              />
              <AdminStatCard
                icon={<FireIcon />}
                iconColor="purple"
                label="Ofensiva média"
                value={`${dados.kpis.ofensiva_media_dias} dias`}
                sublabel={formatarVariacao(dados.kpis.ofensiva_media_variacao_dias, ' dia')}
              />
            </div>

            <div className={styles.mainRow}>
              <GrowthChart
                title="Crescimento da plataforma"
                labels={dados.crescimento.map((ponto) => ponto.data)}
                series={
                  [
                    { id: 'usuarios', label: 'Usuários', color: 'purple' as GrowthChartSeriesColor, values: dados.crescimento.map((p) => p.usuarios) },
                    { id: 'questoes', label: 'Questões respondidas', color: 'blue' as GrowthChartSeriesColor, values: dados.crescimento.map((p) => p.questoes_respondidas) },
                    { id: 'listas', label: 'Listas concluídas', color: 'green' as GrowthChartSeriesColor, values: dados.crescimento.map((p) => p.listas_concluidas) },
                    { id: 'provas', label: 'Provas realizadas', color: 'gold' as GrowthChartSeriesColor, values: dados.crescimento.map((p) => p.provas_realizadas) },
                  ]
                }
              />

              <TodayActivityCard
                title="Atividade de hoje"
                items={[
                  { id: 'online', icon: <UserIcon />, label: 'Usuários online', value: dados.atividade_hoje.usuarios_online.toLocaleString('pt-BR') },
                  { id: 'questoes', icon: <ClipboardIcon />, label: 'Questões respondidas', value: dados.atividade_hoje.questoes_respondidas.toLocaleString('pt-BR') },
                  { id: 'cadastros', icon: <UsersIcon />, label: 'Novos cadastros', value: dados.atividade_hoje.novos_cadastros.toLocaleString('pt-BR') },
                  { id: 'provas', icon: <PlayIcon />, label: 'Provas iniciadas', value: dados.atividade_hoje.provas_iniciadas.toLocaleString('pt-BR') },
                  {
                    id: 'tempo',
                    icon: <ClockIcon />,
                    label: 'Tempo médio de estudo',
                    value: `${Math.floor(dados.atividade_hoje.tempo_medio_estudo_min / 60)}h ${dados.atividade_hoje.tempo_medio_estudo_min % 60}m`,
                  },
                ]}
              />
            </div>

            <div className={styles.secondaryRow}>
              <ActivityFeed
                title="Últimas atividades"
                items={dados.atividades_recentes.map((atividade) => ({
                  id: atividade.id,
                  icon: ATIVIDADE_ICON[atividade.tipo]?.icon ?? <FileTextIcon />,
                  iconColor: ATIVIDADE_ICON[atividade.tipo]?.color ?? 'purple',
                  title: atividade.titulo,
                  description: atividade.descricao,
                  quando: formatarQuando(atividade.criado_em),
                }))}
                linkLabel="Ver todas atividades"
                onLinkClick={() => navigate('/admin/relatorios')}
              />

              <RankingBarList
                title="Conteúdo da plataforma"
                items={conteudoItens.map((item, index) => ({
                  id: item.chave,
                  label: item.label,
                  percentual: (item.valor / conteudoMax) * 100,
                  color: CONTEUDO_COLORS[index % CONTEUDO_COLORS.length],
                }))}
                linkLabel="Ir para conteúdos"
                onLinkClick={() => navigate('/admin/materias')}
              />

              <QuickActions
                title="Ações rápidas"
                actions={[
                  { id: 'materia', icon: <PlusIcon />, label: 'Nova Matéria', onClick: () => navigate('/admin/materias/nova') },
                  { id: 'aula', icon: <PlusIcon />, label: 'Nova Aula', onClick: () => navigate('/admin/aulas') },
                  { id: 'questao', icon: <PlusIcon />, label: 'Nova Questão', onClick: () => navigate('/admin/questoes/nova') },
                  { id: 'lista', icon: <PlusIcon />, label: 'Nova Lista', onClick: () => navigate('/admin/listas/nova') },
                  { id: 'prova', icon: <PlusIcon />, label: 'Nova Prova', onClick: () => navigate('/admin/tipos-prova/novo') },
                  { id: 'usuario', icon: <PlusIcon />, label: 'Novo Usuário', onClick: () => navigate('/admin/usuarios') },
                ]}
              />
            </div>

            <AlertsSection
              title="Alertas importantes"
              items={dados.alertas.map((alerta) => ({
                id: alerta.id,
                icon: ALERTA_ICON[alerta.tipo] ?? <AlertCircleIcon />,
                severidade: alerta.severidade,
                descricao: alerta.descricao,
                detalhe: alerta.detalhe,
                link: alerta.link,
              }))}
              linkLabel="Ver todos os alertas"
              onLinkClick={() => navigate('/admin/configuracoes')}
            />
          </>
        )}
      </div>
    </AdminPageLayout>
  )
}
