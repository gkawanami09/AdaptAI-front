import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Loading } from '../../components/ui/Loading'
import { TitlePage } from '../../components/ui/TitlePage'
import { ArrowLeftIcon, BarChartIcon, ClockIcon, SaveIcon } from '../../components/ui/icons'
import { DicaCard } from '../../components/cards/DicaCard'
import { NextLessonCard } from '../../components/cards/NextLessonCard'
import { LessonContentRenderer, LessonVideo } from '../../components/lessons/LessonContentRenderer'
import { getMateriaPorId } from '../../services/materias'
import { getTopicosPorMateria } from '../../services/modulos'
import { getAula, getAulasPorMateria, patchAula } from '../../services/aulas'
import type { Aula, AulaDetalhe } from '../../types/aulas'
import styles from './AdminAulaPreview.module.css'

const DIFFICULTY = { basico: 'Básico', medio: 'Médio', dificil: 'Difícil' }

export function AdminAulaPreview() {
  const { materiaId, topicoId, aulaId } = useParams<{ materiaId: string; topicoId: string; aulaId: string }>()
  const navigate = useNavigate()
  const [aula, setAula] = useState<AulaDetalhe | null>(null)
  const [aulas, setAulas] = useState<Aula[]>([])
  const [materia, setMateria] = useState('')
  const [topico, setTopico] = useState('')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!materiaId || !topicoId || !aulaId) return
    let canceled = false
    Promise.all([
      getAula(aulaId),
      getAulasPorMateria({ materia_id: materiaId }),
      getMateriaPorId(materiaId),
      getTopicosPorMateria({ materia_id: materiaId }),
    ]).then(([lesson, list, subject, topics]) => {
      if (canceled) return
      setAula(lesson.aula)
      setAulas(list.aulas.filter((item) => item.topico_id === topicoId).sort((a, b) => a.ordem - b.ordem))
      setMateria(subject.materia.nome)
      setTopico(topics.topicos.find((item) => item.topico_id === topicoId)?.nome ?? '')
    }).catch((cause) => {
      console.error(cause)
      if (!canceled) setError('Não foi possível carregar a pré-visualização.')
    }).finally(() => {
      if (!canceled) setLoading(false)
    })
    return () => { canceled = true }
  }, [materiaId, topicoId, aulaId])

  if (loading) return <AdminPageLayout><div className={styles.loading}><Loading text="Carregando pré-visualização..." /></div></AdminPageLayout>
  if (!aula) return <AdminPageLayout><div className={styles.alert}>{error || 'Aula não encontrada.'}</div></AdminPageLayout>

  const duration = aula.conteudos.reduce((total, item) => total + (item.duracao || 0), 0)
  const mainVideo = [...aula.conteudos].sort((a, b) => a.ordem - b.ordem).find((item) => item.ativo && item.tipo === 'video' && item.video)
  const index = aulas.findIndex((item) => item.id === aula.id)
  const next = index >= 0 ? aulas[index + 1] : undefined

  async function publish() {
    setPublishing(true)
    setError('')
    try {
      const response = await patchAula(aula!.id, { ativo: true })
      setAula(response.aula)
    } catch (cause) {
      console.error(cause)
      setError('Não foi possível publicar a aula.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[
          { label: 'Conteúdos', to: '/admin' }, { label: 'Matérias', to: '/admin/materias' },
          { label: materia, to: `/admin/materias/${materiaId}` },
          { label: topico, to: `/admin/materias/${materiaId}/modulos/${topicoId}` },
          { label: aula.titulo }, { label: 'Pré-visualização' },
        ]} />
        <div className={styles.header}>
          <TitlePage title="Pré-visualização da aula" subtitle="Veja como o conteúdo será exibido para o aluno." />
          <div className={styles.actions}>
            <Button variant="outline" fullWidth={false} icon={<ArrowLeftIcon />} iconPosition="left" onClick={() => navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/aulas/${aulaId}/editar`)}>Voltar para edição</Button>
            <Button fullWidth={false} icon={<SaveIcon />} iconPosition="left" onClick={publish} disabled={publishing || aula.ativo}>{aula.ativo ? 'Aula publicada' : publishing ? 'Publicando...' : 'Publicar aula'}</Button>
          </div>
        </div>
        {error ? <div className={styles.alert}>{error}</div> : null}
        <div className={styles.columns}>
          <main className={styles.mainColumn}>
            <section className={styles.hero}>
              <div className={styles.lessonHeader}>
                <h1>{aula.titulo}</h1>
                <div><Badge color="blue">{materia}</Badge><span><ClockIcon /> {duration} min</span><Badge color="gold">{DIFFICULTY[aula.dificuldade]}</Badge></div>
              </div>
              {mainVideo?.video ? <LessonVideo url={mainVideo.video.video_link} title={mainVideo.video.titulo} /> : <div className={styles.noVideo}>Esta aula não possui conteúdo em vídeo.</div>}
            </section>
            {aula.resumo ? <section className={styles.summary}><h2>Resumo da aula</h2><p>{aula.resumo}</p></section> : null}
            <LessonContentRenderer contents={aula.conteudos} hideFirstVideo />
          </main>
          <aside className={styles.sidebar}>
            <section className={styles.topicNavigation}>
              <h2>Navegação do tópico</h2>
              <div>{aulas.map((item) => (
                <button key={item.id} type="button" className={item.id === aula.id ? styles.currentLesson : ''} onClick={() => navigate(`/admin/materias/${materiaId}/modulos/${topicoId}/aulas/${item.id}/preview`)}>
                  <span>{item.ordem}</span><strong>{item.titulo}</strong><small>{item.ativo ? 'Ativa' : 'Rascunho'}</small>
                </button>
              ))}</div>
            </section>
            {next ? <NextLessonCard title="Próxima aula" icon={<BarChartIcon />} iconColor="blue" lessonTitle={next.titulo} duration="Próxima na ordem" difficulty={DIFFICULTY[next.dificuldade]} /> : null}
            <DicaCard icon="🤖" title="Dica da Ada" message="Revise textos, links e a ordem dos conteúdos antes de publicar a aula para os alunos." />
          </aside>
        </div>
      </div>
    </AdminPageLayout>
  )
}
