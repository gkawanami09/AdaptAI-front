import styles from './UserAvatar.module.css'

type UserAvatarProps = {
  nome: string
  avatarUrl?: string | null
  size?: 'md' | 'lg'
}

function getInitials(nome: string) {
  const parts = nome.trim().split(/\s+/)
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2)
  return (initials ?? 'U').toUpperCase()
}

export function UserAvatar({ nome, avatarUrl, size = 'md' }: UserAvatarProps) {
  const sizeClass = size === 'lg' ? styles['avatar--lg'] : ''

  if (avatarUrl) {
    return <img className={`${styles.avatar} ${sizeClass}`} src={avatarUrl} alt={nome} />
  }

  return <span className={`${styles.avatar} ${styles['avatar--initials']} ${sizeClass}`}>{getInitials(nome)}</span>
}
