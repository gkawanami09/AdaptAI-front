import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { UnderlineTabs } from '../../components/ui/UnderlineTabs'
import { Pagination } from '../../components/ui/Pagination'
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

const TABS = [
  { value: 'modulos', label: 'Módulos' },
  { value: 'informacoes', label: 'Informações' },
  { value: 'configuracoes', label: 'Configurações' },
]

// TODO: substituir pelos dados reais vindos do backend (endpoint de módulos da matéria)
const MODULOS = [
  { icon: 'x²', nome: 'Álgebra', aulas: 6, ordem: 1, status: 'ativo' as const, atualizado: '12/05/2025 · 10:24' },
  { icon: '📐', nome: 'Geometria Plana', aulas: 5, ordem: 2, status: 'ativo' as const, atualizado: '10/05/2025 · 14:18' },
  { icon: '📈', nome: 'Função Afim', aulas: 4, ordem: 3, status: 'ativo' as const, atualizado: '09/05/2025 · 09:37' },
  { icon: 'Ψ', nome: 'Função Quadrática', aulas: 4, ordem: 4, status: 'ativo' as const, atualizado: '08/05/2025 · 16:42' },
  { icon: 'sin', nome: 'Trigonometria', aulas: 5, ordem: 5, status: 'rascunho' as const, atualizado: '07/05/2025 · 11:09' },
]

const STATUS_CONFIG = {
  ativo: { label: 'Ativo', color: 'teal' as const },
  rascunho: { label: 'Rascunho', color: 'gold' as const },
}

export function AdminMateriaDetalhe() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('modulos')
  const [busca, setBusca] = useState('')
  const [pagina, setPagina] = useState(1)

  function handleEditarMateria() {
    // TODO: conectar ao backend — abrir formulário de edição da matéria
    console.log('editar matéria')
  }

  function handleNovoModulo() {
    navigate('/admin/materias/matematica/modulos/novo')
  }

  function handleEditarModulo(nome: string) {
    if (nome === 'Álgebra') {
      navigate('/admin/materias/matematica/modulos/algebra')
      return
    }
    // TODO: conectar ao backend — abrir detalhe do módulo correspondente
    console.log('editar módulo', nome)
  }

  const modulosFiltrados = MODULOS.filter((modulo) => {
    const termo = busca.trim().toLowerCase()
    return !termo || modulo.nome.toLowerCase().includes(termo)
  })

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[{ label: 'Conteúdos', to: '/admin' }, { label: 'Matérias', to: '/admin/materias' }, { label: 'Matemática' }]}
        />

        <div className={styles.header}>
          <TitlePage title="Matemática" subtitle="Gerencie os módulos e acompanhe a estrutura da matéria" />

          <div className={styles.headerActions}>
            <Button variant="outline" fullWidth={false} icon={<PencilIcon />} iconPosition="left" onClick={handleEditarMateria}>
              Editar matéria
            </Button>
            <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovoModulo}>
              Novo módulo
            </Button>
          </div>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon="📐" iconColor="purple" label="Área" value="Matemática" />
          <AdminStatCard
            icon={<CheckCircleIcon />}
            iconColor="green"
            label="Status"
            value={<Badge color="teal">Ativa</Badge>}
          />
          <AdminStatCard icon={<FolderIcon />} iconColor="purple" label="Total de módulos" value="8" />
          <AdminStatCard icon={<BookIcon />} iconColor="gold" label="Total de aulas" value="24" />
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
                    <th>Aulas</th>
                    <th>Ordem</th>
                    <th>Status</th>
                    <th>Atualizado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {modulosFiltrados.map((modulo) => {
                    const statusConfig = STATUS_CONFIG[modulo.status]

                    return (
                      <tr
                        key={modulo.nome}
                        className={styles.moduloRow}
                        onClick={() => handleEditarModulo(modulo.nome)}
                      >
                        <td>
                          <div className={styles.moduloCell}>
                            <span className={styles.moduloIcon}>{modulo.icon}</span>
                            {modulo.nome}
                          </div>
                        </td>
                        <td>{modulo.aulas}</td>
                        <td>{modulo.ordem}</td>
                        <td>
                          <span className={`${styles.statusDot} ${styles[`statusDot--${modulo.status}`]}`} />
                          {statusConfig.label}
                        </td>
                        <td className={styles.mutedCell}>{modulo.atualizado}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.rowActionButton}
                              aria-label={`Editar ${modulo.nome}`}
                              onClick={(event) => {
                                event.stopPropagation()
                                handleEditarModulo(modulo.nome)
                              }}
                            >
                              <PencilIcon />
                            </button>
                            <button
                              type="button"
                              className={styles.rowActionButton}
                              aria-label={`Mais ações para ${modulo.nome}`}
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

            <div className={styles.tableFooter}>
              <span className={styles.tableFooterText}>
                Mostrando {modulosFiltrados.length} de {MODULOS.length} módulos
              </span>
              <Pagination page={pagina} totalPages={2} onChange={setPagina} />
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
