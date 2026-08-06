import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { TemaRedacaoCard } from '../../components/cards/TemaRedacaoCard'
import styles from './RedacaoTemas.module.css'

import { getRedacaoTemas } from '../../services/redacaoTemas'
import type { GetRedacaoTemasResponse } from '../../types/redacaoTemas'

export function RedacaoTemas() {
  const navigate = useNavigate()
  const [dados, setDados] = useState<GetRedacaoTemasResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarTemas() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getRedacaoTemas()
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarTemas()
  }, [])

  return (
    <main className={styles.page}>
      <TitlePage title="Treino de Redação" subtitle="Escolha um tema para começar a escrever" />

      {carregando ? (
        <CardDiv>
          <p className={styles.emptyState}>Carregando temas...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p className={styles.emptyState}>Não foi possível carregar os temas.</p>
          <div className={styles.retryRow}>
            <Button fullWidth={false} onClick={carregarTemas}>
              Tentar novamente
            </Button>
          </div>
        </CardDiv>
      ) : dados.temas.length === 0 ? (
        <CardDiv>
          <p className={styles.emptyState}>Nenhum tema de redação disponível no momento.</p>
        </CardDiv>
      ) : (
        <div className={styles.grid}>
          {dados.temas.map((tema) => (
            <TemaRedacaoCard
              key={tema.id}
              tag={tema.tag}
              tagColor={tema.tag_cor}
              title={tema.titulo}
              description={tema.descricao}
              onClick={() => navigate(`/redacao/${tema.slug}`)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
