import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { Button } from '../../components/ui/Button'
import { SelectField } from '../../components/ui/SelectField'
import { TextField } from '../../components/ui/TextField'
import { TitlePage } from '../../components/ui/TitlePage'
import { SaveIcon, XIcon } from '../../components/ui/icons'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { QuestionSelector } from '../../components/admin/QuestionSelector'
import { SortableQuestionItem } from '../../components/admin/SortableQuestionItem'
import { getMaterias } from '../../services/materias'
import { getQuestaoPorId, getQuestoes } from '../../services/questoes'
import { getListaPorId, patchLista, postLista } from '../../services/listas'
import type { Materias } from '../../types/materias'
import type { QuestaoResumo } from '../../types/questoes'
import type { ListaTipo } from '../../types/listas'
import styles from './AdminListaNova.module.css'

const TIPO_LISTA_OPTIONS: { value: ListaTipo; label: string }[] = [
  { value: 'fixa', label: 'Fixa' },
  { value: 'gerada_ia', label: 'Gerada por IA' },
  { value: 'questoes_erradas', label: 'Questões erradas' },
  { value: 'favoritas', label: 'Favoritas' },
  { value: 'revisao', label: 'Revisão' },
]

export function AdminListaNova() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const emEdicao = Boolean(id)

  const [materias, setMaterias] = useState<Materias[]>([])
  const [titulo, setTitulo] = useState('')
  const [materiaId, setMateriaId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tipoLista, setTipoLista] = useState<ListaTipo>('fixa')

  const [banco, setBanco] = useState<QuestaoResumo[]>([])
  const [buscaBanco, setBuscaBanco] = useState('')
  const [selecionadas, setSelecionadas] = useState<QuestaoResumo[]>([])

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        const [materiasResponse, listaResponse] = await Promise.all([
          getMaterias({ limite: 100 }),
          id ? getListaPorId(id) : Promise.resolve(null),
        ])
        if (cancelado) return

        setMaterias(materiasResponse.materias)

        if (listaResponse) {
          const lista = listaResponse.lista
          setTitulo(lista.titulo)
          setMateriaId(lista.materia_id ?? '')
          setDescricao(lista.descricao ?? '')
          setTipoLista(lista.tipo_lista)

          const itensOrdenados = [...lista.itens].sort((a, b) => a.ordem - b.ordem)
          const questoes = await Promise.all(itensOrdenados.map((item) => getQuestaoPorId(item.questao_id).then((resposta) => resposta.questao)))
          if (!cancelado) setSelecionadas(questoes.map((questao) => ({ ...questao, total_alternativas: questao.alternativas.length })))
        }
      } catch (error) {
        console.error(error)
        if (!cancelado) setErro('Não foi possível carregar os dados da lista.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [id])

  useEffect(() => {
    let cancelado = false

    async function carregarBanco() {
      try {
        const resposta = await getQuestoes({
          materia_id: materiaId || undefined,
          busca: buscaBanco.trim() || undefined,
          ativo: true,
          limite: 50,
        })
        if (!cancelado) setBanco(resposta.questoes)
      } catch (error) {
        console.error(error)
      }
    }

    carregarBanco()
    return () => {
      cancelado = true
    }
  }, [materiaId, buscaBanco])

  const selecionadasIds = useMemo(() => selecionadas.map((questao) => questao.id), [selecionadas])

  function cancelar() {
    navigate('/admin/listas')
  }

  function adicionarQuestao(questao: QuestaoResumo) {
    setSelecionadas((current) => (current.some((item) => item.id === questao.id) ? current : [...current, questao]))
  }

  function removerQuestao(id: string) {
    setSelecionadas((current) => current.filter((item) => item.id !== id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSelecionadas((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id)
      const newIndex = current.findIndex((item) => item.id === over.id)
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selecionadas.length) {
      setErro('Adicione pelo menos uma questão à lista.')
      return
    }

    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      materia_id: materiaId || null,
      tipo_lista: tipoLista,
      itens: selecionadas.map((questao, index) => ({ questao_id: questao.id, ordem: index })),
    }

    setSalvando(true)
    setErro('')
    try {
      if (emEdicao) {
        await patchLista(id!, payload)
      } else {
        await postLista(payload)
      }
      navigate('/admin/listas')
    } catch (error) {
      console.error(error)
      setErro('Não foi possível salvar a lista. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Listas', to: '/admin/listas' },
            { label: emEdicao ? 'Editar lista' : 'Nova lista' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={emEdicao ? 'Editar lista' : 'Nova lista'}
            subtitle="Monte a lista escolhendo questões do banco e organizando a ordem."
          />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={cancelar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" form="nova-lista-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left" disabled={carregando || salvando}>
              {salvando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Salvar lista'}
            </Button>
          </div>
        </div>

        {erro ? <div className={styles.alert} role="alert">{erro}</div> : null}

        <form id="nova-lista-form" className={styles.contentRow} onSubmit={handleSubmit}>
          <div className={styles.column}>
            <CardDiv>
              <CardHeading>Dados da lista</CardHeading>
              <TextField
                id="titulo"
                label="Título da lista *"
                placeholder="Ex.: Lista de Funções"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                disabled={carregando}
                required
              />

              <div className={styles.fieldGroup}>
                <SelectField
                  id="materia"
                  label="Matéria"
                  placeholder="Selecione a matéria (opcional)"
                  value={materiaId}
                  onChange={(event) => setMateriaId(event.target.value)}
                  disabled={carregando}
                >
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nome}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className={styles.fieldGroup}>
                <SelectField
                  id="tipo-lista"
                  label="Tipo de lista *"
                  value={tipoLista}
                  onChange={(event) => setTipoLista(event.target.value as ListaTipo)}
                  disabled={carregando}
                >
                  {TIPO_LISTA_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
              </div>

              <label className={styles.textareaField}>
                <span>Descrição</span>
                <textarea
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  rows={4}
                  placeholder="Descreva o objetivo desta lista..."
                  disabled={carregando}
                />
              </label>
            </CardDiv>
          </div>

          <div className={styles.column}>
            <CardDiv>
              <CardHeading>Banco de questões</CardHeading>
              <QuestionSelector
                questoes={banco}
                selecionadasIds={selecionadasIds}
                busca={buscaBanco}
                onBuscaChange={setBuscaBanco}
                onAdicionar={adicionarQuestao}
              />
            </CardDiv>
          </div>

          <div className={styles.column}>
            <CardDiv>
              <div className={styles.selectedHeading}>
                <div>
                  <CardHeading>Questões selecionadas</CardHeading>
                  <p>Arraste para reordenar.</p>
                </div>
              </div>

              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selecionadasIds} strategy={verticalListSortingStrategy}>
                  <div className={styles.selectedList}>
                    {selecionadas.length ? (
                      selecionadas.map((questao) => (
                        <SortableQuestionItem
                          key={questao.id}
                          id={questao.id}
                          enunciado={questao.enunciado}
                          dificuldade={questao.dificuldade}
                          onRemove={() => removerQuestao(questao.id)}
                        />
                      ))
                    ) : (
                      <div className={styles.empty}>Nenhuma questão selecionada ainda.</div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </CardDiv>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}
