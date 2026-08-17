import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { SubjectProgressList } from '../../components/graph/SubjectProgressList'
import type { SubjectProgressDatum } from '../../components/graph/SubjectProgressList'
import type { ProgressBarColor } from '../../components/ui/ProgressBar'
import { ArrowLeftIcon, TargetIcon, ClockIcon, CheckCircleIcon, EyeIcon, RefreshIcon } from '../../components/ui/icons'
import styles from './SimuladoResultado.module.css'

import { getResultadoTentativa, postIniciarTentativa } from '../../services/simulados'
import type { GetResultadoTentativaResponse } from '../../types/simulados'

const CORES_PROGRESSO: ProgressBarColor[] = ['purple', 'teal', 'gold', 'blue', 'green', 'orange', 'red']

function formatarTempo(segundos: number) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  if (horas > 0) return `${horas}h${minutos > 0 ? `${minutos}min` : ''}`
  return `${minutos} min`
}

export function SimuladoResultado() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [dados, setDados] = useState<GetResultadoTentativaResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [refazendo, setRefazendo] = useState(false)

  async function carregar() {
    if (!id) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getResultadoTentativa(id)
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

  async function handleRefazer() {
    if (!dados) return
    setRefazendo(true)

    try {
      const tentativa = await postIniciarTentativa(dados.simulado.slug)
      navigate(`/simulados/tentativas/${tentativa.id}`)
    } catch (err) {
      console.error(err)
      setRefazendo(false)
    }
  }

  const desempenho: SubjectProgressDatum[] =
    dados?.desempenho_materias.map((item, index) => ({
      label: item.materia,
      value: Math.round(item.percentual_acerto),
      color: CORES_PROGRESSO[index % CORES_PROGRESSO.length],
    })) ?? []

  return (
    <main className={styles.page}>
      <Link to="/simulados" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        Simulados
      </Link>

      {carregando ? (
        <CardDiv>
          <p>Carregando resultado...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p>Não foi possível carregar o resultado. Se o simulado ainda estiver em andamento, finalize-o antes de ver o resultado.</p>
          <div className={styles.errorActions}>
            <Button fullWidth={false} onClick={carregar}>
              Tentar novamente
            </Button>
            {id && (
              <Link to={`/simulados/tentativas/${id}`}>
                <Button variant="outline" fullWidth={false}>
                  Voltar ao simulado
                </Button>
              </Link>
            )}
          </div>
        </CardDiv>
      ) : (
        <>
          <TitlePage title={dados.simulado.nome} subtitle="Resultado do simulado" />

          <div className={styles.summaryRow}>
            <StatHighlightCard icon={<TargetIcon />} iconColor="purple" value={`${Math.round(dados.percentual_acerto)}%`} label="Percentual de acerto" />
            <StatHighlightCard icon={<CheckCircleIcon />} iconColor="green" value={`${dados.acertos}/${dados.total_questoes}`} label="Acertos" />
            <StatHighlightCard icon={<ClockIcon />} iconColor="blue" value={formatarTempo(dados.tempo_gasto_segundos)} label="Tempo gasto" />
          </div>

          <CardDiv>
            <div className={styles.breakdown}>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownValue}>{dados.acertos}</span>
                <span className={styles.breakdownLabel}>Acertos</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownValue}>{dados.erros}</span>
                <span className={styles.breakdownLabel}>Erros</span>
              </div>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownValue}>{dados.nao_respondidas}</span>
                <span className={styles.breakdownLabel}>Não respondidas</span>
              </div>
            </div>
          </CardDiv>

          {desempenho.length > 0 && <SubjectProgressList title="Desempenho por matéria" data={desempenho} />}

          <div className={styles.actions}>
            <Link to={`/simulados/tentativas/${dados.id}/revisao`}>
              <Button variant="outline" fullWidth={false} icon={<EyeIcon />} iconPosition="left">
                Revisar questões
              </Button>
            </Link>
            <Button fullWidth={false} icon={<RefreshIcon />} iconPosition="left" onClick={handleRefazer} disabled={refazendo}>
              {refazendo ? 'Iniciando...' : 'Refazer simulado'}
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
