import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { FilterChip } from '../../components/ui/FilterChip'
import { Pagination } from '../../components/ui/Pagination'
import { CardDiv } from '../../components/cards/CardDiv'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import { TipoProvaCard } from '../../components/cards/TipoProvaCard'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import type { CardIconColor } from '../../components/cards/CardIcon'
import { FolderIcon, CheckCircleIcon, PlusIcon, SearchIcon } from '../../components/ui/icons'
import styles from './AdminTiposProvaLista.module.css'

import { deleteAreaConhecimento, getAreasConhecimento, getAreasConhecimentoResumo } from '../../services/areasConhecimento'
import type { AreaConhecimento } from '../../types/areasConhecimento'

const ITENS_POR_PAGINA = 6

const STATUS_FILTERS: { value: 'todas' | 'ativas' | 'inativas'; label: string }[] = [
  { value: 'todas', label: 'Todos' },
  { value: 'ativas', label: 'Ativos' },
  { value: 'inativas', label: 'Inativos' },
]

const ICON_COLORS: CardIconColor[] = ['purple', 'green', 'blue', 'gold', 'red']

function getIconColor(seed: string): CardIconColor {
  const index = seed.split('').reduce((soma, char) => soma + char.charCodeAt(0), 0) % ICON_COLORS.length
  return ICON_COLORS[index]
}

export function AdminAreasConhecimentoLista() {
  const navigate = useNavigate()
  const location = useLocation()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<'todas' | 'ativas' | 'inativas'>('todas')
  const [pagina, setPagina] = useState(1)

  const [areas, setAreas] = useState<AreaConhecimento[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [totalAtivas, setTotalAtivas] = useState(0)
  const [totalInativas, setTotalInativas] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [areaParaExcluir, setAreaParaExcluir] = useState<AreaConhecimento | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    (location.state as { toast?: { type: ToastType; message: string } } | null)?.toast ?? null,
  )

  useEffect(() => {
    if (location.state) navigate('.', { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function carregarAreas() {
    setCarregando(true)
    setErro(false)

    try {
      const [listaResponse, resumoResponse] = await Promise.all([
        getAreasConhecimento({
          busca: busca.trim() || undefined,
          ativo: status === 'ativas' ? true : status === 'inativas' ? false : undefined,
          pagina,
          limite: ITENS_POR_PAGINA,
        }),
        getAreasConhecimentoResumo(),
      ])

      setAreas(listaResponse.areas)
      setTotalPaginas(listaResponse.total_paginas || 1)
      setTotalRegistros(listaResponse.total_registros)
      setTotalAtivas(resumoResponse.areas_ativas)
      setTotalInativas(resumoResponse.areas_inativas)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarAreas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, status, pagina])

  function handleNovaArea() {
    navigate('/admin/areas-conhecimento/nova')
  }

  function handleEditar(id: string) {
    navigate(`/admin/areas-conhecimento/${id}/editar`)
  }

  async function handleExcluir() {
    if (!areaParaExcluir) return
    setExcluindo(true)
    try {
      await deleteAreaConhecimento(areaParaExcluir.id)
      setAreaParaExcluir(null)
      setToast({ type: 'success', message: 'Área do conhecimento excluída com sucesso.' })
      carregarAreas()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Não foi possível excluir esta área.' })
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <AdminPageLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Conteúdos', to: '/admin' }, { label: 'Áreas do Conhecimento' }]} />

        <div className={styles.header}>
          <TitlePage title="Áreas do Conhecimento" subtitle="Organize as matérias por grandes áreas de conhecimento." />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovaArea}>
            Nova área
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<FolderIcon />} iconColor="purple" label="Total de áreas" value={String(totalRegistros)} />
          <AdminStatCard icon={<CheckCircleIcon />} iconColor="green" label="Ativas" value={String(totalAtivas)} />
          <AdminStatCard icon={<FolderIcon />} iconColor="gold" label="Inativas" value={String(totalInativas)} />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar área do conhecimento..."
              aria-label="Buscar área do conhecimento"
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
          </div>
        </CardDiv>

        {carregando ? (
          <CardDiv>
            <p className={styles.emptyState}>Carregando áreas do conhecimento...</p>
          </CardDiv>
        ) : erro ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar as áreas do conhecimento.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarAreas}>
                Tentar novamente
              </Button>
            </div>
          </CardDiv>
        ) : areas.length > 0 ? (
          <div className={styles.grid}>
            {areas.map((area) => (
              <TipoProvaCard
                key={area.id}
                iconColor={getIconColor(area.id)}
                nome={area.nome}
                descricao={area.descricao}
                ativo={area.ativo}
                onEditar={() => handleEditar(area.id)}
                onExcluir={() => setAreaParaExcluir(area)}
              />
            ))}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhuma área do conhecimento encontrada para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {areas.length} de {totalRegistros} áreas do conhecimento
          </span>
          <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
        </div>
      </div>

      {areaParaExcluir && (
        <ConfirmDialog
          title="Excluir área do conhecimento"
          description={`Tem certeza que deseja excluir "${areaParaExcluir.nome}"? Matérias vinculadas apenas perderão essa referência.`}
          confirmando={excluindo}
          onConfirm={handleExcluir}
          onClose={() => setAreaParaExcluir(null)}
        />
      )}
    </AdminPageLayout>
  )
}
