import { Button } from '../ui/Button'
import { SelectField } from '../ui/SelectField'
import { Switch } from '../ui/Switch'
import { TextField } from '../ui/TextField'
import { ChevronDownIcon, ChevronRightIcon, XIcon } from '../ui/icons'
import type { AulaConteudo, AulaConteudoTipo } from '../../types/aulas'
import styles from './LessonContentCard.module.css'

type LessonContentCardProps = {
  content: AulaConteudo
  index: number
  expanded: boolean
  error?: string
  onToggle: () => void
  onChange: (content: AulaConteudo) => void
  onRemove: () => void
}

export function LessonContentCard({
  content,
  index,
  expanded,
  error,
  onToggle,
  onChange,
  onRemove,
}: LessonContentCardProps) {
  const data = content.tipo === 'texto' ? content.texto : content.video

  function changeType(tipo: AulaConteudoTipo) {
    onChange({
      ...content,
      tipo,
      texto: tipo === 'texto' ? { titulo: data?.titulo ?? '', descricao: data?.descricao ?? '' } : null,
      video: tipo === 'video' ? { titulo: data?.titulo ?? '', video_link: '', descricao: data?.descricao ?? '' } : null,
    })
  }

  function changeData(field: 'titulo' | 'descricao' | 'video_link', value: string) {
    if (content.tipo === 'texto') {
      onChange({ ...content, texto: { ...content.texto!, [field]: value } })
      return
    }
    onChange({ ...content, video: { ...content.video!, [field]: value } })
  }

  return (
    <article className={`${styles.card}${error ? ` ${styles.cardError}` : ''}`}>
      <div className={styles.header}>
        <button type="button" className={styles.titleButton} onClick={onToggle} aria-expanded={expanded}>
          {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          <span className={styles.number}>{index + 1}</span>
          <span>
            <strong>{data?.titulo || `Conteúdo ${index + 1}`}</strong>
            <small>{content.tipo === 'video' ? 'Vídeo' : 'Texto'} · {content.duracao || 0} min</small>
          </span>
        </button>
        <Button type="button" variant="outline" size="sm" fullWidth={false} icon={<XIcon />} onClick={onRemove}>
          Remover
        </Button>
      </div>

      {expanded ? (
        <div className={styles.body}>
          <div className={styles.grid}>
            <SelectField label="Tipo *" value={content.tipo} onChange={(event) => changeType(event.target.value as AulaConteudoTipo)}>
              <option value="texto">Texto</option>
              <option value="video">Vídeo</option>
            </SelectField>
            <TextField
              label="Ordem *"
              type="number"
              min={1}
              value={content.ordem}
              onChange={(event) => onChange({ ...content, ordem: Number(event.target.value) })}
              required
            />
            <TextField
              label="Duração (minutos) *"
              type="number"
              min={0}
              value={content.duracao}
              onChange={(event) => onChange({ ...content, duracao: Number(event.target.value) })}
              required
            />
            <div className={styles.switchField}>
              <span>Conteúdo ativo</span>
              <Switch checked={content.ativo} onChange={(ativo) => onChange({ ...content, ativo })} label="Conteúdo ativo" />
            </div>
          </div>

          <TextField
            label="Título *"
            placeholder={content.tipo === 'video' ? 'Ex.: Resolução em vídeo' : 'Ex.: Conceitos fundamentais'}
            value={data?.titulo ?? ''}
            onChange={(event) => changeData('titulo', event.target.value)}
            required
          />

          {content.tipo === 'video' ? (
            <TextField
              label="Link do YouTube *"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={content.video?.video_link ?? ''}
              onChange={(event) => changeData('video_link', event.target.value)}
              required
            />
          ) : null}

          <label className={styles.textareaField}>
            <span>Descrição {content.tipo === 'texto' ? '*' : ''}</span>
            <textarea
              className={styles.textarea}
              rows={5}
              placeholder="Descreva o conteúdo, explicações e observações importantes..."
              value={data?.descricao ?? ''}
              onChange={(event) => changeData('descricao', event.target.value)}
              required={content.tipo === 'texto'}
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      ) : null}
    </article>
  )
}
