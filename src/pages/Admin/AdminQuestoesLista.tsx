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
import { QuestionCard } from '../../components/cards/QuestionCard'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { CardIconColor } from '../../components/cards/CardIcon'
import { HelpCircleIcon, CheckCircleIcon, FileTextIcon, CheckSquareIcon, PlusIcon, SearchIcon } from '../../components/ui/icons'
import styles from './AdminQuestoesLista.module.css'

import { deleteQuestao, getQuestoes } from '../../services/questoes'
import type { QuestaoResumo, QuestaoDificuldade } from '../../types/questoes'

const ITENS_POR_PAGINA = 6

const DIFICULDADE_FILTERS: { value: QuestaoDificuldade | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'facil', label: 'Fácil' },
  { value: 'medio', label: 'Médio' },
  { value: 'dificil', label: 'Difícil' },
]

const STATUS_FILTERS: { value: 'todas' | 'ativas' | 'inativas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'ativas', label: 'Publicadas' },
  { value: 'inativas', label: 'Inativas' },
]

const ICON_COLORS: CardIconColor[] = ['purple', 'green', 'blue', 'gold', 'red']

function getIconColor(seed: string): CardIconColor {
  const index = seed.split('').reduce((soma, char) => soma + char.charCodeAt(0), 0) % ICON_COLORS.length
  return ICON_COLORS[index]
}

export function AdminQuestoesLista() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [dificuldade, setDificuldade] = useState<QuestaoDificuldade | 'todas'>('todas')
  const [status, setStatus] = useState<'todas' | 'ativas' | 'inativas'>('todas')
  const [ordenacao, setOrdenacao] = useState('recentes')
  const [pagina, setPagina] = useState(1)

  const [questoes, setQuestoes] = useState<QuestaoResumo[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalQuestoes, setTotalQuestoes] = useState(0)
  const [totalPublicadas, setTotalPublicadas] = useState(0)
  const [totalInativas, setTotalInativas] = useState(0)
  const [totalAlternativas, setTotalAlternativas] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [questaoParaExcluir, setQuestaoParaExcluir] = useState<QuestaoResumo | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  async function carregarQuestoes() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getQuestoes({
        busca: busca.trim() || undefined,
        dificuldade: dificuldade === 'todas' ? undefined : dificuldade,
        ativo: status === 'ativas' ? true : status === 'inativas' ? false : undefined,
        ordenar: ordenacao as 'recentes' | 'enunciado-az' | 'enunciado-za',
        pagina,
        limite: ITENS_POR_PAGINA,
      })

      setQuestoes(resposta.questoes)
      setTotalPaginas(resposta.total_paginas || 1)
      setTotalQuestoes(resposta.total_questoes)
      setTotalPublicadas(resposta.total_publicadas)
      setTotalInativas(resposta.total_inativas)
      setTotalAlternativas(resposta.total_alternativas)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarQuestoes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, dificuldade, status, ordenacao, pagina])

  function handleNovaQuestao() {
    navigate('/admin/questoes/nova')
  }

  function handleEditar(id: string) {
    navigate(`/admin/questoes/${id}/editar`)
  }

  async function handleExcluir() {
    if (!questaoParaExcluir) return
    setExcluindo(true)
    try {
      await deleteQuestao(questaoParaExcluir.id)
      setQuestaoParaExcluir(null)
      carregarQuestoes()
    } catch (err) {
      console.error(err)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Conteúdos', to: '/admin' }, { label: 'Questões' }]} />

        <div className={styles.header}>
          <TitlePage title="Banco de Questões" subtitle="Gerencie as questões disponíveis para listas e provas." />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={handleNovaQuestao}>
            Nova questão
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<HelpCircleIcon />} iconColor="purple" label="Total de questões" value={String(totalQuestoes)} />
          <AdminStatCard icon={<CheckCircleIcon />} iconColor="green" label="Publicadas" value={String(totalPublicadas)} />
          <AdminStatCard icon={<FileTextIcon />} iconColor="red" label="Inativas" value={String(totalInativas)} />
          <AdminStatCard icon={<CheckSquareIcon />} iconColor="blue" label="Alternativas" value={String(totalAlternativas)} />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar questão..."
              aria-label="Buscar questão"
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
                <option value="recentes">Mais recentes</option>
                <option value="enunciado-az">Enunciado (A-Z)</option>
                <option value="enunciado-za">Enunciado (Z-A)</option>
              </SelectField>
            </div>
          </div>
        </CardDiv>

        {carregando ? (
          <CardDiv>
            <p className={styles.emptyState}>Carregando questões...</p>
          </CardDiv>
        ) : erro ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar as questões.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarQuestoes}>
                Tentar novamente
              </Button>
            </div>
          </CardDiv>
        ) : questoes.length > 0 ? (
          <div className={styles.grid}>
            {questoes.map((questao) => (
              <QuestionCard
                key={questao.id}
                iconColor={getIconColor(questao.id)}
                enunciado={questao.enunciado}
                ativo={questao.ativo}
                dificuldade={questao.dificuldade}
                totalAlternativas={questao.total_alternativas}
                onEditar={() => handleEditar(questao.id)}
                onExcluir={() => setQuestaoParaExcluir(questao)}
              />
            ))}
          </div>
        ) : (
          <CardDiv>
            <p className={styles.emptyState}>Nenhuma questão encontrada para os filtros selecionados.</p>
          </CardDiv>
        )}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Mostrando {questoes.length} de {totalQuestoes} questões
          </span>
          <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
        </div>
      </div>

      {questaoParaExcluir && (
        <ConfirmDialog
          title="Excluir questão"
          description="Tem certeza que deseja excluir esta questão? Essa ação também remove todas as suas alternativas e não pode ser desfeita."
          confirmando={excluindo}
          onConfirm={handleExcluir}
          onClose={() => setQuestaoParaExcluir(null)}
        />
      )}
    </AdminPageLayout>
  )
}
