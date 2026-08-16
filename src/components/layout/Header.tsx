import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  BoltIcon,
  BookIcon,
  CalendarIcon,
  ChatIcon,
  ClipboardIcon,
  FeatherIcon,
  GridIcon,
  HelpCircleIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  TrendingUpIcon,
  TrophyIcon,
} from '../ui/icons'
import { clearStoredAuth, logoutUser } from '../../services/auth'
import { removeCookie, TOKEN_COOKIE_NAME } from '../../utils/cookies'
import type { UserProfile } from '../../types/auth'
import styles from './Header.module.css'

type HeaderProps = {
  perfil: UserProfile | null
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: GridIcon },
  { to: '/plano-de-estudos', label: 'Plano de Estudos', icon: CalendarIcon },
  { to: '/aulas', label: 'Aulas', icon: BookIcon },
  { to: '/questoes', label: 'Questões', icon: HelpCircleIcon },
  { to: '/simulados', label: 'Simulados', icon: ClipboardIcon },
  { to: '/redacao', label: 'Redação', icon: FeatherIcon },
  { to: '/chat', label: 'Chat AdaptAI', icon: ChatIcon, badge: 'IA' },
  { to: '/progresso', label: 'Progresso', icon: TrendingUpIcon },
  { to: '/conquistas', label: 'Conquistas', icon: TrophyIcon },
  { to: '/configuracoes', label: 'Configurações', icon: SettingsIcon },
]

const adminNavItem = { to: '/admin', label: 'Admin', icon: ShieldIcon }

function getInitials(nome: string) {
  const parts = nome.trim().split(/\s+/)
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2)
  return (initials ?? 'U').toUpperCase()
}

export function Header({ perfil }: HeaderProps) {
  const [busca, setBusca] = useState('')
  const isAdmin = perfil?.nivelAcesso === 'admin'

  async function handleLogout() {
    try {
      await logoutUser()
    } finally {
      removeCookie(TOKEN_COOKIE_NAME)
      clearStoredAuth()
      window.location.href = '/login'
    }
  }

  function handleBuscaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: conectar à busca real (endpoint/índice de conteúdo) quando disponível
    console.log('buscar', busca)
  }

  return (
    <aside className={styles.sidebar}>
      <Link to="/dashboard" className={styles.brand}>
        <span className={styles.brandLogo}>
          <BoltIcon />
        </span>
        <span className={styles.brandName}>AdaptAI</span>
      </Link>

      <form className={styles.search} onSubmit={handleBuscaSubmit} role="search">
        <SearchIcon className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Pesquisar..."
          aria-label="Pesquisar"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </form>

      <nav className={styles.nav}>
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`}
          >
            <Icon className={styles.navIcon} />
            <span className={styles.navLabel}>{label}</span>
            {badge && <span className={styles.navBadge}>{badge}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className={styles.navDivider} />
            <NavLink
              to={adminNavItem.to}
              className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`}
            >
              <adminNavItem.icon className={styles.navIcon} />
              <span className={styles.navLabel}>{adminNavItem.label}</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className={styles.userArea}>
        <span className={styles.avatar}>
          {perfil?.avatarUrl ? <img src={perfil.avatarUrl} alt="" /> : getInitials(perfil?.nome ?? 'Usuário')}
        </span>
        <span className={styles.userInfo}>
          <span className={styles.userName}>{perfil?.nome ?? 'Usuário'}</span>
          {isAdmin ? (
            <span className={styles.userRole}>Admin</span>
          ) : (
            (perfil?.nivel || perfil?.xp) && (
              <span className={styles.userMeta}>
                {perfil?.nivel ? `Nível ${perfil.nivel}` : ''}
                {perfil?.nivel && perfil?.xp ? ' · ' : ''}
                {perfil?.xp ? `${perfil.xp.toLocaleString('pt-BR')} XP` : ''}
              </span>
            )
          )}
        </span>
        <button type="button" className={styles.logoutButton} onClick={handleLogout} aria-label="Sair" title="Sair">
          <LogOutIcon className={styles.logoutIcon} />
        </button>
      </div>
    </aside>
  )
}
