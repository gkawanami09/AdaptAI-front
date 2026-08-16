import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
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
import { CardIcon } from '../../components/cards/CardIcon'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import {
  PencilIcon,
  PlusIcon,
  BookIcon,
  CalendarIcon,
  TargetIcon,
  SearchIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  GripVerticalIcon,
} from '../../components/ui/icons'
import styles from './AdminModuloDetalhe.module.css'

import { getMateriaPorId } from '../../services/materias'
import { getTopicosPorMateria } from '../../services/modulos'
import { getAulasPorMateria, patchAulasOrdem } from '../../services/aulas'
import type { Topico } from '../../types/modulos'
import type { Aula } from '../../types/aulas'

const TABS = [
  { value: 'aulas', label: 'Aulas' },
  { value: 'detalhes', label: 'Detalhes' },
  { value: 'configuracoes', label: 'Configurações' },
]

const DIFICULDADE_CONFIG = {
  basico: { label: 'Básico', color: 'teal' as const },
  medio: { label: 'Médio', color: 'gold' as const },
  dificil: { label: 'Difícil', color: 'red' as const },
}

const ICONE_TOPICO_PADRAO = '📘'

function formatarData(iso: string) {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return '—'
  return data.toLocaleDateString('pt-BR')
}

export function AdminModuloDetalhe() {
  const navigate = useNavigate()
  const { materiaId, topicoId } = useParams<{ materiaId: string; topicoId: string }>()

  const [materiaNome, setMateriaNome] = useState('')
  const [topico, setTopico] = useState<Topico | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [tab, setTab] = useState('aulas')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)
  const [aulas, setAulas] = useState<Aula[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [erroOrdem, setErroOrdem] = useState('')
  // Refs porque os handlers de pointer precisam do valor mais atual sem esperar o re-render.
  const dragIndexRef = useRef<number | null>(null)
  const overIndexRef = useRef<number | null>(null)
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([])

  //carrega o nome da matéria, o tópico (não existe GET por tópico individual, então filtra da lista)
  //e as aulas (o endpoint é por matéria, então filtra pelas que pertencem a este tópico)
  useEffect(() => {
    if (!materiaId || !topicoId) return

    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [respostaMateria, respostaTopicos, respostaAulas] = await Promise.all([
          getMateriaPorId(materiaId!),
          getTopicosPorMateria({ materia_id: materiaId! }),
          getAulasPorMateria({ materia_id: materiaId! }),
        ])
        if (cancelado) return

        setMateriaNome(respostaMateria.materia.nome)

        const encontrado = respostaTopicos.topicos.find((item) => item.topico_id === topicoId)
        if (!encontrado) {
          setErro('Não foi possível encontrar esse módulo.')
          return
        }
        setTopico(encontrado)
        setAulas(respostaAulas.aulas.filter((aula) => aula.topico_id === topicoId))
      } catch (err) {
        console.error(err)
        if (!cancelado) setErro('Não foi possível carregar os dados do módulo.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [materiaId, topicoId])

  const aulasFiltradas = aulas.filter((aula) => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return true
    return aula.titulo.toLowerCase().includes(termo) || (aula.resumo ?? '').toLowerCase().includes(termo)
  })

  function handleEditarModulo() {
    navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/editar`)
  }

  function handleNovaAula() {
    navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/nova`)
  }

  function handleEditarAula(id: string) {
    navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/aulas/${id}/editar`)
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>, index: number) {
    event.preventDefault()
    dragIndexRef.current = index
    overIndexRef.current = index
    setDragIndex(index)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (dragIndexRef.current === null) return

    let closestIndex: number | null = null
    let closestDistance = Infinity

    rowRefs.current.forEach((row, index) => {
      if (!row) return
      const rect = row.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2
      const distance = Math.abs(event.clientY - centerY)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    if (closestIndex !== null && closestIndex !== overIndexRef.current) {
      overIndexRef.current = closestIndex
      setOverIndex(closestIndex)
    }
  }

  async function persistirOrdem(novaOrdem: Aula[], anterior: Aula[]) {
    if (!topicoId) return
    setErroOrdem('')

    try {
      await patchAulasOrdem(
        topicoId,
        novaOrdem.map((aula) => ({ id: aula.id, ordem: aula.ordem })),
      )
    } catch (err) {
      console.error(err)
      setAulas(anterior)
      setErroOrdem('Não foi possível salvar a nova ordem das aulas.')
    }
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const origem = dragIndexRef.current
    const destino = overIndexRef.current

    if (origem !== null && destino !== null && origem !== destino) {
      const anterior = aulas
      const next = [...aulas]
      const [moved] = next.splice(origem, 1)
      next.splice(destino, 0, moved)
      const novaOrdem = next.map((aula, position) => ({ ...aula, ordem: position + 1 }))

      setAulas(novaOrdem)
      persistirOrdem(novaOrdem, anterior)
    }

    event.currentTarget.releasePointerCapture(event.pointerId)
    dragIndexRef.current = null
    overIndexRef.current = null
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Conteúdos', to: '/admin' },
            { label: 'Matérias', to: '/admin/materias' },
            { label: materiaNome || 'Matéria', to: `/admin/materias/${materiaId}` },
            { label: topico?.nome ?? 'Módulo' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={`Módulo: ${topico?.nome ?? 'Carregando...'}`}
            subtitle="Organize as aulas e a progressão deste módulo"
          />

          <div className={styles.headerActions}>
            <Button
              variant="outline"
              fullWidth={false}
              icon={<PencilIcon />}
              iconPosition="left"
              onClick={handleEditarModulo}
              disabled={carregando}
            >
              Editar módulo
            </Button>
            <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovaAula}>
              Nova aula
            </Button>
          </div>
        </div>

        {erro && (
          <CardDiv>
            <p className={styles.emptyTab}>{erro}</p>
          </CardDiv>
        )}

        {carregando && (
          <CardDiv>
            <Loading text="Carregando módulo..." />
          </CardDiv>
        )}

        <div className={styles.statsRow}>
          <AdminStatCard
            icon={topico?.icone ?? ICONE_TOPICO_PADRAO}
            iconColor="green"
            label="Status"
            value={topico?.ativo ? <Badge color="teal">Ativo</Badge> : <Badge color="gold">Rascunho</Badge>}
          />
          <AdminStatCard icon={<TargetIcon />} iconColor="purple" label="Ordem" value={topico ? `${topico.ordem}º` : '—'} />
          <AdminStatCard icon={<BookIcon />} iconColor="gold" label="Total de aulas" value={aulas.length} sublabel="Aulas cadastradas" />
          <AdminStatCard
            icon={<CalendarIcon />}
            iconColor="blue"
            label="Última atualização"
            value={topico ? formatarData(topico.atualizado_em) : '—'}
          />
        </div>

        <UnderlineTabs options={TABS} value={tab} onChange={setTab} />

        {tab === 'aulas' && (
          <CardDiv>
            <div className={styles.tableToolbar}>
              <div className={styles.tableSearch}>
                <SearchIcon className={styles.tableSearchIcon} />
                <input
                  type="search"
                  placeholder="Buscar aula..."
                  aria-label="Buscar aula"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  className={styles.tableSearchInput}
                />
              </div>

              <Button variant="outline" fullWidth={false} icon={<ChevronDownIcon />}>
                Filtrar por status
              </Button>
            </div>

            {erroOrdem && <p className={styles.emptyTab}>{erroOrdem}</p>}

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Aula</th>
                    <th>Dificuldade</th>
                    <th>Status</th>
                    <th>Ordem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {aulasFiltradas.map((aula) => {
                    const dificuldadeConfig = DIFICULDADE_CONFIG[aula.dificuldade]
                    const index = aulas.indexOf(aula)
                    const rowClasses = [
                      dragIndex === index && styles['row--dragging'],
                      overIndex === index && dragIndex !== index && styles['row--over'],
                    ]
                      .filter(Boolean)
                      .join(' ')

                    return (
                      <tr
                        key={aula.id}
                        ref={(el) => {
                          rowRefs.current[index] = el
                        }}
                        className={rowClasses || undefined}
                      >
                        <td>
                          <button
                            type="button"
                            className={styles.dragHandle}
                            aria-label={`Reordenar ${aula.titulo}`}
                            onPointerDown={(event) => handlePointerDown(event, index)}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                          >
                            <GripVerticalIcon />
                          </button>
                        </td>
                        <td>
                          <div className={styles.aulaCell}>
                            <CardIcon color="purple">
                              <BookIcon />
                            </CardIcon>
                            <div className={styles.aulaInfo}>
                              <span className={styles.aulaNome}>
                                {aula.titulo}
                                {aula.mais_cobrado && (
                                  <Badge color="gold">Mais cobrado</Badge>
                                )}
                              </span>
                              <span className={styles.aulaDescricao}>{aula.resumo}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge color={dificuldadeConfig.color}>{dificuldadeConfig.label}</Badge>
                        </td>
                        <td>
                          <span className={`${styles.statusDot} ${styles[`statusDot--${aula.ativo ? 'ativo' : 'inativo'}`]}`} />
                          {aula.ativo ? 'Ativo' : 'Inativo'}
                        </td>
                        <td>{aula.ordem}º</td>
                        <td>
                          <div className={styles.rowActions}>
                            <Button
                              variant="outline"
                              size="sm"
                              fullWidth={false}
                              icon={<PencilIcon />}
                              iconPosition="left"
                              onClick={() => handleEditarAula(aula.id)}
                            >
                              Editar
                            </Button>
                            <button type="button" className={styles.rowActionButton} aria-label={`Mais ações para ${aula.titulo}`}>
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

            <div className={styles.tableFooter}>
              <span className={styles.tableFooterText}>
                Mostrando 1 a {aulasFiltradas.length} de {aulas.length} aulas
              </span>
              <Pagination page={pagina} totalPages={1} onChange={setPagina} />
            </div>
          </CardDiv>
        )}

        {tab !== 'aulas' && (
          <CardDiv>
            <p className={styles.emptyTab}>Essa aba ainda está em construção. Em breve, novidade por aqui!</p>
          </CardDiv>
        )}
      </div>
    </AdminPageLayout>
  )
}
