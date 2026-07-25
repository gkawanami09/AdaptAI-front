import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { UnderlineTabs } from '../../components/ui/UnderlineTabs'
import { Pagination } from '../../components/ui/Pagination'
import { Loading } from '../../components/ui/Loading'
import { CardDiv } from '../../components/cards/CardDiv'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import {
  PencilIcon,
  PlusIcon,
  CheckCircleIcon,
  FolderIcon,
  BookIcon,
  SearchIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
} from '../../components/ui/icons'
import styles from './AdminMateriaDetalhe.module.css'

// api functions
import { getMateriaPorId } from '../../services/materias'
import { getTopicosPorMateria } from '../../services/modulos'

//types
import type { Materia } from '../../types/materias'
import type { Topico } from '../../types/modulos'

const TABS = [
  { value: 'modulos', label: 'Módulos' },
  { value: 'informacoes', label: 'Informações' },
  { value: 'configuracoes', label: 'Configurações' },
]

const ICONE_TOPICO_PADRAO = '📘'

function formatarData(iso: string) {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', ' ·')
}

export function AdminMateriaDetalhe() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('modulos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  const { id } = useParams<{ id: string }>()

  const [materia, setMateria] = useState<Materia | null>(null)
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [carregandoMateria, setCarregandoMateria] = useState(Boolean(id))
  const [carregandoTopicos, setCarregandoTopicos] = useState(Boolean(id))
  const [erroMateria, setErroMateria] = useState('')
  const [erroTopicos, setErroTopicos] = useState('')

  //obtem os dados da matéria pelo id vindo da URL
  useEffect(() => {
    if (!id) return

    let cancelado = false

    async function carregarMateria() {
      setCarregandoMateria(true)
      setErroMateria('')
      try {
        const response = await getMateriaPorId(id!)
        if (cancelado) return
        setMateria(response.materia)
      } catch (err) {
        console.error(err)
        if (!cancelado) setErroMateria('Não foi possível carregar essa matéria.')
      } finally {
        if (!cancelado) setCarregandoMateria(false)
      }
    }

    async function carregarTopicos() {
      setCarregandoTopicos(true)
      setErroTopicos('')
      try {
        const response = await getTopicosPorMateria({ materia_id: id! })
        if (cancelado) return
        setTopicos(response.topicos)
      } catch (err) {
        console.error(err)
        // o backend responde 404 quando a matéria ainda não tem tópicos cadastrados
        if (!cancelado) setTopicos([])
      } finally {
        if (!cancelado) setCarregandoTopicos(false)
      }
    }

    carregarMateria()
    carregarTopicos()
    return () => {
      cancelado = true
    }
  }, [id])

  const carregando = carregandoMateria || carregandoTopicos
  const erro = erroMateria || erroTopicos

  function handleEditarMateria() {
    navigate(`/admin/materias/${id}/editar`)
  }

  function handleNovoModulo() {
    navigate(`/admin/materias/${id}/modulos/novo`)
  }

  function handleEditarModulo(topico: Topico) {
    navigate(`/admin/materias/${id}/modulos/${topico.topico_id}`)
  }

  const topicosFiltrados = topicos.filter((topico) => {
    const termo = busca.trim().toLowerCase()
    return !termo || (topico.nome ?? '').toLowerCase().includes(termo)
  })

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Conteúdos', to: '/admin' },
            { label: 'Matérias', to: '/admin/materias' },
            { label: materia?.nome ?? 'Matéria' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={materia?.nome ?? 'Carregando...'}
            subtitle="Gerencie os módulos e acompanhe a estrutura da matéria"
          />

          <div className={styles.headerActions}>
            <Button
              variant="outline"
              fullWidth={false}
              icon={<PencilIcon />}
              iconPosition="left"
              onClick={handleEditarMateria}
              disabled={carregando}
            >
              Editar matéria
            </Button>
            <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovoModulo}>
              Novo módulo
            </Button>
          </div>
        </div>

        {carregando && (
          <CardDiv>
            <Loading text="Carregando matéria..." />
          </CardDiv>
        )}

        {erro && (
          <CardDiv>
            <p className={styles.emptyTab}>{erro}</p>
          </CardDiv>
        )}

        <div className={styles.statsRow}>
          <AdminStatCard
            icon={materia?.icone ?? '📐'}
            iconColor="purple"
            label="Área"
            value={materia?.area.join(', ') || '—'}
          />
          <AdminStatCard
            icon={<CheckCircleIcon />}
            iconColor={materia?.ativo ? 'green' : 'gold'}
            label="Status"
            value={materia?.ativo ? <Badge color="teal">Ativa</Badge> : <Badge color="gold">Rascunho</Badge>}
          />
          <AdminStatCard
            icon={<FolderIcon />}
            iconColor="purple"
            label="Total de módulos"
            value={String(topicos.length)}
          />
          <AdminStatCard
            icon={<BookIcon />}
            iconColor="gold"
            label="Módulos ativos"
            value={String(topicos.filter((topico) => topico.ativo).length)}
          />
        </div>

        <UnderlineTabs options={TABS} value={tab} onChange={setTab} />

        {tab === 'modulos' && (
          <CardDiv>
            <div className={styles.tableToolbar}>
              <div className={styles.tableSearch}>
                <SearchIcon className={styles.tableSearchIcon} />
                <input
                  type="search"
                  placeholder="Buscar módulo..."
                  aria-label="Buscar módulo"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  className={styles.tableSearchInput}
                />
              </div>

              <Button variant="outline" fullWidth={false} icon={<ChevronDownIcon />}>
                Filtrar por status
              </Button>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Módulo</th>
                    <th>Ordem</th>
                    <th>Status</th>
                    <th>Atualizado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {topicosFiltrados.map((topico) => {
                    const nomeExibicao = topico.nome ?? '(sem nome)'

                    return (
                      <tr
                        key={topico.topico_id}
                        className={styles.moduloRow}
                        onClick={() => handleEditarModulo(topico)}
                      >
                        <td>
                          <div className={styles.moduloCell}>
                            <span className={styles.moduloIcon}>{topico.icone ?? ICONE_TOPICO_PADRAO}</span>
                            {nomeExibicao}
                          </div>
                        </td>
                        <td>{topico.ordem}</td>
                        <td>
                          <span
                            className={`${styles.statusDot} ${styles[`statusDot--${topico.ativo ? 'ativo' : 'rascunho'}`]}`}
                          />
                          {topico.ativo ? 'Ativo' : 'Rascunho'}
                        </td>
                        <td className={styles.mutedCell}>{formatarData(topico.atualizado_em)}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.rowActionButton}
                              aria-label={`Editar ${nomeExibicao}`}
                              onClick={(event) => {
                                event.stopPropagation()
                                handleEditarModulo(topico)
                              }}
                            >
                              <PencilIcon />
                            </button>
                            <button
                              type="button"
                              className={styles.rowActionButton}
                              aria-label={`Mais ações para ${nomeExibicao}`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <MoreHorizontalIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!carregando && topicosFiltrados.length === 0 && (
              <p className={styles.emptyTab}>Nenhum módulo cadastrado para essa matéria ainda.</p>
            )}

            <div className={styles.tableFooter}>
              <span className={styles.tableFooterText}>
                Mostrando {topicosFiltrados.length} de {topicos.length} módulos
              </span>
              <Pagination page={pagina} totalPages={1} onChange={setPagina} />
            </div>
          </CardDiv>
        )}

        {tab !== 'modulos' && (
          <CardDiv>
            <p className={styles.emptyTab}>Essa aba ainda está em construção. Em breve, novidade por aqui!</p>
          </CardDiv>
        )}
      </div>
    </AdminPageLayout>
  )
}
