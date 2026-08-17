import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { SimuladoCard } from '../../components/cards/SimuladoCard'
import { HistoricoCard } from '../../components/cards/HistoricoCard'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { TargetIcon, ClockIcon, BarChartIcon } from '../../components/ui/icons'
import styles from './Simulados.module.css'

import { getSimulados } from '../../services/simulados'
import type { GetSimuladosResponse } from '../../types/simulados'

export function Simulados() {
  const navigate = useNavigate()
  const [dados, setDados] = useState<GetSimuladosResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarSimulados() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getSimulados()
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarSimulados()
  }, [])

  return (
    <main className={styles.page}>
      <TitlePage title="Simulados" subtitle="Treine como se fosse o dia da prova" />

      {carregando ? (
        <CardDiv>
          <p>Carregando simulados...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p>Não foi possível carregar os simulados.</p>
          <Button fullWidth={false} onClick={carregarSimulados}>
            Tentar novamente
          </Button>
        </CardDiv>
      ) : (
        <>
          <div className={styles.summaryRow}>
            <StatHighlightCard
              icon={<TargetIcon />}
              iconColor="purple"
              value={String(dados.resumo.nota_estimada)}
              label="Nota estimada"
            />
            <StatHighlightCard icon={<ClockIcon />} iconColor="blue" value={dados.resumo.tempo_medio} label="Tempo médio" />
            <StatHighlightCard
              icon={<BarChartIcon />}
              iconColor="green"
              value={`${dados.resumo.taxa_acerto_percentual}%`}
              label="Taxa de acerto"
            />
          </div>

          {dados.catalogo.length === 0 ? (
            <CardDiv>
              <p>Nenhum simulado disponível.</p>
            </CardDiv>
          ) : (
            <div className={styles.grid}>
              {dados.catalogo.map((simulado) => (
                <SimuladoCard
                  key={simulado.slug}
                  icon={simulado.icone}
                  iconColor={simulado.icone_cor}
                  title={simulado.titulo}
                  description={simulado.descricao}
                  tag={simulado.tag}
                  tagColor={simulado.tag_cor}
                  duration={simulado.duracao}
                  onClick={() => navigate(`/simulados/${simulado.slug}`)}
                />
              ))}
            </div>
          )}

          <div className={styles.historico}>
            <HistoricoCard
              title="Histórico de simulados"
              items={dados.historico.map((item) => ({
                day: item.dia,
                title: item.titulo,
                tempo: item.tempo,
                score: item.nota,
                acertos: item.acertos_percentual,
                onClick: () => navigate(`/simulados/tentativas/${item.id}/resultado`),
              }))}
            />
          </div>
        </>
      )}
    </main>
  )
}
