import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardIcon } from '../../components/cards/CardIcon'
import { Badge } from '../../components/ui/Badge'
import { ArrowLeftIcon, ClockIcon, TargetIcon, PlayIcon } from '../../components/ui/icons'
import styles from './SimuladoDetalhe.module.css'

import { getSimulados, postIniciarTentativa } from '../../services/simulados'
import type { SimuladoCatalogoItem } from '../../types/simulados'

export function SimuladoDetalhe() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [simulado, setSimulado] = useState<SimuladoCatalogoItem | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [iniciando, setIniciando] = useState(false)

  async function carregar() {
    if (!slug) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getSimulados()
      const encontrado = resposta.catalogo.find((item) => item.slug === slug)
      if (!encontrado) throw new Error('Simulado não encontrado.')
      setSimulado(encontrado)
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
  }, [slug])

  async function handleIniciar() {
    if (!slug) return
    setIniciando(true)

    try {
      const tentativa = await postIniciarTentativa(slug)
      navigate(`/simulados/tentativas/${tentativa.id}`)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setIniciando(false)
    }
  }

  return (
    <main className={styles.page}>
      <Link to="/simulados" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        Simulados
      </Link>

      {carregando ? (
        <CardDiv>
          <p>Carregando simulado...</p>
        </CardDiv>
      ) : erro || !simulado ? (
        <CardDiv>
          <p>Não foi possível carregar este simulado.</p>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </CardDiv>
      ) : (
        <>
          <TitlePage title={simulado.titulo} subtitle={simulado.descricao} />

          <CardDiv>
            <div className={styles.infoRow}>
              <CardIcon color={simulado.icone_cor}>
                <TargetIcon />
              </CardIcon>

              <div className={styles.infoContent}>
                <div className={styles.badges}>
                  <Badge color={simulado.tag_cor}>{simulado.tag}</Badge>
                  <span className={styles.duration}>
                    <ClockIcon className={styles.durationIcon} />
                    {simulado.duracao}
                  </span>
                </div>

                {(simulado.total_questoes !== undefined || simulado.materias) && (
                  <div className={styles.details}>
                    {simulado.total_questoes !== undefined && <span>{simulado.total_questoes} questões</span>}
                    {simulado.materias && simulado.materias.length > 0 && <span>{simulado.materias.join(' · ')}</span>}
                  </div>
                )}
              </div>
            </div>

            <p className={styles.notice}>
              O cronômetro começa a contar assim que você iniciar e é controlado pelo servidor — o simulado é finalizado
              automaticamente ao atingir o tempo limite. Você pode refazer este simulado quantas vezes quiser: cada tentativa
              fica salva no seu histórico.
            </p>

            <Button icon={<PlayIcon />} iconPosition="left" onClick={handleIniciar} disabled={iniciando}>
              {iniciando ? 'Iniciando...' : 'Iniciar simulado'}
            </Button>
          </CardDiv>
        </>
      )}
    </main>
  )
}
