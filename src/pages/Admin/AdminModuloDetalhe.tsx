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
  PlayIcon,
  ClockIcon,
} from '../../components/ui/icons'
import styles from './AdminModuloDetalhe.module.css'

import { getMateriaPorId } from '../../services/materias'
import { getTopicosPorMateria } from '../../services/modulos'
import type { Topico } from '../../types/modulos'

const TABS = [
  { value: 'aulas', label: 'Aulas' },
  { value: 'detalhes', label: 'Detalhes' },
  { value: 'configuracoes', label: 'Configurações' },
]

// TODO: substituir pelos dados reais vindos do backend (endpoint de aulas do módulo)
const AULAS_INICIAIS = [
  {
    nome: 'Introdução à Álgebra',
    descricao: 'Conceitos básicos e variáveis',
    tipo: 'video' as const,
    dificuldade: 'basico' as const,
    duracaoMin: 25,
    status: 'ativo' as const,
    ordem: 1,
  },
  {
    nome: 'Expressões Algébricas',
    descricao: 'Termos, coeficientes e operações',
    tipo: 'video' as const,
    dificuldade: 'basico' as const,
    duracaoMin: 30,
    status: 'ativo' as const,
    ordem: 2,
  },
  {
    nome: 'Equações do 1º Grau',
    descricao: 'Resolução de equações lineares',
    tipo: 'video' as const,
    dificuldade: 'medio' as const,
    duracaoMin: 35,
    status: 'ativo' as const,
    ordem: 3,
  },
  {
    nome: 'Sistemas de Equações',
    descricao: 'Métodos de substituição e adição',
    tipo: 'video' as const,
    dificuldade: 'medio' as const,
    duracaoMin: 40,
    status: 'ativo' as const,
    ordem: 4,
  },
  {
    nome: 'Revisão e Exercícios',
    descricao: 'Exercícios práticos e aplicações',
    tipo: 'exercicio' as const,
    dificuldade: 'basico' as const,
    duracaoMin: 30,
    status: 'ativo' as const,
    ordem: 5,
  },
]

const DIFICULDADE_CONFIG = {
  basico: { label: 'Básico', color: 'teal' as const },
  medio: { label: 'Médio', color: 'gold' as const },
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
  const [aulas, setAulas] = useState(AULAS_INICIAIS)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  // Refs porque os handlers de pointer precisam do valor mais atual sem esperar o re-render.
  const dragIndexRef = useRef<number | null>(null)
  const overIndexRef = useRef<number | null>(null)
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([])

  //carrega o nome da matéria e o tópico (não existe GET por tópico individual, então filtra da lista)
  useEffect(() => {
    if (!materiaId || !topicoId) return

    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [respostaMateria, respostaTopicos] = await Promise.all([
          getMateriaPorId(materiaId!),
          getTopicosPorMateria({ materia_id: materiaId! }),
        ])
        if (cancelado) return

        setMateriaNome(respostaMateria.materia.nome)

        const encontrado = respostaTopicos.topicos.find((item) => item.topico_id === topicoId)
        if (!encontrado) {
          setErro('Não foi possível encontrar esse módulo.')
          return
        }
        setTopico(encontrado)
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
    return aula.nome.toLowerCase().includes(termo) || aula.descricao.toLowerCase().includes(termo)
  })

  function handleEditarModulo() {
    navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/editar`)
  }

  function handleNovaAula() {
    // TODO: conectar à navegação real — criação de aula dentro deste módulo
    console.log('nova aula')
  }

  function handleEditarAula(nome: string) {
    // TODO: conectar ao backend — abrir formulário de edição da aula
    console.log('editar aula', nome)
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

  function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const origem = dragIndexRef.current
    const destino = overIndexRef.current

    if (origem !== null && destino !== null && origem !== destino) {
      setAulas((prev) => {
        const next = [...prev]
        const [moved] = next.splice(origem, 1)
        next.splice(destino, 0, moved)
        // TODO: persistir a nova ordem no backend (PATCH /admin/modulos/:id/aulas/ordem)
        return next.map((aula, position) => ({ ...aula, ordem: position + 1 }))
      })
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

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Aula</th>
                    <th>Dificuldade</th>
                    <th>Duração</th>
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
                        key={aula.nome}
                        ref={(el) => {
                          rowRefs.current[index] = el
                        }}
                        className={rowClasses || undefined}
                      >
                        <td>
                          <button
                            type="button"
                            className={styles.dragHandle}
                            aria-label={`Reordenar ${aula.nome}`}
                            onPointerDown={(event) => handlePointerDown(event, index)}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                          >
                            <GripVerticalIcon />
                          </button>
                        </td>
                        <td>
                          <div className={styles.aulaCell}>
                            <CardIcon color="purple">{aula.tipo === 'video' ? <PlayIcon /> : <PencilIcon />}</CardIcon>
                            <div className={styles.aulaInfo}>
                              <span className={styles.aulaNome}>{aula.nome}</span>
                              <span className={styles.aulaDescricao}>{aula.descricao}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge color={dificuldadeConfig.color}>{dificuldadeConfig.label}</Badge>
                        </td>
                        <td className={styles.mutedCell}>
                          <span className={styles.durationCell}>
                            <ClockIcon className={styles.durationIcon} />
                            {aula.duracaoMin} min
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.statusDot} ${styles[`statusDot--${aula.status}`]}`} />
                          {aula.status === 'ativo' ? 'Ativo' : 'Inativo'}
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
                              onClick={() => handleEditarAula(aula.nome)}
                            >
                              Editar
                            </Button>
                            <button type="button" className={styles.rowActionButton} aria-label={`Mais ações para ${aula.nome}`}>
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
