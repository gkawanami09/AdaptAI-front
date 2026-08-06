import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { ThemeCard } from '../../components/cards/ThemeCard'
import { WritingCard } from '../../components/cards/WritingCard'
import { CompetenciasCard } from '../../components/cards/CompetenciasCard'
import { RepertorioCard } from '../../components/cards/RepertorioCard'
import { DicaCard } from '../../components/cards/DicaCard'
import styles from './Redacao.module.css'

import { getRedacaoTema } from '../../services/redacaoTemas'
import { enviarRedacao } from '../../services/redacao'
import type { GetRedacaoTemaResponse } from '../../types/redacaoTemas'

export function Redacao() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [tema, setTema] = useState<GetRedacaoTemaResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  const carregarTema = useCallback(async () => {
    if (!slug) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getRedacaoTema(slug)
      setTema(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }, [slug])

  useEffect(() => {
    carregarTema()
  }, [carregarTema])

  async function handleEnviar() {
    if (!slug) return
    setEnviando(true)

    try {
      const envio = await enviarRedacao(slug, texto)
      // A IA de correção ainda não roda de forma síncrona aqui — a tela de
      // processamento (RedacaoProcessando) é quem acompanha o andamento via
      // polling/websocket usando o id do envio retornado pelo backend.
      navigate(`/redacao/${slug}/processando/${envio.id}`)
    } catch (err) {
      console.error(err)
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Carregando tema...</p>
        </CardDiv>
      </main>
    )
  }

  if (erro || !tema) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Não foi possível carregar o tema.</p>
          <div className={styles.actions}>
            <Button fullWidth={false} onClick={carregarTema}>
              Tentar novamente
            </Button>
            <Button fullWidth={false} variant="outline" onClick={() => navigate('/redacao')}>
              Voltar para os temas
            </Button>
          </div>
        </CardDiv>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <TitlePage title="Treino de Redação" subtitle="Escreve, envie e receba correção da IA" />

      <div className={styles.contentRow}>
        <div className={styles.mainColumn}>
          <ThemeCard tag={tema.tag} tagColor={tema.tag_cor} title={tema.titulo} description={tema.descricao} />

          <div className={styles.writing}>
            <WritingCard value={texto} onChange={setTexto} minWords={100} onSubmit={handleEnviar} />
            {enviando && <p className={styles.sendingHint}>Enviando redação...</p>}
          </div>
        </div>

        <div className={styles.sideColumn}>
          <CompetenciasCard title="5 Competências ENEM" items={tema.competencias} />
          <RepertorioCard title="Banco de repertórios" items={tema.repertorios} />
          {tema.dica_ada && <DicaCard title="Dica da Ada" message={tema.dica_ada} />}
        </div>
      </div>
    </main>
  )
}
