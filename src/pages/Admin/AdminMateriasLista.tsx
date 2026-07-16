import { useState } from 'react'
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
import { MateriaCard } from '../../components/cards/MateriaCard'
import { BookIcon, CheckCircleIcon, FileTextIcon, FolderIcon, PlusIcon, SearchIcon } from '../../components/ui/icons'
import styles from './AdminMateriasLista.module.css'

const AREAS = ['Todas', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Linguagens', 'Redação']

// TODO: substituir pelos dados reais vindos do backend (endpoint de matérias)
const MATERIAS = [
  { icon: '📐', iconColor: 'purple' as const, titulo: 'Matemática', area: 'Matemática', status: 'ativa' as const, modulos: 8, aulas: 24 },
  { icon: '⚡', iconColor: 'gold' as const, titulo: 'Física', area: 'Ciências da Natureza', status: 'ativa' as const, modulos: 6, aulas: 18 },
  { icon: '🧪', iconColor: 'blue' as const, titulo: 'Química', area: 'Ciências da Natureza', status: 'ativa' as const, modulos: 7, aulas: 21 },
  { icon: '🌿', iconColor: 'green' as const, titulo: 'Biologia', area: 'Ciências da Natureza', status: 'ativa' as const, modulos: 6, aulas: 16 },
  { icon: '🏛️', iconColor: 'gold' as const, titulo: 'História', area: 'Ciências Humanas', status: 'ativa' as const, modulos: 5, aulas: 15 },
  { icon: '✍️', iconColor: 'red' as const, titulo: 'Redação', area: 'Linguagens', status: 'rascunho' as const, modulos: 4, aulas: 12 },
]

export function AdminMateriasLista() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [area, setArea] = useState('Todas')
  const [ordenacao, setOrdenacao] = useState('nome-az')
  const [pagina, setPagina] = useState(1)

  function handleNovaMateria() {
    navigate('/admin/materias/nova')
  }

  function handleVerModulos(titulo: string) {
    // TODO: navegar pra tela de detalhe da matéria correspondente (por enquanto só temos a de Matemática)
    console.log('ver módulos de', titulo)
    if (titulo === 'Matemática') navigate('/admin/materias/matematica')
  }

  function handleEditar(titulo: string) {
    // TODO: conectar ao backend — abrir formulário de edição da matéria
    console.log('editar matéria', titulo)
  }

  const materiasFiltradas = MATERIAS.filter((materia) => {
    const termo = busca.trim().toLowerCase()
    const bateBusca = !termo || materia.titulo.toLowerCase().includes(termo)
    const bateArea = area === 'Todas' || materia.area === area
    return bateBusca && bateArea
  }).sort((a, b) => {
    if (ordenacao === 'nome-za') return b.titulo.localeCompare(a.titulo)
    return a.titulo.localeCompare(b.titulo)
  })

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Conteúdos', to: '/admin' }, { label: 'Matérias' }]} />

        <div className={styles.header}>
          <TitlePage title="Gerenciar Matérias" subtitle="Organize as matérias por área e acompanhe seus módulos." />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovaMateria}>
            Nova matéria
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<BookIcon />} iconColor="purple" label="Total de matérias" value="24" />
          <AdminStatCard icon={<FolderIcon />} iconColor="purple" label="Total de módulos" value="156" />
          <AdminStatCard icon={<CheckCircleIcon />} iconColor="green" label="Matérias ativas" value="20" />
          <AdminStatCard icon={<FileTextIcon />} iconColor="gold" label="Rascunhos" value="4" />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar matéria..."
              aria-label="Buscar matéria"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Área</span>
              <div className={styles.chips}>
                {AREAS.map((item) => (
                  <FilterChip key={item} label={item} selected={item === area} onClick={() => setArea(item)} />
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

        {materiasFiltradas.length > 0 ? (
          <div className={styles.grid}>
            {materiasFiltradas.map((materia) => (
              <MateriaCard
                key={materia.titulo}
                icon={materia.icon}
                iconColor={materia.iconColor}
                title={materia.titulo}
                area={materia.area}
                status={materia.status}
                modulos={materia.modulos}
                aulas={materia.aulas}
                onVerModulos={() => handleVerModulos(materia.titulo)}
                onEditar={() => handleEditar(materia.titulo)}
              />
            ))}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhuma matéria encontrada para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {materiasFiltradas.length} de {MATERIAS.length} matérias
          </span>
          <Pagination page={pagina} totalPages={4} onChange={setPagina} />
        </div>
      </div>
    </AdminPageLayout>
  )
}
