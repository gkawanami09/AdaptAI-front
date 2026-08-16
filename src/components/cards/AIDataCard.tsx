import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Switch } from '../ui/Switch'
import { Button } from '../ui/Button'
import { LightbulbIcon } from '../ui/icons'
import type { DadoIA, InsightIA } from '../../types/configuracoesAluno'
import styles from './AIDataCard.module.css'

type AIDataCardProps = {
  dados: DadoIA[]
  insights: InsightIA[]
  carregando: boolean
  erro: boolean
  onToggleDado: (id: string, utilizado: boolean) => void
  onTentarNovamente: () => void
}

export function AIDataCard({ dados, insights, carregando, erro, onToggleDado, onTentarNovamente }: AIDataCardProps) {
  if (carregando) {
    return (
      <CardDiv>
        <CardHeading>Dados utilizados pela Ada</CardHeading>
        <p className={styles.helperText}>Carregando dados da IA...</p>
      </CardDiv>
    )
  }

  if (erro) {
    return (
      <CardDiv>
        <CardHeading>Dados utilizados pela Ada</CardHeading>
        <p className={styles.helperText}>Não foi possível carregar os dados utilizados pela IA.</p>
        <Button fullWidth={false} size="sm" onClick={onTentarNovamente}>
          Tentar novamente
        </Button>
      </CardDiv>
    )
  }

  return (
    <>
      <CardDiv>
        <CardHeading>Dados utilizados pela Ada</CardHeading>
        <p className={styles.helperText}>
          A IA utiliza seus dados de estudo para entender seu desempenho e personalizar suas recomendações.
        </p>

        {dados.length === 0 ? (
          <p className={styles.helperText}>Nenhum dado sendo utilizado no momento.</p>
        ) : (
          <div className={styles.list}>
            {dados.map((dado) => (
              <div key={dado.id} className={styles.row}>
                <div className={styles.info}>
                  <span className={styles.label}>{dado.nome}</span>
                  <span className={styles.description}>{dado.descricao}</span>
                </div>
                <Switch checked={dado.utilizado} onChange={(checked) => onToggleDado(dado.id, checked)} label={dado.nome} />
              </div>
            ))}
          </div>
        )}
      </CardDiv>

      <CardDiv>
        <CardHeading>Insights identificados pela IA</CardHeading>

        {insights.length === 0 ? (
          <p className={styles.helperText}>Ainda não há insights suficientes sobre o seu aprendizado.</p>
        ) : (
          <div className={styles.insightList}>
            {insights.map((insight) => (
              <div key={insight.id} className={styles.insightRow}>
                <span className={styles.insightIcon}>
                  <LightbulbIcon />
                </span>
                <div className={styles.info}>
                  <span className={styles.label}>{insight.titulo}</span>
                  <span className={styles.description}>{insight.descricao}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardDiv>
    </>
  )
}
