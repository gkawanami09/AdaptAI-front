import { Badge } from '../ui/Badge'
import { ClockIcon, FileTextIcon, PlayIcon } from '../ui/icons'
import type { AulaConteudo, AulaDificuldade } from '../../types/aulas'
import styles from './LessonPreviewSidebar.module.css'

type LessonPreviewSidebarProps = {
  titulo: string
  materia: string
  topico: string
  dificuldade: AulaDificuldade
  ativo: boolean
  maisCobrado: boolean
  conteudos: AulaConteudo[]
}

const DIFFICULTY_LABELS: Record<AulaDificuldade, string> = {
  basico: 'Básico',
  medio: 'Médio',
  dificil: 'Difícil',
}

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return match?.[1] ?? null
}

export function LessonPreviewSidebar({
  titulo,
  materia,
  topico,
  dificuldade,
  ativo,
  maisCobrado,
  conteudos,
}: LessonPreviewSidebarProps) {
  const totalDuration = conteudos.reduce((total, item) => total + (Number(item.duracao) || 0), 0)
  const video = conteudos.find((item) => item.tipo === 'video')
  const videoId = youtubeId(video?.video?.video_link ?? '')

  return (
    <aside className={styles.sidebar}>
      <section className={styles.panel}>
        <h2>Pré-visualização do vídeo</h2>
        <div className={styles.video}>
          {videoId ? <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Thumbnail do primeiro vídeo da aula" /> : <div className={styles.placeholder}>Adicione um link do YouTube para visualizar a capa</div>}
          {videoId ? <span className={styles.play}><PlayIcon /></span> : null}
        </div>
        <small>Prévia baseada no primeiro conteúdo em vídeo.</small>
      </section>

      <section className={styles.panel}>
        <h2>Prévia do card da aula</h2>
        <div className={styles.lessonCard}>
          <div className={styles.lessonIcon}>f(x)</div>
          <div className={styles.lessonInfo}>
            <strong>{titulo || 'Título da nova aula'}</strong>
            <Badge color="blue">{materia || 'Matéria'}</Badge>
            <span><ClockIcon /> {totalDuration} min <i /> {DIFFICULTY_LABELS[dificuldade]}</span>
          </div>
        </div>
        <div className={styles.previewButton}>Ver aula</div>
      </section>

      <section className={styles.panel}>
        <h2>Resumo rápido</h2>
        <dl className={styles.summary}>
          <div><dt>Matéria</dt><dd>{materia || '—'}</dd></div>
          <div><dt>Tópico</dt><dd>{topico || '—'}</dd></div>
          <div><dt>Conteúdos</dt><dd><FileTextIcon /> {conteudos.length}</dd></div>
          <div><dt>Tempo total</dt><dd>{totalDuration} min</dd></div>
          <div><dt>Status</dt><dd className={ativo ? styles.active : styles.draft}>{ativo ? 'Ativa' : 'Rascunho'}</dd></div>
          <div><dt>Mais cobrada</dt><dd>{maisCobrado ? 'Sim' : 'Não'}</dd></div>
        </dl>
      </section>
    </aside>
  )
}
