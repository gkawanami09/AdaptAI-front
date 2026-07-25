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
import { MateriaCard } from '../../components/cards/MateriaCard'
import type { CardIconColor } from '../../components/cards/CardIcon'
import { BookIcon, CheckCircleIcon, FileTextIcon, FolderIcon, PlusIcon, SearchIcon } from '../../components/ui/icons'
import styles from './AdminMateriasLista.module.css'

// api functions
import { getMaterias } from '../../services/materias'
import type { Materias } from '../../types/materias'

const AREAS = ['Todas', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Linguagens', 'Redação']

const ITENS_POR_PAGINA = 6

const AREA_ICONS: Record<string, { icon: string; iconColor: CardIconColor }> = {
  'Matemática': { icon: '📐', iconColor: 'purple' },
  'Ciências da Natureza': { icon: '⚡', iconColor: 'gold' },
  'Ciências Humanas': { icon: '🏛️', iconColor: 'blue' },
  'Linguagens': { icon: '✍️', iconColor: 'red' },
  'Redação': { icon: '✍️', iconColor: 'red' },
}

const AREA_ICON_PADRAO = { icon: '📚', iconColor: 'green' as const }

function getAreaVisual(area: string) {
  return AREA_ICONS[area] ?? AREA_ICON_PADRAO
}

export function AdminMateriasLista() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [area, setArea] = useState('Todas')
  const [ordenacao, setOrdenacao] = useState('nome-az')
  const [pagina, setPagina] = useState(1)

  const [materias, setMaterias] = useState<Materias[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [carregando, setCarregando] = useState(false)

  //Materias functions
  function handleNovaMateria() {
    navigate('/admin/materias/nova')
  }

  //obtem a lista de todas as materias
  async function carregarMaterias() {
    setCarregando(true)

    try {
      const response = await getMaterias({
        busca: busca.trim() || undefined,
        area: area === 'Todas' ? undefined : area,
        pagina,
        limite: ITENS_POR_PAGINA,
      })

      setMaterias(response.materias)
      setTotalPaginas(response.total_paginas || 1)
      setTotalRegistros(response.total_registros)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarMaterias()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, area, pagina])

  function handleVerModulos(id: string | undefined) {
    navigate(`/admin/materias/${id}`)
  }

  function handleEditar(id: string | undefined) {
    if (!id) {
      console.error('matéria sem id, não é possível editar')
      return
    }
    navigate(`/admin/materias/${id}/editar`)
  }

  const materiasOrdenadas = [...materias].sort((a, b) => {
    if (ordenacao === 'nome-za') return b.nome.localeCompare(a.nome)
    return a.nome.localeCompare(b.nome)
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
          <AdminStatCard icon={<BookIcon />} iconColor="purple" label="Total de matérias" value={String(totalRegistros)} />
          <AdminStatCard
            icon={<FolderIcon />}
            iconColor="purple"
            label="Total de tópicos"
            value={String(materias.reduce((soma, materia) => soma + materia.total_topicos, 0))}
          />
          <AdminStatCard
            icon={<CheckCircleIcon />}
            iconColor="green"
            label="Matérias ativas"
            value={String(materias.filter((materia) => materia.ativo).length)}
          />
          <AdminStatCard
            icon={<FileTextIcon />}
            iconColor="gold"
            label="Rascunhos"
            value={String(materias.filter((materia) => !materia.ativo).length)}
          />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar matéria..."
              aria-label="Buscar matéria"
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
              <span className={styles.filterLabel}>Área</span>
              <div className={styles.chips}>
                {AREAS.map((item) => (
                  <FilterChip
                    key={item}
                    label={item}
                    selected={item === area}
                    onClick={() => {
                      setArea(item)
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
            <p className={styles.emptyState}>Carregando matérias...</p>
          </CardDiv>
        ) : materiasOrdenadas.length > 0 ? (
          <div className={styles.grid}>
            {materiasOrdenadas.map((materia) => {
              const { icon, iconColor } = getAreaVisual(materia.area)
              return (
                <MateriaCard
                  key={materia.id ?? materia.slug}
                  icon={icon}
                  iconColor={iconColor}
                  title={materia.nome}
                  area={materia.area}
                  status={materia.ativo ? 'ativa' : 'rascunho'}
                  modulos={materia.total_topicos}
                  aulas={materia.total_aulas}
                  onVerModulos={() => handleVerModulos(materia.id)}
                  onEditar={() => handleEditar(materia.id)}
                />
              )
            })}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhuma matéria encontrada para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {materiasOrdenadas.length} de {totalRegistros} matérias
          </span>
          <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
        </div>
      </div>
    </AdminPageLayout>
  )
}
