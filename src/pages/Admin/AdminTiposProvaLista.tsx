import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import type { CardIconColor } from '../../components/cards/CardIcon'
import { FileTextIcon, CheckCircleIcon, PlusIcon, SearchIcon } from '../../components/ui/icons'
import styles from './AdminTiposProvaLista.module.css'

import { deleteTipoProva, getTiposProva, getTiposProvaResumo } from '../../services/tiposProva'
import type { TipoProva } from '../../types/tiposProva'

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

export function AdminTiposProvaLista() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<'todas' | 'ativas' | 'inativas'>('todas')
  const [pagina, setPagina] = useState(1)

  const [tiposProva, setTiposProva] = useState<TipoProva[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [totalAtivos, setTotalAtivos] = useState(0)
  const [totalInativos, setTotalInativos] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [tipoParaExcluir, setTipoParaExcluir] = useState<TipoProva | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  async function carregarTiposProva() {
    setCarregando(true)
    setErro(false)

    try {
      const [listaResponse, resumoResponse] = await Promise.all([
        getTiposProva({
          busca: busca.trim() || undefined,
          ativo: status === 'ativas' ? true : status === 'inativas' ? false : undefined,
          pagina,
          limite: ITENS_POR_PAGINA,
        }),
        getTiposProvaResumo(),
      ])

      setTiposProva(listaResponse.tipos_prova)
      setTotalPaginas(listaResponse.total_paginas || 1)
      setTotalRegistros(listaResponse.total_registros)
      setTotalAtivos(resumoResponse.tipos_prova_ativos)
      setTotalInativos(resumoResponse.tipos_prova_inativos)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarTiposProva()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, status, pagina])

  function handleNovoTipo() {
    navigate('/admin/tipos-prova/novo')
  }

  function handleEditar(id: string) {
    navigate(`/admin/tipos-prova/${id}/editar`)
  }

  async function handleExcluir() {
    if (!tipoParaExcluir) return
    setExcluindo(true)
    try {
      await deleteTipoProva(tipoParaExcluir.id)
      setTipoParaExcluir(null)
      carregarTiposProva()
    } catch (err) {
      console.error(err)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Tipos de Prova' }]} />

        <div className={styles.header}>
          <TitlePage title="Tipos de Prova" subtitle="Categorize questões e listas por tipo de prova." />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovoTipo}>
            Novo tipo de prova
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<FileTextIcon />} iconColor="purple" label="Total de tipos" value={String(totalRegistros)} />
          <AdminStatCard icon={<CheckCircleIcon />} iconColor="green" label="Ativos" value={String(totalAtivos)} />
          <AdminStatCard icon={<FileTextIcon />} iconColor="gold" label="Inativos" value={String(totalInativos)} />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar tipo de prova..."
              aria-label="Buscar tipo de prova"
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
            <p className={styles.emptyState}>Carregando tipos de prova...</p>
          </CardDiv>
        ) : erro ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar os tipos de prova.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarTiposProva}>
                Tentar novamente
              </Button>
            </div>
          </CardDiv>
        ) : tiposProva.length > 0 ? (
          <div className={styles.grid}>
            {tiposProva.map((tipo) => (
              <TipoProvaCard
                key={tipo.id}
                iconColor={getIconColor(tipo.id)}
                nome={tipo.nome}
                descricao={tipo.descricao}
                ativo={tipo.ativo}
                onEditar={() => handleEditar(tipo.id)}
                onExcluir={() => setTipoParaExcluir(tipo)}
              />
            ))}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhum tipo de prova encontrado para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {tiposProva.length} de {totalRegistros} tipos de prova
          </span>
          <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
        </div>
      </div>

      {tipoParaExcluir && (
        <ConfirmDialog
          title="Excluir tipo de prova"
          description="Tem certeza que deseja excluir este tipo de prova? Questões e listas vinculadas apenas perderão essa referência."
          confirmando={excluindo}
          onConfirm={handleExcluir}
          onClose={() => setTipoParaExcluir(null)}
        />
      )}
    </AdminPageLayout>
  )
}
