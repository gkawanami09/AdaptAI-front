import { useNavigate, useParams } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { ScoreHeaderCard } from '../../components/cards/ScoreHeaderCard'
import { InsightCard } from '../../components/cards/InsightCard'
import { CompetenciaScoreCard } from '../../components/cards/CompetenciaScoreCard'
import { RepertorioSugeridoCard } from '../../components/cards/RepertorioSugeridoCard'
import styles from './RedacaoResultado.module.css'

import { useRedacaoCorrecao } from '../../hooks/useRedacaoCorrecao'

export function RedacaoResultado() {
  const { slug, envioId } = useParams<{ slug: string; envioId: string }>()
  const navigate = useNavigate()
  const { dados, carregando, erro, recarregar } = useRedacaoCorrecao(envioId)

  if (carregando) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Carregando resultado...</p>
        </CardDiv>
      </main>
    )
  }

  if (erro || !dados) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Não foi possível carregar o resultado da correção.</p>
          <div className={styles.actions}>
            <Button fullWidth={false} onClick={recarregar}>
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
      <TitlePage title="Correção da redação" subtitle="Aqui está a análise completa feita pela Ada" />

      <div className={styles.section}>
        <ScoreHeaderCard
          notaTotal={dados.notaTotal}
          notaMaxima={dados.notaMaxima}
          competencias={dados.competencias}
          statusLabel={dados.statusLabel}
          mensagemMotivacional={dados.mensagemMotivacional}
        />
      </div>

      {dados.insights.length > 0 && (
        <div className={styles.section}>
          <CardHeading>Principais insights</CardHeading>
          <div className={styles.gridInsights}>
            {dados.insights.map((insight) => (
              <InsightCard
                key={insight.id}
                icon={insight.icon}
                iconColor={insight.iconColor}
                title={insight.title}
                description={insight.description}
              />
            ))}
          </div>
        </div>
      )}

      {dados.pontosMelhoria.length > 0 && (
        <div className={styles.section}>
          <CardHeading>Pontos de melhoria</CardHeading>
          <div className={styles.gridInsights}>
            {dados.pontosMelhoria.map((ponto) => (
              <InsightCard
                key={ponto.id}
                icon={ponto.icon}
                iconColor={ponto.iconColor}
                title={ponto.title}
                description={ponto.description}
              />
            ))}
          </div>
        </div>
      )}

      {dados.repertoriosSugeridos.length > 0 && (
        <div className={styles.section}>
          <CardHeading>Repertórios sugeridos</CardHeading>
          <div className={styles.gridRepertorios}>
            {dados.repertoriosSugeridos.map((repertorio) => (
              <RepertorioSugeridoCard key={repertorio.id} nome={repertorio.nome} descricao={repertorio.descricao} />
            ))}
          </div>
        </div>
      )}

      {dados.competencias.length > 0 && (
        <div className={styles.section}>
          <CardHeading>Competências</CardHeading>
          <div className={styles.gridCompetencias}>
            {dados.competencias.map((competencia) => (
              <CompetenciaScoreCard
                key={competencia.number}
                number={competencia.number}
                title={competencia.title}
                description={competencia.description}
                nota={competencia.nota}
                notaMaxima={competencia.notaMaxima}
                color={competencia.color}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <CardDiv>
          <CardHeading>Resumo da Ada</CardHeading>
          <p className={styles.resumo}>{dados.resumoAda}</p>
        </CardDiv>
      </div>

      <div className={styles.finalActions}>
        <Button fullWidth={false} onClick={() => navigate(`/redacao/${slug}`)}>
          Nova redação
        </Button>
        <Button fullWidth={false} variant="outline" onClick={() => navigate('/redacao')}>
          Voltar para os temas
        </Button>
      </div>
    </main>
  )
}
