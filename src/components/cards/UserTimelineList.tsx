import type { TimelineEvento } from '../../types/usuarios'
import styles from './UserTimelineList.module.css'

type UserTimelineListProps = {
  eventos: TimelineEvento[]
}

export function UserTimelineList({ eventos }: UserTimelineListProps) {
  return (
    <div className={styles.timeline}>
      {eventos.map((evento, index) => (
        <div className={styles.item} key={evento.id}>
          <div className={styles.railColumn}>
            <span className={styles.dot} />
            {index < eventos.length - 1 && <span className={styles.line} />}
          </div>
          <div className={styles.info}>
            <span className={styles.titulo}>{evento.titulo}</span>
            <span className={styles.descricao}>{evento.descricao}</span>
            <span className={styles.data}>{evento.data}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
