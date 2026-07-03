import './Loading.css'

type LoadingProps = {
  text?: string
  fullScreen?: boolean
}

export function Loading({ text = 'Carregando...', fullScreen }: LoadingProps) {
  const classes = ['loading', fullScreen && 'loading--full-screen'].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <span className="loading__spinner" aria-hidden="true" />
      <p className="loading__text">{text}</p>
    </div>
  )
}
