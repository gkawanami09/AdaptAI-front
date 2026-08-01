import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import styles from './SuspensionModal.module.css'

type BanModalProps = {
  nome: string
  enviando?: boolean
  onConfirm: (motivo: string) => void
  onClose: () => void
}

export function BanModal({ nome, enviando, onConfirm, onClose }: BanModalProps) {
  const [motivo, setMotivo] = useState('')

  return (
    <Modal title={`Banir ${nome}`} onClose={onClose}>
      <div className={styles.field}>
        <span className={styles.label}>Motivo</span>
        <textarea
          className={styles.textarea}
          value={motivo}
          onChange={(event) => setMotivo(event.target.value)}
          placeholder="Descreva o motivo do banimento..."
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="button" fullWidth={false} onClick={() => onConfirm(motivo)} disabled={enviando || !motivo.trim()}>
          {enviando ? 'Banindo...' : 'Banir'}
        </Button>
      </div>
    </Modal>
  )
}
