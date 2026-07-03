import { Link } from 'react-router-dom'
import { BoltIcon } from '../ui/icons'
import { removeCookie, TOKEN_COOKIE_NAME } from '../../utils/cookies'
import type { UserProfile } from '../../types/auth'
import styles from './Header.module.css'

type HeaderProps = {
  perfil: UserProfile | null
}

export function Header({ perfil }: HeaderProps) {
  function handleLogout() {
    // TODO: conectar ao backend — invalidar a sessão/token no servidor, se aplicável
    removeCookie(TOKEN_COOKIE_NAME)
    window.location.href = '/login'
  }

  return (
    <header className={styles.header}>
      <Link to="/dashboard" className={styles.brand}>
        <span className={styles.brandLogo}>
          <BoltIcon />
        </span>
        <span className={styles.brandName}>AdaptAI</span>
      </Link>

      <div className={styles.userArea}>
        {perfil?.nome && <span className={styles.userName}>{perfil.nome}</span>}
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}
