import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { Button } from '../../components/ui/Button'
import { SelectField } from '../../components/ui/SelectField'
import { StatusToggle } from '../../components/ui/StatusToggle'
import { TextField } from '../../components/ui/TextField'
import { TitlePage } from '../../components/ui/TitlePage'
import { PlusIcon, SaveIcon, XIcon } from '../../components/ui/icons'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { AlternativeEditor } from '../../components/admin/AlternativeEditor'
import { getMaterias } from '../../services/materias'
import { getTopicosPorMateria } from '../../services/modulos'
import { getAulasPorMateria } from '../../services/aulas'
import { getTiposProva } from '../../services/tiposProva'
import { getQuestaoPorId, patchQuestao, postQuestao } from '../../services/questoes'
import type { Materias } from '../../types/materias'
import type { Topico } from '../../types/modulos'
import type { Aula } from '../../types/aulas'
import type { TipoProva } from '../../types/tiposProva'
import type { AlternativaLetra, AlternativaQuestao, QuestaoDificuldade } from '../../types/questoes'
import styles from './AdminQuestaoNova.module.css'

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Publicada', color: 'green' as const },
  { value: 'rascunho', label: 'Inativa', color: 'gold' as const },
]

const LETRAS: AlternativaLetra[] = ['A', 'B', 'C', 'D', 'E']

function novaAlternativa(index: number): AlternativaQuestao {
  return { letra: LETRAS[index] ?? 'A', texto: '', correta: index === 0 }
}

export function AdminQuestaoNova() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const emEdicao = Boolean(id)

  const [materias, setMaterias] = useState<Materias[]>([])
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [aulas, setAulas] = useState<Aula[]>([])
  const [tiposProva, setTiposProva] = useState<TipoProva[]>([])

  const [materiaId, setMateriaId] = useState('')
  const [topicoId, setTopicoId] = useState('')
  const [aulaId, setAulaId] = useState('')
  const [tipoProvaId, setTipoProvaId] = useState('')
  const [ano, setAno] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')
  const [dica, setDica] = useState('')
  const [enunciado, setEnunciado] = useState('')
  const [explicacao, setExplicacao] = useState('')
  const [dificuldade, setDificuldade] = useState<QuestaoDificuldade>('medio')
  const [status, setStatus] = useState('ativo')
  const [alternativas, setAlternativas] = useState<AlternativaQuestao[]>([novaAlternativa(0), novaAlternativa(1)])

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        const [materiasResponse, tiposProvaResponse, questaoResponse] = await Promise.all([
          getMaterias({ limite: 100 }),
          getTiposProva({ limite: 50, ativo: true }),
          id ? getQuestaoPorId(id) : Promise.resolve(null),
        ])
        if (cancelado) return

        setMaterias(materiasResponse.materias)
        setTiposProva(tiposProvaResponse.tipos_prova)

        if (questaoResponse) {
          const questao = questaoResponse.questao
          setMateriaId(questao.materia_id)
          setTopicoId(questao.topico_id ?? '')
          setAulaId(questao.aula_id ?? '')
          setTipoProvaId(questao.tipo_prova_id ?? '')
          setAno(questao.ano ? String(questao.ano) : '')
          setImagemUrl(questao.imagem_url ?? '')
          setDica(questao.dica ?? '')
          setEnunciado(questao.enunciado)
          setExplicacao(questao.explicacao ?? '')
          setDificuldade(questao.dificuldade)
          setStatus(questao.ativo ? 'ativo' : 'rascunho')
          setAlternativas(questao.alternativas.length ? questao.alternativas : [novaAlternativa(0), novaAlternativa(1)])
        }
      } catch (error) {
        console.error(error)
        if (!cancelado) setErro('Não foi possível carregar os dados da questão.')
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
    if (!materiaId) {
      setTopicos([])
      setAulas([])
      return
    }

    let cancelado = false

    async function carregarDependencias() {
      try {
        const [topicosResponse, aulasResponse] = await Promise.all([
          getTopicosPorMateria({ materia_id: materiaId }),
          getAulasPorMateria({ materia_id: materiaId }),
        ])
        if (cancelado) return
        setTopicos(topicosResponse.topicos)
        setAulas(aulasResponse.aulas)
      } catch (error) {
        console.error(error)
      }
    }

    carregarDependencias()
    return () => {
      cancelado = true
    }
  }, [materiaId])

  function cancelar() {
    navigate('/admin/questoes')
  }

  function addAlternativa() {
    setAlternativas((current) => [...current, novaAlternativa(current.length)])
  }

  function updateAlternativa(index: number, alternativa: AlternativaQuestao) {
    setAlternativas((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex === index) return alternativa
        if (alternativa.correta && item.correta) return { ...item, correta: false }
        return item
      }),
    )
  }

  function removeAlternativa(index: number) {
    setAlternativas((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!materiaId) {
      setErro('Selecione a matéria da questão.')
      return
    }
    if (alternativas.length < 2 || !alternativas.some((alt) => alt.correta)) {
      setErro('Adicione ao menos duas alternativas e marque a correta.')
      return
    }
    if (alternativas.filter((alt) => alt.correta).length !== 1) {
      setErro('Marque exatamente uma alternativa como correta.')
      return
    }
    if (alternativas.some((alt) => !alt.texto.trim())) {
      setErro('Preencha o texto de todas as alternativas.')
      return
    }

    const payload = {
      tipo_prova_id: tipoProvaId || null,
      materia_id: materiaId,
      topico_id: topicoId || null,
      aula_id: aulaId || null,
      ano: ano ? Number(ano) : null,
      dificuldade,
      enunciado: enunciado.trim(),
      imagem_url: imagemUrl.trim() || null,
      dica: dica.trim() || null,
      explicacao: explicacao.trim() || null,
      ativo: status === 'ativo',
      alternativas: alternativas.map((alt) => ({ letra: alt.letra, texto: alt.texto, correta: alt.correta })),
    }

    setSalvando(true)
    setErro('')
    try {
      if (emEdicao) {
        await patchQuestao(id!, payload)
      } else {
        await postQuestao(payload)
      }
      navigate('/admin/questoes')
    } catch (error) {
      console.error(error)
      setErro('Não foi possível salvar a questão. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Questões', to: '/admin/questoes' },
            { label: emEdicao ? 'Editar questão' : 'Nova questão' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={emEdicao ? 'Editar questão' : 'Nova questão'}
            subtitle={emEdicao ? 'Atualize o enunciado e as alternativas desta questão.' : 'Cadastre uma nova questão para o banco.'}
          />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={cancelar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" form="nova-questao-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left" disabled={carregando || salvando}>
              {salvando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Salvar questão'}
            </Button>
          </div>
        </div>

        {erro ? <div className={styles.alert} role="alert">{erro}</div> : null}

        <form id="nova-questao-form" className={styles.contentRow} onSubmit={handleSubmit}>
          <main className={styles.mainColumn}>
            <CardDiv>
              <CardHeading>Informações</CardHeading>
              <div className={styles.grid}>
                <SelectField
                  id="materia"
                  label="Matéria *"
                  placeholder="Selecione a matéria"
                  value={materiaId}
                  onChange={(event) => {
                    setMateriaId(event.target.value)
                    setTopicoId('')
                    setAulaId('')
                  }}
                  disabled={carregando}
                  required
                >
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nome}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  id="topico"
                  label="Tópico"
                  placeholder="Selecione o tópico (opcional)"
                  value={topicoId}
                  onChange={(event) => setTopicoId(event.target.value)}
                  disabled={carregando || !materiaId}
                >
                  {topicos.map((topico) => (
                    <option key={topico.topico_id} value={topico.topico_id}>
                      {topico.nome}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  id="aula"
                  label="Aula"
                  placeholder="Selecione a aula (opcional)"
                  value={aulaId}
                  onChange={(event) => setAulaId(event.target.value)}
                  disabled={carregando || !materiaId}
                >
                  {aulas.map((aula) => (
                    <option key={aula.id} value={aula.id}>
                      {aula.titulo}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  id="tipo-prova"
                  label="Tipo de prova"
                  placeholder="Selecione o tipo (opcional)"
                  value={tipoProvaId}
                  onChange={(event) => setTipoProvaId(event.target.value)}
                  disabled={carregando}
                >
                  {tiposProva.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  id="dificuldade"
                  label="Dificuldade *"
                  value={dificuldade}
                  onChange={(event) => setDificuldade(event.target.value as QuestaoDificuldade)}
                  disabled={carregando}
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </SelectField>

                <TextField
                  id="ano"
                  label="Ano"
                  type="number"
                  placeholder="Ex.: 2024"
                  value={ano}
                  onChange={(event) => setAno(event.target.value)}
                  disabled={carregando}
                />

                <TextField
                  id="imagem-url"
                  label="URL da imagem"
                  placeholder="https://..."
                  value={imagemUrl}
                  onChange={(event) => setImagemUrl(event.target.value)}
                  disabled={carregando}
                />

                <div className={styles.fieldGroup}>
                  <span>Status *</span>
                  <StatusToggle options={STATUS_OPTIONS} value={status} onChange={setStatus} />
                </div>
              </div>

              <label className={styles.textareaField}>
                <span>Dica</span>
                <textarea
                  value={dica}
                  onChange={(event) => setDica(event.target.value)}
                  rows={2}
                  placeholder="Dica opcional para o aluno..."
                  disabled={carregando}
                />
              </label>
            </CardDiv>

            <CardDiv>
              <CardHeading>Enunciado</CardHeading>
              <label className={styles.textareaField}>
                <span>Enunciado da questão *</span>
                <textarea
                  value={enunciado}
                  onChange={(event) => setEnunciado(event.target.value)}
                  rows={5}
                  placeholder="Digite o enunciado completo da questão..."
                  disabled={carregando}
                  required
                />
              </label>
            </CardDiv>

            <CardDiv>
              <div className={styles.alternativesHeading}>
                <div>
                  <CardHeading>Alternativas</CardHeading>
                  <p>Adicione as alternativas e marque a correta.</p>
                </div>
                <Button type="button" variant="outline" size="sm" fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={addAlternativa} disabled={alternativas.length >= LETRAS.length}>
                  Alternativa
                </Button>
              </div>

              <div className={styles.alternativesList}>
                {alternativas.map((alternativa, index) => (
                  <AlternativeEditor
                    key={index}
                    alternativa={alternativa}
                    onChange={(next) => updateAlternativa(index, next)}
                    onRemove={() => removeAlternativa(index)}
                    podeRemover={alternativas.length > 2}
                  />
                ))}
                {!alternativas.length ? <div className={styles.empty}>Nenhuma alternativa adicionada.</div> : null}
              </div>
            </CardDiv>

            <CardDiv>
              <CardHeading>Explicação</CardHeading>
              <label className={styles.textareaField}>
                <span>Explicação da resposta correta</span>
                <textarea
                  value={explicacao}
                  onChange={(event) => setExplicacao(event.target.value)}
                  rows={4}
                  placeholder="Explique por que a alternativa correta é a certa..."
                  disabled={carregando}
                />
              </label>
            </CardDiv>
          </main>

          <div className={styles.sideColumn}>
            <CardDiv>
              <CardHeading>Pré-visualização</CardHeading>
              <p className={styles.previewHint}>Veja como a questão aparecerá para o aluno.</p>

              <div className={styles.previewCard}>
                <p className={styles.previewEnunciado}>{enunciado || 'Enunciado da questão'}</p>
                <div className={styles.previewAlternativas}>
                  {alternativas.map((alternativa, index) => (
                    <div key={index} className={`${styles.previewAlternativa}${alternativa.correta ? ` ${styles.previewAlternativaCorreta}` : ''}`}>
                      <span className={styles.previewLetra}>{alternativa.letra}.</span>
                      <span>{alternativa.texto || 'Texto da alternativa'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardDiv>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}
