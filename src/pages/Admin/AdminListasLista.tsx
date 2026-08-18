import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { FilterChip } from '../../components/ui/FilterChip'
import { SelectField } from '../../components/ui/SelectField'
import { Pagination } from '../../components/ui/Pagination'
import { CardDiv } from '../../components/cards/CardDiv'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import { QuestionListCard } from '../../components/cards/QuestionListCard'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import type { CardIconColor } from '../../components/cards/CardIcon'
import { ClipboardIcon, FileTextIcon, PlusIcon, SearchIcon } from '../../components/ui/icons'
import styles from './AdminListasLista.module.css'

import { deleteLista, getListas } from '../../services/listas'
import { getMaterias } from '../../services/materias'
import type { ListaResumo, ListaTipo } from '../../types/listas'
import type { Materias } from '../../types/materias'

const ITENS_POR_PAGINA = 6

const TIPO_LISTA_FILTERS: { value: ListaTipo | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'fixa', label: 'Fixa' },
  { value: 'gerada_ia', label: 'Gerada por IA' },
  { value: 'questoes_erradas', label: 'Questões erradas' },
  { value: 'favoritas', label: 'Favoritas' },
  { value: 'revisao', label: 'Revisão' },
]

const ICON_COLORS: CardIconColor[] = ['purple', 'green', 'blue', 'gold', 'red']

function getIconColor(seed: string): CardIconColor {
  const index = seed.split('').reduce((soma, char) => soma + char.charCodeAt(0), 0) % ICON_COLORS.length
  return ICON_COLORS[index]
}

export function AdminListasLista() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [materiaId, setMateriaId] = useState('todas')
  const [tipoLista, setTipoLista] = useState<ListaTipo | 'todas'>('todas')
  const [ordenacao, setOrdenacao] = useState('titulo-az')
  const [pagina, setPagina] = useState(1)

  const [materias, setMaterias] = useState<Materias[]>([])
  const [listas, setListas] = useState<ListaResumo[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalListas, setTotalListas] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [listaParaExcluir, setListaParaExcluir] = useState<ListaResumo | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  useEffect(() => {
    getMaterias({ limite: 100 })
      .then((resposta) => setMaterias(resposta.materias))
      .catch((err) => console.error(err))
  }, [])

  async function carregarListas() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getListas({
        busca: busca.trim() || undefined,
        materia_id: materiaId === 'todas' ? undefined : materiaId,
        tipo_lista: tipoLista === 'todas' ? undefined : tipoLista,
        ordenar: ordenacao as 'titulo-az' | 'titulo-za' | 'recentes',
        pagina,
        limite: ITENS_POR_PAGINA,
      })

      setListas(resposta.listas)
      setTotalPaginas(resposta.total_paginas || 1)
      setTotalListas(resposta.total_listas)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarListas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, materiaId, tipoLista, ordenacao, pagina])

  function handleNovaLista() {
    navigate('/admin/listas/nova')
  }

  function handleEditar(id: string) {
    navigate(`/admin/listas/${id}/editar`)
  }

  async function handleExcluir() {
    if (!listaParaExcluir) return
    setExcluindo(true)
    try {
      await deleteLista(listaParaExcluir.id)
      setListaParaExcluir(null)
      setToast({ type: 'success', message: 'Lista excluída com sucesso.' })
      carregarListas()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Não foi possível excluir esta lista.' })
    } finally {
      setExcluindo(false)
    }
  }

  function getMateriaNome(id: string | null) {
    if (!id) return ''
    return materias.find((materia) => materia.id === id)?.nome ?? ''
  }

  return (
    <AdminPageLayout>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Listas' }]} />

        <div className={styles.header}>
          <TitlePage title="Banco de Listas" subtitle="Organize questões em listas para montar provas." />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovaLista}>
            Nova lista
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<ClipboardIcon />} iconColor="purple" label="Total de listas" value={String(totalListas)} />
          <AdminStatCard icon={<FileTextIcon />} iconColor="blue" label="Questões vinculadas" value={String(listas.reduce((soma, lista) => soma + lista.total_questoes, 0))} />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar lista..."
              aria-label="Buscar lista"
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
              <span className={styles.filterLabel}>Matéria</span>
              <div className={styles.chips}>
                <FilterChip label="Todas" selected={materiaId === 'todas'} onClick={() => { setMateriaId('todas'); setPagina(1) }} />
                {materias.map((materia) => (
                  <FilterChip
                    key={materia.id}
                    label={materia.nome}
                    selected={materiaId === materia.id}
                    onClick={() => {
                      setMateriaId(materia.id)
                      setPagina(1)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Tipo</span>
              <div className={styles.chips}>
                {TIPO_LISTA_FILTERS.map((item) => (
                  <FilterChip
                    key={item.value}
                    label={item.label}
                    selected={item.value === tipoLista}
                    onClick={() => {
                      setTipoLista(item.value)
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
                <option value="titulo-az">Título (A-Z)</option>
                <option value="titulo-za">Título (Z-A)</option>
                <option value="recentes">Mais recentes</option>
              </SelectField>
            </div>
          </div>
        </CardDiv>

        {carregando ? (
          <CardDiv>
            <p className={styles.emptyState}>Carregando listas...</p>
          </CardDiv>
        ) : erro ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar as listas.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarListas}>
                Tentar novamente
              </Button>
            </div>
          </CardDiv>
        ) : listas.length > 0 ? (
          <div className={styles.grid}>
            {listas.map((lista) => (
              <QuestionListCard
                key={lista.id}
                iconColor={getIconColor(lista.id)}
                titulo={lista.titulo}
                materia={getMateriaNome(lista.materia_id)}
                tipoLista={lista.tipo_lista}
                totalQuestoes={lista.total_questoes}
                onEditar={() => handleEditar(lista.id)}
                onExcluir={() => setListaParaExcluir(lista)}
              />
            ))}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhuma lista encontrada para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {listas.length} de {totalListas} listas
          </span>
          <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
        </div>
      </div>

      {listaParaExcluir && (
        <ConfirmDialog
          title="Excluir lista"
          description="Tem certeza que deseja excluir esta lista? Todos os itens vinculados também serão removidos."
          confirmando={excluindo}
          onConfirm={handleExcluir}
          onClose={() => setListaParaExcluir(null)}
        />
      )}
    </AdminPageLayout>
  )
}
