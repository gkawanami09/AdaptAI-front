import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { XIcon } from './icons'
import styles from './Modal.module.css'

type ModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            <XIcon />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
