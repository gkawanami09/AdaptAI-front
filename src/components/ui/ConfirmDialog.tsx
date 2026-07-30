import { Modal } from './Modal'
import { Button } from './Button'
import styles from './ConfirmDialog.module.css'

type ConfirmDialogProps = {
  title: string
  description: string
  confirmLabel?: string
  confirmando?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({ title, description, confirmLabel = 'Excluir', confirmando, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className={styles.text}>{description}</p>
      <div className={styles.actions}>
        <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={confirmando}>
          Cancelar
        </Button>
        <Button type="button" fullWidth={false} onClick={onConfirm} disabled={confirmando}>
          {confirmando ? 'Excluindo...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
