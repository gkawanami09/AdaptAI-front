import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { FilterChip } from '../../components/ui/FilterChip'
import { SelectField } from '../../components/ui/SelectField'
import { Pagination } from '../../components/ui/Pagination'
import { CardDiv } from '../../components/cards/CardDiv'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import { AulaAdminCard } from '../../components/cards/AulaAdminCard'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import type { CardIconColor } from '../../components/cards/CardIcon'
import { BookIcon, CheckCircleIcon, FileTextIcon, PlusIcon, SearchIcon, StarIcon } from '../../components/ui/icons'
import styles from './AdminAulaLista.module.css'

import { deleteAula, getAulas } from '../../services/aulas'
import type { AulaResumo, AulaDificuldade } from '../../types/aulas'

const ITENS_POR_PAGINA = 6

const DIFICULDADE_FILTERS: { value: AulaDificuldade | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'basico', label: 'Básico' },
  { value: 'medio', label: 'Médio' },
  { value: 'dificil', label: 'Difícil' },
]

const STATUS_FILTERS: { value: 'todas' | 'ativas' | 'inativas' | 'mais-cobradas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'ativas', label: 'Ativas' },
  { value: 'inativas', label: 'Inativas' },
  { value: 'mais-cobradas', label: 'Mais cobradas' },
]

const ICON_COLORS: CardIconColor[] = ['purple', 'green', 'blue', 'gold', 'red']

function getIconColor(seed: string): CardIconColor {
  const index = seed.split('').reduce((soma, char) => soma + char.charCodeAt(0), 0) % ICON_COLORS.length
  return ICON_COLORS[index]
}

function contarTipo(aula: AulaResumo, tipo: 'texto' | 'video') {
  return aula.conteudos.filter((conteudo) => conteudo.tipo === tipo).length
}

function duracaoTotal(aula: AulaResumo) {
  return aula.conteudos.reduce((soma, conteudo) => soma + conteudo.duracao, 0)
}

export function AdminAulaLista() {
  const navigate = useNavigate()
  const location = useLocation()
  const [busca, setBusca] = useState('')
  const [dificuldade, setDificuldade] = useState<AulaDificuldade | 'todas'>('todas')
  const [status, setStatus] = useState<'todas' | 'ativas' | 'inativas' | 'mais-cobradas'>('todas')
  const [ordenacao, setOrdenacao] = useState('nome-az')
  const [pagina, setPagina] = useState(1)

  const [aulas, setAulas] = useState<AulaResumo[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalAulas, setTotalAulas] = useState(0)
  const [totalConteudos, setTotalConteudos] = useState(0)
  const [totalPublicadas, setTotalPublicadas] = useState(0)
  const [totalMaisCobradas, setTotalMaisCobradas] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [aulaParaExcluir, setAulaParaExcluir] = useState<AulaResumo | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    (location.state as { toast?: { type: ToastType; message: string } } | null)?.toast ?? null,
  )

  useEffect(() => {
    if (location.state) navigate('.', { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function carregarAulas() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getAulas({
        busca: busca.trim() || undefined,
        dificuldade: dificuldade === 'todas' ? undefined : dificuldade,
        ativo: status === 'ativas' ? true : status === 'inativas' ? false : undefined,
        mais_cobrado: status === 'mais-cobradas' ? true : undefined,
        ordenar: ordenacao as 'nome-az' | 'nome-za' | 'recentes',
        pagina,
        limite: ITENS_POR_PAGINA,
      })

      setAulas(resposta.aulas)
      setTotalPaginas(resposta.total_paginas)
      setTotalAulas(resposta.total_aulas)
      setTotalConteudos(resposta.total_conteudos)
      setTotalPublicadas(resposta.total_publicadas)
      setTotalMaisCobradas(resposta.total_mais_cobradas)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarAulas()
  }, [busca, dificuldade, status, ordenacao, pagina])

  function handleNovaAula() {
    navigate('/admin/materias')
  }

  function handleVerConteudos(aula: AulaResumo) {
    navigate(`/admin/materias/${aula.materia_id}/modulos/${aula.topico_id}/aulas/${aula.id}/preview`)
  }

  function handleEditar(aula: AulaResumo) {
    navigate(`/admin/materias/${aula.materia_id}/modulos/${aula.topico_id}/aulas/${aula.id}/editar`)
  }

  async function handleExcluir() {
    if (!aulaParaExcluir) return
    setExcluindo(true)
    try {
      await deleteAula(aulaParaExcluir.id)
      setAulaParaExcluir(null)
      setToast({ type: 'success', message: 'Aula excluída com sucesso.' })
      carregarAulas()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Não foi possível excluir esta aula.' })
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <AdminPageLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Conteúdos', to: '/admin' }, { label: 'Aulas' }]} />

        <div className={styles.header}>
          <TitlePage title="Gerenciar Aulas" subtitle="Organize as aulas da matéria e acompanhe seus conteúdos." />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovaAula}>
            Nova aula
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<BookIcon />} iconColor="purple" label="Total de aulas" value={String(totalAulas)} sublabel="Aulas cadastradas" />
          <AdminStatCard icon={<FileTextIcon />} iconColor="blue" label="Conteúdos" value={String(totalConteudos)} sublabel="Vídeos + Textos" />
          <AdminStatCard icon={<CheckCircleIcon />} iconColor="green" label="Publicadas" value={String(totalPublicadas)} sublabel="Aulas ativas" />
          <AdminStatCard icon={<StarIcon />} iconColor="gold" label="Mais cobradas" value={String(totalMaisCobradas)} sublabel="Aulas favoritas" />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar aula..."
              aria-label="Buscar aula"
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value)
                setPagina(1)
              }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Dificuldade</span>
              <div className={styles.chips}>
                {DIFICULDADE_FILTERS.map((item) => (
                  <FilterChip
                    key={item.value}
                    label={item.label}
                    selected={item.value === dificuldade}
                    onClick={() => {
                      setDificuldade(item.value)
                      setPagina(1)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Status</span>
              <div className={styles.chips}>
                {STATUS_FILTERS.map((item) => (
                  <FilterChip
                    key={item.value}
                    label={item.label}
                    selected={item.value === status}
                    onClick={() => {
                      setStatus(item.value)
                      setPagina(1)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.sortGroup}>
              <SelectField
                id="ordenar-por"
                label="Ordenar por"
                value={ordenacao}
                onChange={(event) => setOrdenacao(event.target.value)}
              >
                <option value="nome-az">Nome (A-Z)</option>
                <option value="nome-za">Nome (Z-A)</option>
                <option value="recentes">Mais recentes</option>
              </SelectField>
            </div>
          </div>
        </CardDiv>

        {carregando ? (
          <CardDiv>
            <p className={styles.emptyState}>Carregando aulas...</p>
          </CardDiv>
        ) : erro ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar as aulas.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarAulas}>
                Tentar novamente
              </Button>
            </div>
          </CardDiv>
        ) : aulas.length > 0 ? (
          <div className={styles.grid}>
            {aulas.map((aula) => (
              <AulaAdminCard
                key={aula.id}
                icon={<BookIcon />}
                iconColor={getIconColor(aula.id)}
                title={aula.titulo}
                resumo={aula.resumo}
                ativo={aula.ativo}
                dificuldade={aula.dificuldade}
                maisCobrado={aula.mais_cobrado}
                totalTextos={contarTipo(aula, 'texto')}
                totalVideos={contarTipo(aula, 'video')}
                duracaoTotalMin={duracaoTotal(aula)}
                onVerConteudos={() => handleVerConteudos(aula)}
                onEditar={() => handleEditar(aula)}
                onExcluir={() => setAulaParaExcluir(aula)}
              />
            ))}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhuma aula encontrada para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {aulas.length} de {totalAulas} aulas
          </span>
          <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
        </div>
      </div>

      {aulaParaExcluir && (
        <ConfirmDialog
          title="Excluir aula"
          description={`Tem certeza que deseja excluir "${aulaParaExcluir.titulo}"? Os conteúdos (vídeos e textos) desta aula também serão removidos.`}
          confirmando={excluindo}
          onConfirm={handleExcluir}
          onClose={() => setAulaParaExcluir(null)}
        />
      )}
    </AdminPageLayout>
  )
}
