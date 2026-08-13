import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ArrowLeftIcon,
  BarChartIcon,
  BoltIcon,
  BookIcon,
  ChevronDownIcon,
  ClipboardIcon,
  FileTextIcon,
  GridIcon,
  HelpCircleIcon,
  LogOutIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon,
} from '../ui/icons'
import { clearStoredAuth } from '../../services/auth'
import { removeCookie, TOKEN_COOKIE_NAME } from '../../utils/cookies'
import type { UserProfile } from '../../types/auth'
import styles from './AdminSidebar.module.css'

type AdminSidebarProps = {
  perfil: UserProfile | null
}

const topItems = [
  { to: '/admin', label: 'Dashboard', icon: GridIcon },
  { to: '/admin/usuarios', label: 'Usuários', icon: UsersIcon },
]

const conteudosItems = [
  { to: '/admin/materias', label: 'Matérias', icon: BookIcon },
  { to: '/admin/aulas', label: 'Aulas', icon: BookIcon },
]

const avaliacoesItems = [
  { to: '/admin/questoes', label: 'Questões', icon: HelpCircleIcon },
  { to: '/admin/listas', label: 'Listas', icon: ClipboardIcon },
  { to: '/admin/tipos-prova', label: 'Tipos de Prova', icon: FileTextIcon },
]

const bottomItems = [
  { to: '/admin/relatorios', label: 'Relatórios', icon: BarChartIcon },
  { to: '/admin/monitoramento', label: 'Monitoramento', icon: TrendingUpIcon },
  { to: '/admin/configuracoes', label: 'Configurações', icon: SettingsIcon },
]

function getInitials(nome: string) {
  const parts = nome.trim().split(/\s+/)
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2)
  return (initials ?? 'U').toUpperCase()
}

function getTipoUsuarioLabel(tipoUsuario: string | undefined) {
  switch (tipoUsuario) {
    case 'admin':
      return 'Admin'
    case 'professor':
      return 'Professor'
    default:
      return 'Aluno'
  }
}

export function AdminSidebar({ perfil }: AdminSidebarProps) {
  const location = useLocation()
  const [conteudosAberto, setConteudosAberto] = useState(
    conteudosItems.some((item) => location.pathname.startsWith(item.to)),
  )
  const [avaliacoesAberto, setAvaliacoesAberto] = useState(
    avaliacoesItems.some((item) => location.pathname.startsWith(item.to)),
  )

  function handleLogout() {
    // TODO: conectar ao backend — invalidar a sessão/token no servidor, se aplicável
    removeCookie(TOKEN_COOKIE_NAME)
    clearStoredAuth()
    window.location.href = '/login'
  }

  return (
    <aside className={styles.sidebar}>
      <Link to="/admin" className={styles.brand}>
        <span className={styles.brandLogo}>
          <BoltIcon />
        </span>
        <span className={styles.brandName}>AdaptAI</span>
      </Link>

      <nav className={styles.nav}>
        {topItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`}
          >
            <Icon className={styles.navIcon} />
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}

        <button type="button" className={styles.navGroupToggle} onClick={() => setConteudosAberto((value) => !value)}>
          <FileTextIcon className={styles.navIcon} />
          <span className={styles.navLabel}>Conteúdos</span>
          <ChevronDownIcon className={`${styles.groupChevron}${conteudosAberto ? ` ${styles.groupChevronOpen}` : ''}`} />
        </button>

        {conteudosAberto && (
          <div className={styles.navGroup}>
            {conteudosItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`}
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        <button type="button" className={styles.navGroupToggle} onClick={() => setAvaliacoesAberto((value) => !value)}>
          <ClipboardIcon className={styles.navIcon} />
          <span className={styles.navLabel}>Avaliações</span>
          <ChevronDownIcon className={`${styles.groupChevron}${avaliacoesAberto ? ` ${styles.groupChevronOpen}` : ''}`} />
        </button>

        {avaliacoesAberto && (
          <div className={styles.navGroup}>
            {avaliacoesItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`}
              >
                <Icon className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {bottomItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`}
          >
            <Icon className={styles.navIcon} />
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}

        <Link to="/dashboard" className={styles.navItem}>
          <ArrowLeftIcon className={styles.navIcon} />
          <span className={styles.navLabel}>Voltar ao app</span>
        </Link>
      </nav>

      <button type="button" className={styles.userArea} onClick={handleLogout} title="Sair">
        <span className={styles.avatar}>
          {perfil?.avatarUrl ? <img src={perfil.avatarUrl} alt="" /> : getInitials(perfil?.nome ?? 'Usuário')}
        </span>
        <span className={styles.userInfo}>
          <span className={styles.userName}>{perfil?.nome ?? 'Usuário'}</span>
          <span className={styles.userRole}>{getTipoUsuarioLabel(perfil?.nivelAcesso)}</span>
        </span>
        <LogOutIcon className={styles.logoutIcon} />
      </button>
    </aside>
  )
}
