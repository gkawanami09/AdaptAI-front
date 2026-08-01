import { useEffect, useRef, useState } from 'react'
import { EyeIcon, PencilIcon, MoreHorizontalIcon, AlertCircleIcon, XIcon, CheckCircleIcon, LockIcon, FireIcon } from '../ui/icons'
import type { UsuarioResumo } from '../../types/usuarios'
import styles from './UserActions.module.css'

type UserActionsProps = {
  usuario: UsuarioResumo
  onVisualizar: () => void
  onEditar: () => void
  onSuspender: () => void
  onBanir: () => void
  onReativar: () => void
  onResetarSenha: () => void
  onResetarOfensiva: () => void
}

export function UserActions({ usuario, onVisualizar, onEditar, onSuspender, onBanir, onReativar, onResetarSenha, onResetarOfensiva }: UserActionsProps) {
  const [aberto, setAberto] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  function handleAcao(acao: () => void) {
    acao()
    setAberto(false)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={onVisualizar}
        aria-label={`Visualizar ${usuario.nome}`}
        title="Visualizar"
      >
        <EyeIcon />
      </button>

      <button
        type="button"
        className={styles.trigger}
        onClick={onEditar}
        aria-label={`Editar ${usuario.nome}`}
        title="Editar"
      >
        <PencilIcon />
      </button>

      <button type="button" className={styles.trigger} onClick={() => setAberto((valor) => !valor)} aria-label="Mais ações">
        <MoreHorizontalIcon />
      </button>

      {aberto && (
        <div className={styles.menu} role="menu">
          {usuario.status === 'ativo' ? (
            <>
              <button type="button" className={styles.item} onClick={() => handleAcao(onSuspender)}>
                <AlertCircleIcon /> Suspender usuário
              </button>
              <button type="button" className={`${styles.item} ${styles['item--danger']}`} onClick={() => handleAcao(onBanir)}>
                <XIcon /> Banir usuário
              </button>
            </>
          ) : (
            <button type="button" className={styles.item} onClick={() => handleAcao(onReativar)}>
              <CheckCircleIcon /> Reativar usuário
            </button>
          )}
          <button type="button" className={styles.item} onClick={() => handleAcao(onResetarSenha)}>
            <LockIcon /> Resetar senha
          </button>
          <button type="button" className={styles.item} onClick={() => handleAcao(onResetarOfensiva)}>
            <FireIcon /> Resetar ofensiva
          </button>
        </div>
      )}
    </div>
  )
}
