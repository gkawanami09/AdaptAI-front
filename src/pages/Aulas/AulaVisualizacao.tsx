import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { VideoPlayer } from '../../components/ui/VideoPlayer'
import { CardDiv } from '../../components/cards/CardDiv'
import { LessonSummaryCard, LessonParagraph } from '../../components/cards/LessonSummaryCard'
import { LessonConceptsCard } from '../../components/cards/LessonConceptsCard'
import { ModuleLessonsCard } from '../../components/cards/ModuleLessonsCard'
import { NextLessonCard } from '../../components/cards/NextLessonCard'
import { DicaCard } from '../../components/cards/DicaCard'
import { ArrowLeftIcon, ClockIcon, CheckCircleIcon, BookIcon, BarChartIcon } from '../../components/ui/icons'
import styles from './AulaVisualizacao.module.css'

import { getAula, marcarAulaConcluida, atualizarProgressoAula, marcarConceito } from '../../services/aulaVisualizacao'
import type { GetAulaVisualizacaoResponse } from '../../types/aulaVisualizacao'

export function AulaVisualizacao() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [aula, setAula] = useState<GetAulaVisualizacaoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const carregarAula = useCallback(async () => {
    if (!slug) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getAula(slug)
      setAula(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }, [slug])

  useEffect(() => {
    carregarAula()
  }, [carregarAula])

  async function handleToggleConceito(conceitoId: string, concluido: boolean) {
    if (!slug || !aula) return

    setAula((prev) =>
      prev
        ? {
            ...prev,
            conceitos: prev.conceitos.map((item) => (item.id === conceitoId ? { ...item, concluido } : item)),
          }
        : prev,
    )

    try {
      await marcarConceito(slug, conceitoId, concluido)
    } catch (err) {
      console.error(err)
      setAula((prev) =>
        prev
          ? {
              ...prev,
              conceitos: prev.conceitos.map((item) => (item.id === conceitoId ? { ...item, concluido: !concluido } : item)),
            }
          : prev,
      )
    }
  }

  async function handleMarcarConcluido() {
    if (!slug) return
    try {
      const atualizada = await marcarAulaConcluida(slug)
      if (atualizada.proxima_aula) {
        navigate(`/aulas/${atualizada.proxima_aula.slug}`)
      } else {
        navigate('/aulas')
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleFazerQuestoes() {
    if (!slug) return
    navigate(`/questoes?origem=aula&slug=${slug}`)
  }

  function handleProgressoVideo(progresso: number) {
    if (!slug) return
    atualizarProgressoAula(slug, progresso).catch((err) => console.error(err))
  }

  if (carregando) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Carregando aula...</p>
        </CardDiv>
      </main>
    )
  }

  if (erro || !aula) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Não foi possível carregar a aula.</p>
          <div className={styles.actions}>
            <Button fullWidth={false} onClick={carregarAula}>
              Tentar novamente
            </Button>
          </div>
        </CardDiv>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/aulas" className={styles.backLink}>
          <ArrowLeftIcon className={styles.backIcon} />
          Aulas
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{aula.titulo}</span>
      </div>

      <div className={styles.meta}>
        <Badge color={aula.materia_cor}>{aula.materia}</Badge>
        <span className={styles.metaText}>
          <ClockIcon className={styles.metaIcon} />
          {aula.duracao_min} min · {aula.dificuldade}
        </span>
      </div>

      <h1 className={styles.title}>{aula.titulo}</h1>

      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          {aula.video_url && (
            <VideoPlayer src={aula.video_url} initialProgress={aula.progresso} onProgressChange={handleProgressoVideo} />
          )}

          {aula.resumo.length > 0 && (
            <LessonSummaryCard title="Resumo da aula">
              {aula.resumo.map((paragrafo, index) => (
                <LessonParagraph key={index}>{paragrafo}</LessonParagraph>
              ))}
            </LessonSummaryCard>
          )}

          <LessonConceptsCard
            title="Conceitos desta aula"
            items={aula.conceitos.map((item) => ({ id: item.id, label: item.label, checked: item.concluido }))}
            onToggle={handleToggleConceito}
          />

          <div className={styles.actions}>
            <Button icon={<CheckCircleIcon />} iconPosition="left" fullWidth={false} onClick={handleMarcarConcluido}>
              Marcar como concluído
            </Button>
            <Button
              variant="outline"
              icon={<BookIcon />}
              iconPosition="left"
              fullWidth={false}
              onClick={handleFazerQuestoes}
            >
              Fazer questões
            </Button>
          </div>
        </div>

        <div className={styles.sideColumn}>
          {aula.modulo && (
            <ModuleLessonsCard
              title={`Módulo: ${aula.modulo.titulo}`}
              lessons={aula.modulo.aulas.map((item) => ({ order: item.ordem, label: item.titulo, status: item.status }))}
            />
          )}

          {aula.proxima_aula && (
            <NextLessonCard
              title="Próxima aula"
              icon={<BarChartIcon />}
              iconColor="blue"
              lessonTitle={aula.proxima_aula.titulo}
              duration={`${aula.proxima_aula.duracao_min} min`}
              difficulty={aula.proxima_aula.dificuldade}
            />
          )}

          {aula.dica_ada && <DicaCard icon="🤖" title="Dica da Ada" message={aula.dica_ada} />}
        </div>
      </div>
    </main>
  )
}
