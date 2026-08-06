import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdaSpinner } from '../../components/ui/AdaSpinner'
import { getRedacaoCorrecao } from '../../services/redacaoCorrecao'
import styles from './RedacaoProcessando.module.css'

const FRASES_PROCESSAMENTO = [
  'Analisando sua argumentação...',
  'Verificando a estrutura do texto...',
  'Conferindo sua introdução...',
  'Avaliando sua proposta de intervenção...',
  'Buscando possíveis repertórios...',
  'Comparando com redações nota 1000...',
  'Analisando coesão e coerência...',
  'Verificando competências do ENEM...',
  'Detectando oportunidades de melhoria...',
  'Calculando sua nota...',
  'Preparando feedback personalizado...',
  'Gerando recomendações...',
]

const INTERVALO_TROCA_FRASE_MS = 2500
const INTERVALO_POLLING_MS = 4000

export function RedacaoProcessando() {
  const { slug, envioId } = useParams<{ slug: string; envioId: string }>()
  const navigate = useNavigate()
  const [fraseIndex, setFraseIndex] = useState(0)
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setVisivel(false)

      const trocaTimeout = setTimeout(() => {
        setFraseIndex((atual) => (atual + 1) % FRASES_PROCESSAMENTO.length)
        setVisivel(true)
      }, 250)

      return () => clearTimeout(trocaTimeout)
    }, INTERVALO_TROCA_FRASE_MS)

    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    if (!slug || !envioId) {
      navigate('/redacao')
      return
    }

    let cancelado = false

    async function verificarCorrecao() {
      try {
        const resposta = await getRedacaoCorrecao(envioId!)

        if (cancelado) return

        if (resposta.status === 'concluida') {
          navigate(`/redacao/${slug}/resultado/${envioId}`)
        } else if (resposta.status === 'erro') {
          navigate(`/redacao/${slug}`)
        }
      } catch (err) {
        console.error(err)
      }
    }

    verificarCorrecao()
    const polling = setInterval(verificarCorrecao, INTERVALO_POLLING_MS)

    return () => {
      cancelado = true
      clearInterval(polling)
    }
  }, [slug, envioId, navigate])

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <AdaSpinner />

        <h1 className={styles.title}>A Ada está corrigindo sua redação</h1>
        <p className={styles.subtitle}>Isso pode levar alguns instantes.</p>

        <p className={`${styles.frase} ${visivel ? styles['frase--visivel'] : ''}`}>
          {FRASES_PROCESSAMENTO[fraseIndex]}
        </p>
      </div>
    </main>
  )
}
