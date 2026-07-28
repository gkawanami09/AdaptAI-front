import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { Button } from '../../components/ui/Button'
import { SelectField } from '../../components/ui/SelectField'
import { StatusToggle } from '../../components/ui/StatusToggle'
import { Switch } from '../../components/ui/Switch'
import { TextField } from '../../components/ui/TextField'
import { TitlePage } from '../../components/ui/TitlePage'
import { EyeIcon, PlusIcon, SaveIcon, XIcon } from '../../components/ui/icons'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { LessonContentCard } from '../../components/admin/LessonContentCard'
import { LessonPreviewSidebar } from '../../components/admin/LessonPreviewSidebar'
import { getMateriaPorId } from '../../services/materias'
import { getTopicosPorMateria } from '../../services/modulos'
import { getAula, getAulasPorMateria, patchAula, postAula } from '../../services/aulas'
import type { AulaConteudo, AulaDificuldade } from '../../types/aulas'
import styles from './AdminAulaNova.module.css'

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativa', color: 'green' as const },
  { value: 'rascunho', label: 'Rascunho', color: 'gold' as const },
]

function newContent(index: number, tipo: 'texto' | 'video' = 'texto'): AulaConteudo {
  return {
    tipo,
    ordem: index + 1,
    duracao: 0,
    ativo: true,
    texto: tipo === 'texto' ? { titulo: '', descricao: '' } : null,
    video: tipo === 'video' ? { titulo: '', video_link: '', descricao: '' } : null,
  }
}

function slugify(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function AdminAulaNova() {
  const { materiaId, topicoId, aulaId } = useParams<{ materiaId: string; topicoId: string; aulaId?: string }>()
  const navigate = useNavigate()
  const editing = Boolean(aulaId)
  const [materiaNome, setMateriaNome] = useState('')
  const [topicoNome, setTopicoNome] = useState('')
  const [titulo, setTitulo] = useState('')
  const [resumo, setResumo] = useState('')
  const [ordem, setOrdem] = useState(1)
  const [dificuldade, setDificuldade] = useState<AulaDificuldade>('medio')
  const [status, setStatus] = useState('ativo')
  const [maisCobrado, setMaisCobrado] = useState(false)
  const [conteudos, setConteudos] = useState<AulaConteudo[]>([newContent(0)])
  const [expanded, setExpanded] = useState(0)
  const [contentErrors, setContentErrors] = useState<string[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!materiaId || !topicoId) return
    let canceled = false
    async function load() {
      try {
        const [materiaResponse, topicosResponse, aulasResponse, lessonResponse] = await Promise.all([
          getMateriaPorId(materiaId!),
          getTopicosPorMateria({ materia_id: materiaId! }),
          getAulasPorMateria({ materia_id: materiaId! }),
          aulaId ? getAula(aulaId) : Promise.resolve(null),
        ])
        if (canceled) return
        const topic = topicosResponse.topicos.find((item) => item.topico_id === topicoId)
        if (!topic) throw new Error('Tópico não encontrado')
        setMateriaNome(materiaResponse.materia.nome)
        setTopicoNome(topic.nome ?? '')
        if (lessonResponse) {
          const lesson = lessonResponse.aula
          setTitulo(lesson.titulo)
          setResumo(lesson.resumo ?? '')
          setOrdem(lesson.ordem)
          setDificuldade(lesson.dificuldade)
          setStatus(lesson.ativo ? 'ativo' : 'rascunho')
          setMaisCobrado(lesson.mais_cobrado)
          setConteudos(lesson.conteudos.length ? lesson.conteudos : [newContent(0)])
        } else {
          setOrdem(aulasResponse.aulas.filter((aula) => aula.topico_id === topicoId).length + 1)
        }
      } catch (error) {
        console.error(error)
        if (!canceled) setErro('Não foi possível carregar os dados da aula.')
      } finally {
        if (!canceled) setCarregando(false)
      }
    }
    load()
    return () => { canceled = true }
  }, [materiaId, topicoId, aulaId])

  function cancel() {
    navigate(`/admin/materias/${materiaId}/modulos/${topicoId}`)
  }

  function addContent(tipo: 'texto' | 'video') {
    setConteudos((current) => [...current, newContent(current.length, tipo)])
    setExpanded(conteudos.length)
  }

  function updateContent(index: number, content: AulaConteudo) {
    setConteudos((current) => current.map((item, itemIndex) => itemIndex === index ? content : item))
  }

  function removeContent(index: number) {
    setConteudos((current) => current.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, ordem: itemIndex + 1 })))
    setExpanded((current) => Math.max(0, current > index ? current - 1 : current))
  }

  function validateContents() {
    return conteudos.map((content) => {
      if (content.duracao < 0 || content.ordem < 1) return 'Informe duração e ordem válidas.'
      if (content.tipo === 'texto' && (!content.texto?.titulo.trim() || !content.texto.descricao.trim())) return 'Preencha o título e a descrição deste texto.'
      if (content.tipo === 'video' && (!content.video?.titulo.trim() || !content.video.video_link.trim())) return 'Preencha o título e o link deste vídeo.'
      return ''
    })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!materiaId || !topicoId) return
    const errors = validateContents()
    setContentErrors(errors)
    if (!conteudos.length || errors.some(Boolean)) {
      setErro(!conteudos.length ? 'Adicione pelo menos um conteúdo à aula.' : 'Revise os conteúdos destacados.')
      return
    }
    setSalvando(true)
    setErro('')
    try {
      const payload = {
        materia_id: materiaId,
        topico_id: topicoId,
        titulo: titulo.trim(),
        resumo: resumo.trim() || null,
        dificuldade,
        mais_cobrado: maisCobrado,
        ordem,
        ativo: status === 'ativo',
        conteudos,
      }
      const response = aulaId
        ? await patchAula(aulaId, payload)
        : await postAula(payload)
      navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/aulas/${response.aula.id}/preview`)
    } catch (error) {
      console.error(error)
      setErro('Não foi possível salvar a aula. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[
          { label: 'Conteúdos', to: '/admin' },
          { label: 'Matérias', to: '/admin/materias' },
          { label: materiaNome || 'Matéria', to: `/admin/materias/${materiaId}` },
          { label: topicoNome || 'Tópico', to: `/admin/materias/${materiaId}/modulos/${topicoId}` },
          { label: 'Nova aula' },
        ]} />

        <div className={styles.header}>
          <TitlePage
            title={editing ? 'Editar aula' : 'Nova aula'}
            subtitle={editing ? 'Atualize a aula e seus conteúdos.' : 'Cadastre uma nova aula e adicione todos os conteúdos que desejar.'}
          />
          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={cancel}>Cancelar</Button>
            {aulaId ? (
              <Button type="button" variant="outline" fullWidth={false} icon={<EyeIcon />} iconPosition="left" onClick={() => navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/aulas/${aulaId}/preview`)}>
                Pré-visualizar
              </Button>
            ) : null}
            <Button type="submit" form="new-lesson-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left" disabled={carregando || salvando}>
              {salvando ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar aula'}
            </Button>
          </div>
        </div>

        {erro ? <div className={styles.alert} role="alert">{erro}</div> : null}

        <form id="new-lesson-form" className={styles.contentRow} onSubmit={submit}>
          <main className={styles.mainColumn}>
            <CardDiv>
              <CardHeading>Informações da aula</CardHeading>
              <div className={styles.grid}>
                <TextField label="Título da aula *" placeholder="Ex.: Introdução à função quadrática" value={titulo} onChange={(event) => setTitulo(event.target.value)} disabled={carregando} required />
                <TextField label="Matéria *" value={materiaNome} disabled />
                <TextField label="Tópico *" value={topicoNome} disabled />
                <TextField label="Slug" value={slugify(titulo)} placeholder="gerado-automaticamente" readOnly disabled />
              </div>
              <label className={styles.textareaField}>
                <span>Resumo da aula</span>
                <textarea value={resumo} onChange={(event) => setResumo(event.target.value.slice(0, 300))} rows={4} maxLength={300} placeholder="Resuma o que o aluno aprenderá nesta aula..." />
                <small>{resumo.length}/300</small>
              </label>
              <div className={styles.settingsGrid}>
                <TextField label="Ordem de exibição *" type="number" min={1} value={ordem} onChange={(event) => setOrdem(Number(event.target.value))} required />
                <SelectField label="Dificuldade *" value={dificuldade} onChange={(event) => setDificuldade(event.target.value as AulaDificuldade)}>
                  <option value="basico">Básico</option><option value="medio">Médio</option><option value="dificil">Difícil</option>
                </SelectField>
                <div className={styles.fieldGroup}><span>Status *</span><StatusToggle options={STATUS_OPTIONS} value={status} onChange={setStatus} /></div>
                <div className={styles.switchSetting}><Switch checked={maisCobrado} onChange={setMaisCobrado} label="Mais cobrada" /><span><strong>Mais cobrada</strong><small>Destaca esta aula para o aluno.</small></span></div>
              </div>
            </CardDiv>

            <CardDiv>
              <div className={styles.contentsHeading}>
                <div><CardHeading>Conteúdos da aula</CardHeading><p>Adicione textos e vídeos na ordem em que serão estudados.</p></div>
                <div className={styles.addActions}>
                  <Button type="button" variant="outline" size="sm" fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={() => addContent('texto')}>Texto</Button>
                  <Button type="button" size="sm" fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={() => addContent('video')}>Vídeo</Button>
                </div>
              </div>
              <div className={styles.contentsList}>
                {conteudos.map((content, index) => (
                  <LessonContentCard key={`${index}-${content.tipo}`} content={content} index={index} expanded={expanded === index} error={contentErrors[index]} onToggle={() => setExpanded(expanded === index ? -1 : index)} onChange={(next) => updateContent(index, next)} onRemove={() => removeContent(index)} />
                ))}
                {!conteudos.length ? <div className={styles.empty}>Nenhum conteúdo adicionado.</div> : null}
              </div>
            </CardDiv>
          </main>

          <div className={styles.sideColumn}>
            <LessonPreviewSidebar titulo={titulo} materia={materiaNome} topico={topicoNome} dificuldade={dificuldade} ativo={status === 'ativo'} maisCobrado={maisCobrado} conteudos={conteudos} />
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}
