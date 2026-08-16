import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellIcon, BoltIcon, FireIcon, SearchIcon } from '../ui/icons'
import type { UserProfile } from '../../types/auth'
import styles from './AdminTopBar.module.css'

type AdminTopBarProps = {
  perfil: UserProfile | null
  streak?: number
  hasNotifications?: boolean
}

function getInitials(nome: string) {
  const parts = nome.trim().split(/\s+/)
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2)
  return (initials ?? 'U').toUpperCase()
}

export function AdminTopBar({ perfil, streak, hasNotifications }: AdminTopBarProps) {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!busca.trim()) return
    // Busca unificada (conteúdos/relatórios) ainda não existe no backend — por ora,
    // encaminha para a lista de usuários, que já tem busca própria funcional.
    navigate('/admin/usuarios', { state: { busca: busca.trim() } })
  }

  return (
    <div className={styles.bar}>
      <form className={styles.search} onSubmit={handleSubmit} role="search">
        <SearchIcon className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar usuários, conteúdos, relatórios..."
          aria-label="Buscar"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </form>

      <div className={styles.actions}>
        {streak !== undefined && (
          <span className={styles.pill}>
            <FireIcon className={styles.pillIcon} />
            {streak}
          </span>
        )}
        {perfil?.xp !== undefined && (
          <span className={`${styles.pill} ${styles['pill--purple']}`}>
            <BoltIcon className={styles.pillIcon} />
            {perfil.xp.toLocaleString('pt-BR')}
          </span>
        )}

        <button type="button" className={styles.iconButton} aria-label="Notificações">
          <BellIcon />
          {hasNotifications && <span className={styles.notificationDot} />}
        </button>

        <span className={styles.avatar}>{getInitials(perfil?.nome ?? 'Usuário')}</span>
      </div>
    </div>
  )
}
