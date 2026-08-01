import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SelectField } from '../ui/SelectField'
import styles from './SuspensionModal.module.css'

type SuspensionModalProps = {
  nome: string
  enviando?: boolean
  onConfirm: (motivo: string, duracaoDias: number) => void
  onClose: () => void
}

export function SuspensionModal({ nome, enviando, onConfirm, onClose }: SuspensionModalProps) {
  const [motivo, setMotivo] = useState('')
  const [duracaoDias, setDuracaoDias] = useState(7)

  return (
    <Modal title={`Suspender ${nome}`} onClose={onClose}>
      <div className={styles.field}>
        <span className={styles.label}>Motivo</span>
        <textarea
          className={styles.textarea}
          value={motivo}
          onChange={(event) => setMotivo(event.target.value)}
          placeholder="Descreva o motivo da suspensão..."
        />
      </div>

      <div className={styles.field}>
        <SelectField
          id="duracao-suspensao"
          label="Duração"
          value={String(duracaoDias)}
          onChange={(event) => setDuracaoDias(Number(event.target.value))}
        >
          <option value="1">1 dia</option>
          <option value="3">3 dias</option>
          <option value="7">7 dias</option>
          <option value="15">15 dias</option>
          <option value="30">30 dias</option>
        </SelectField>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="button" fullWidth={false} onClick={() => onConfirm(motivo, duracaoDias)} disabled={enviando || !motivo.trim()}>
          {enviando ? 'Suspendendo...' : 'Suspender'}
        </Button>
      </div>
    </Modal>
  )
}
