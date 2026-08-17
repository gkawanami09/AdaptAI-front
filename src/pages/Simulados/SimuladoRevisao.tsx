import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { QuestionReviewCard } from '../../components/cards/QuestionReviewCard'
import { ArrowLeftIcon } from '../../components/ui/icons'
import styles from './SimuladoRevisao.module.css'

import { getRevisaoTentativa } from '../../services/simulados'
import type { GetRevisaoTentativaResponse } from '../../types/simulados'

type FiltroStatus = 'todas' | 'acertadas' | 'erradas' | 'nao_respondidas'

const STATUS_OPTIONS: { value: FiltroStatus; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'acertadas', label: 'Acertadas' },
  { value: 'erradas', label: 'Erradas' },
  { value: 'nao_respondidas', label: 'Não respondidas' },
]

export function SimuladoRevisao() {
  const { id } = useParams<{ id: string }>()

  const [dados, setDados] = useState<GetRevisaoTentativaResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [status, setStatus] = useState<FiltroStatus>('todas')

  async function carregar() {
    if (!id) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getRevisaoTentativa(id)
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const questoesFiltradas = useMemo(() => {
    if (!dados) return []
    if (status === 'todas') return dados.questoes
    if (status === 'acertadas') return dados.questoes.filter((questao) => questao.acertou)
    if (status === 'erradas') return dados.questoes.filter((questao) => !questao.acertou && questao.alternativa_marcada)
    return dados.questoes.filter((questao) => !questao.alternativa_marcada)
  }, [dados, status])

  return (
    <main className={styles.page}>
      <Link to="/simulados" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        Simulados
      </Link>

      <TitlePage title="Revisão do simulado" subtitle="Confira suas respostas e as alternativas corretas." />

      {carregando ? (
        <CardDiv>
          <p>Carregando revisão...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p>Não foi possível carregar a revisão.</p>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </CardDiv>
      ) : (
        <>
          <SegmentedControl options={STATUS_OPTIONS} value={status} onChange={(value) => setStatus(value as FiltroStatus)} />

          {questoesFiltradas.length === 0 ? (
            <CardDiv>
              <p>Nenhuma questão encontrada para esse filtro.</p>
            </CardDiv>
          ) : (
            <div className={styles.questions}>
              {questoesFiltradas.map((questao) => (
                <QuestionReviewCard
                  key={questao.questao_id}
                  numero={questao.numero}
                  enunciado={questao.enunciado}
                  materia={questao.materia}
                  alternativas={questao.alternativas.map((alternativa) => ({
                    letra: alternativa.id.length === 1 ? alternativa.id.toUpperCase() : alternativa.id,
                    texto: alternativa.texto,
                  }))}
                  respostaAluno={questao.alternativa_marcada ? questao.alternativa_marcada.toUpperCase() : null}
                  respostaCorreta={questao.alternativa_correta.toUpperCase()}
                  acertou={questao.acertou}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
