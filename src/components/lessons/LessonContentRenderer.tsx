import type { AulaConteudo } from '../../types/aulas'
import { getYoutubeId } from '../../utils/youtube'
import { PlayIcon } from '../ui/icons'
import styles from './LessonContentRenderer.module.css'

type Props = { contents: AulaConteudo[]; hideFirstVideo?: boolean }

function RichText({ value }: { value: string }) {
  if (!/<\/?[a-z][\s\S]*>/i.test(value)) return <p className={styles.description}>{value}</p>
  const safe = value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/\s(href|src)\s*=\s*(["'])javascript:.*?\2/gi, '')
  return <div className={styles.richText} dangerouslySetInnerHTML={{ __html: safe }} />
}

export function LessonVideo({ url, title }: { url: string; title: string }) {
  const id = getYoutubeId(url)
  return id ? (
    <div className={styles.videoFrame}>
      <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  ) : (
    <div className={styles.videoPlaceholder}><PlayIcon /><span>Vídeo indisponível para pré-visualização</span></div>
  )
}

export function LessonContentRenderer({ contents, hideFirstVideo = false }: Props) {
  const orderedContents = [...contents].sort((a, b) => a.ordem - b.ordem)
  const firstVideoIndex = hideFirstVideo ? orderedContents.findIndex((content) => content.ativo && content.tipo === 'video') : -1
  return (
    <div className={styles.list}>
      {orderedContents.map((content, index) => {
        if (!content.ativo) return null
        const hide = index === firstVideoIndex
        const data = content.tipo === 'texto' ? content.texto : content.video
        return (
          <section className={styles.card} key={`${content.ordem}-${content.tipo}-${index}`}>
            <div className={styles.heading}>
              <span>{content.ordem}</span>
              <div><h2>{data?.titulo || `Conteúdo ${content.ordem}`}</h2><small>{content.tipo === 'video' ? 'Vídeo' : 'Leitura'} · {content.duracao} min</small></div>
            </div>
            {!hide && content.tipo === 'video' && content.video ? <LessonVideo url={content.video.video_link} title={content.video.titulo} /> : null}
            {data?.descricao ? <RichText value={data.descricao} /> : null}
          </section>
        )
      })}
    </div>
  )
}
