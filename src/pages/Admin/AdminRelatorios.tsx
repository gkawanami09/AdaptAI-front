import { useEffect, useState } from 'react'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { SelectField } from '../../components/ui/SelectField'
import { Pagination } from '../../components/ui/Pagination'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import { RankingBarList } from '../../components/cards/RankingBarList'
import { ActivityFeed } from '../../components/cards/ActivityFeed'
import { RankingConteudosTable } from '../../components/cards/RankingConteudosTable'
import { AreaLineChart } from '../../components/charts/AreaLineChart'
import { DonutChart } from '../../components/charts/DonutChart'
import type { DonutChartSliceColor } from '../../components/charts/DonutChart'
import {
  BookIcon,
  CheckCircleIcon,
  ClipboardIcon,
  DownloadIcon,
  FileTextIcon,
  PencilIcon,
  StarIcon,
  TargetIcon,
  UsersIcon,
} from '../../components/ui/icons'
import type { CardIconColor } from '../../components/cards/CardIcon'
import styles from './AdminRelatorios.module.css'

import { exportarRelatorio, getRankingConteudos, getRelatorios } from '../../services/relatorios'
import type { GetRelatoriosResponse, RelatoriosPeriodo, RelatoriosRankingConteudo } from '../../types/relatorios'

const ITENS_POR_PAGINA = 5

const PERIODO_LABEL: Record<RelatoriosPeriodo, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '90d': 'Últimos 90 dias',
  '12m': 'Últimos 12 meses',
}

const DIFICULDADE_LABEL: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

const DIFICULDADE_COLOR: Record<string, DonutChartSliceColor> = {
  facil: 'green',
  medio: 'gold',
  dificil: 'red',
}

const MATERIA_COLORS: DonutChartSliceColor[] = ['purple', 'blue', 'green', 'gold', 'teal']

const ATIVIDADE_ICON: Record<string, { icon: React.ReactNode; color: CardIconColor }> = {
  prova_criada: { icon: <FileTextIcon />, color: 'blue' },
  lista_publicada: { icon: <ClipboardIcon />, color: 'purple' },
  questao_editada: { icon: <PencilIcon />, color: 'gold' },
  lista_concluida: { icon: <CheckCircleIcon />, color: 'green' },
  questao_criada: { icon: <StarIcon />, color: 'red' },
}

function formatarQuando(criadoEm: string) {
  const data = new Date(criadoEm)
  const hoje = new Date()
  const isHoje = data.toDateString() === hoje.toDateString()
  const horario = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return isHoje ? `Hoje, ${horario}` : `${data.toLocaleDateString('pt-BR')}, ${horario}`
}

export function AdminRelatorios() {
  const [periodo, setPeriodo] = useState<RelatoriosPeriodo>('30d')
  const [dados, setDados] = useState<GetRelatoriosResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [ranking, setRanking] = useState<RelatoriosRankingConteudo[]>([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const [exportando, setExportando] = useState(false)

  async function carregarRelatorios() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getRelatorios({ periodo })
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  async function carregarRanking() {
    try {
      const resposta = await getRankingConteudos({ periodo, pagina, limite: ITENS_POR_PAGINA })
      setRanking(resposta.ranking)
      setTotalPaginas(resposta.total_paginas)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    carregarRelatorios()
  }, [periodo])

  useEffect(() => {
    carregarRanking()
  }, [periodo, pagina])

  async function handleExportar() {
    setExportando(true)

    try {
      const { blob, filename } = await exportarRelatorio({ periodo })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename ?? `relatorio-${periodo}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setExportando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Relatórios' }]} />

        <div className={styles.header}>
          <TitlePage title="Relatórios" subtitle="Acompanhe o desempenho da plataforma em tempo real." />

          <div className={styles.headerActions}>
            <SelectField
              id="periodo-relatorio"
              label="Período"
              value={periodo}
              onChange={(event) => setPeriodo(event.target.value as RelatoriosPeriodo)}
            >
              {Object.entries(PERIODO_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>

            <Button fullWidth={false} icon={<DownloadIcon />} iconPosition="left" onClick={handleExportar} disabled={exportando}>
              {exportando ? 'Exportando...' : 'Exportar Relatório'}
            </Button>
          </div>
        </div>

        {carregando ? (
          <CardDiv>
            <p className={styles.emptyState}>Carregando relatórios...</p>
          </CardDiv>
        ) : erro || !dados ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar os relatórios.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarRelatorios}>
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
                label="Total de Usuários"
                value={dados.kpis.total_usuarios.toLocaleString('pt-BR')}
                sublabel={`↑ ${dados.kpis.total_usuarios_variacao_pct.toFixed(1)}% em relação ao período anterior`}
              />
              <AdminStatCard
                icon={<FileTextIcon />}
                iconColor="blue"
                label="Questões Respondidas"
                value={dados.kpis.questoes_respondidas.toLocaleString('pt-BR')}
                sublabel={`↑ ${dados.kpis.questoes_respondidas_variacao_pct.toFixed(1)}% em relação ao período anterior`}
              />
              <AdminStatCard
                icon={<ClipboardIcon />}
                iconColor="green"
                label="Listas Concluídas"
                value={dados.kpis.listas_concluidas.toLocaleString('pt-BR')}
                sublabel={`↑ ${dados.kpis.listas_concluidas_variacao_pct.toFixed(1)}% em relação ao período anterior`}
              />
              <AdminStatCard
                icon={<TargetIcon />}
                iconColor="gold"
                label="Taxa Média de Acerto"
                value={`${dados.kpis.taxa_media_acerto_pct.toFixed(0)}%`}
                sublabel={`↑ ${dados.kpis.taxa_media_acerto_variacao_pct.toFixed(1)}% em relação ao período anterior`}
              />
            </div>

            <div className={styles.chartsRow}>
              <AreaLineChart
                title="Questões Respondidas por Dia"
                data={dados.questoes_por_dia.map((ponto) => ({ label: ponto.data, value: ponto.total }))}
                valueSuffix=""
              />

              <DonutChart
                title="Distribuição por Dificuldade"
                centerLabel="Total"
                centerValue={dados.questoes_por_dia
                  .reduce((soma, ponto) => soma + ponto.total, 0)
                  .toLocaleString('pt-BR')}
                slices={dados.distribuicao_dificuldade.map((item) => ({
                  label: DIFICULDADE_LABEL[item.dificuldade] ?? item.dificuldade,
                  value: item.total,
                  percentual: item.percentual,
                  color: DIFICULDADE_COLOR[item.dificuldade] ?? 'purple',
                }))}
              />
            </div>

            <div className={styles.secondaryRow}>
              <RankingBarList
                title="Matérias Mais Estudadas"
                items={dados.materias_mais_estudadas.map((materia, index) => ({
                  id: materia.materia_id,
                  icon: <BookIcon />,
                  label: materia.nome,
                  percentual: materia.percentual,
                  color: MATERIA_COLORS[index % MATERIA_COLORS.length],
                }))}
                linkLabel="Ver todas as matérias"
              />

              <RankingBarList
                title="Tipos de Prova"
                items={dados.tipos_prova.map((tipo, index) => ({
                  id: tipo.tipo_prova_id,
                  label: tipo.nome,
                  percentual: tipo.percentual,
                  color: MATERIA_COLORS[index % MATERIA_COLORS.length],
                }))}
                linkLabel="Ver todos os tipos de prova"
              />

              <ActivityFeed
                title="Atividade Recente"
                items={dados.atividades_recentes.map((atividade) => ({
                  id: atividade.id,
                  icon: ATIVIDADE_ICON[atividade.tipo]?.icon ?? <FileTextIcon />,
                  iconColor: ATIVIDADE_ICON[atividade.tipo]?.color ?? 'purple',
                  title: atividade.titulo,
                  description: atividade.descricao,
                  quando: formatarQuando(atividade.criado_em),
                }))}
                linkLabel="Ver todas as atividades"
              />
            </div>

            <CardDiv>
              <CardHeading>Ranking de Conteúdos</CardHeading>

              <RankingConteudosTable itens={ranking} paginaOffset={(pagina - 1) * ITENS_POR_PAGINA} />

              <div className={styles.footer}>
                <span className={styles.footerText}>Página {pagina} de {totalPaginas}</span>
                <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
              </div>
            </CardDiv>
          </>
        )}
      </div>
    </AdminPageLayout>
  )
}
