import { CheckCircleIcon, XIcon } from '../ui/icons'
import type { AlternativaQuestao } from '../../types/questoes'
import styles from './AlternativeEditor.module.css'

type AlternativeEditorProps = {
  alternativa: AlternativaQuestao
  onChange: (alternativa: AlternativaQuestao) => void
  onRemove: () => void
  podeRemover: boolean
}

export function AlternativeEditor({ alternativa, onChange, onRemove, podeRemover }: AlternativeEditorProps) {
  return (
    <div className={`${styles.row}${alternativa.correta ? ` ${styles.rowCorreta}` : ''}`}>
      <span className={styles.letra}>{alternativa.letra}</span>

      <input
        className={styles.texto}
        placeholder={`Texto da alternativa ${alternativa.letra}`}
        value={alternativa.texto}
        onChange={(event) => onChange({ ...alternativa, texto: event.target.value })}
      />

      <button
        type="button"
        className={`${styles.correctButton}${alternativa.correta ? ` ${styles.correctButtonActive}` : ''}`}
        aria-pressed={alternativa.correta}
        onClick={() => onChange({ ...alternativa, correta: true })}
        title="Marcar como correta"
      >
        <CheckCircleIcon />
      </button>

      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        disabled={!podeRemover}
        aria-label={`Remover alternativa ${alternativa.letra}`}
      >
        <XIcon />
      </button>
    </div>
  )
}
