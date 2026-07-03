import styles from './EmBrevePage.module.css'

type EmBrevePageProps = {
  titulo: string
}

export function EmBrevePage({ titulo }: EmBrevePageProps) {
  return (
    <main className={styles.page}>
      <h1>{titulo}</h1>
      <p>Essa área ainda está em construção. Em breve, novidade por aqui!</p>
    </main>
  )
}
