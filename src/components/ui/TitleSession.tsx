import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './icons'
import styles from './TitleSession.module.css'

type TitleSessionProps = {
  title?: string
  linkText?: string
  linkTo?: string
}

export function TitleSession({ title, linkText = 'Ver tudo', linkTo = '#' }: TitleSessionProps) {
  return (
    <div className={styles.container}>
      {title && <p className={styles.title}>{title}</p>}
      <Link className={styles.link} to={linkTo}>
        {linkText}
        <ArrowRightIcon className={styles.linkIcon} />
      </Link>
    </div>
  )
}
