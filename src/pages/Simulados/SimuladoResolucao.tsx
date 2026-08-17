import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { QuestionPromptCard } from '../../components/cards/QuestionPromptCard'
import { AnswerOption } from '../../components/cards/AnswerOption'
import { QuestionProgressDots } from '../../components/ui/QuestionProgressDots'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, CheckCircleIcon } from '../../components/ui/icons'
import styles from './SimuladoResolucao.module.css'

import { getTentativa, postFinalizarTentativa, postResponderQuestaoSimulado } from '../../services/simulados'
import type { GetTentativaResponse } from '../../types/simulados'

const LETRAS_FALLBACK = ['A', 'B', 'C', 'D', 'E']

function formatarTempo(segundos: number) {
  const s = Math.max(0, Math.floor(segundos))
  const horas = Math.floor(s / 3600)
  const minutos = Math.floor((s % 3600) / 60)
  const resto = s % 60
  const partes = [horas, minutos, resto].map((valor) => String(valor).padStart(2, '0'))
  return horas > 0 ? partes.join(':') : `${partes[1]}:${partes[2]}`
}

export function SimuladoResolucao() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [dados, setDados] = useState<GetTentativaResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [tempoRestante, setTempoRestante] = useState<number | null>(null)
  const [confirmandoFinalizar, setConfirmandoFinalizar] = useState(false)
  const [finalizando, setFinalizando] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const finalizouRef = useRef(false)

  async function carregar() {
    if (!id) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getTentativa(id)

      if (resposta.status !== 'em_andamento') {
        navigate(`/simulados/tentativas/${id}/resultado`, { replace: true })
        return
      }

      setDados(resposta)
      setRespostas(
        Object.fromEntries(
          resposta.questoes.filter((questao) => questao.alternativa_marcada).map((questao) => [questao.id, questao.alternativa_marcada as string]),
        ),
      )
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

  useEffect(() => {
    if (!dados) return

    const deadline = new Date(dados.iniciado_em).getTime() + dados.tempo_limite_segundos * 1000

    function tick() {
      const restante = Math.round((deadline - Date.now()) / 1000)
      setTempoRestante(Math.max(0, restante))

      if (restante <= 0 && !finalizouRef.current) {
        finalizouRef.current = true
        handleFinalizar(true)
      }
    }

    tick()
    const intervalo = setInterval(tick, 1000)
    return () => clearInterval(intervalo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dados])

  const questao = dados?.questoes[currentIndex]
  const isLast = currentIndex === (dados?.questoes.length ?? 0) - 1
  const isFirst = currentIndex === 0
  const respondidasArray = dados?.questoes.map((item) => Boolean(respostas[item.id])) ?? []

  async function handleSelecionarAlternativa(alternativaId: string) {
    if (!dados || !questao || !id) return

    const anterior = respostas[questao.id]
    setRespostas((atual) => ({ ...atual, [questao.id]: alternativaId }))

    try {
      await postResponderQuestaoSimulado(id, { questao_id: questao.id, alternativa_id: alternativaId })
    } catch (err) {
      console.error(err)
      setRespostas((atual) => {
        const copia = { ...atual }
        if (anterior) copia[questao.id] = anterior
        else delete copia[questao.id]
        return copia
      })
      setToast({ type: 'error', message: 'Não foi possível salvar sua resposta. Tente novamente.' })
    }
  }

  async function handleFinalizar(automatico = false) {
    if (!id) return
    setFinalizando(true)

    try {
      await postFinalizarTentativa(id)
      navigate(`/simulados/tentativas/${id}/resultado`)
    } catch (err) {
      console.error(err)
      if (!automatico) setToast({ type: 'error', message: 'Não foi possível finalizar o simulado. Tente novamente.' })
      finalizouRef.current = false
    } finally {
      setFinalizando(false)
      setConfirmandoFinalizar(false)
    }
  }

  if (carregando) {
    return (
      <main className={styles.page}>
        <p>Carregando simulado...</p>
      </main>
    )
  }

  if (erro || !dados || !questao) {
    return (
      <main className={styles.page}>
        <p>Não foi possível carregar o simulado.</p>
        <Button fullWidth={false} onClick={carregar}>
          Tentar novamente
        </Button>
      </main>
    )
  }

  const tempoUrgente = tempoRestante !== null && tempoRestante <= 300

  return (
    <main className={styles.page}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className={styles.header}>
        <span className={styles.title}>{dados.simulado.nome}</span>

        <div className={styles.timer}>
          <ClockIcon className={`${styles.timerIcon}${tempoUrgente ? ` ${styles['timerIcon--urgent']}` : ''}`} />
          <span className={tempoUrgente ? styles['timerText--urgent'] : styles.timerText}>
            {tempoRestante !== null ? formatarTempo(tempoRestante) : '--:--'}
          </span>
        </div>
      </div>

      <div className={styles.progress}>
        <span className={styles.progressText}>
          Questão {currentIndex + 1}/{dados.questoes.length} · {Object.keys(respostas).length}/{dados.total_questoes} respondidas
        </span>
        <QuestionProgressDots
          total={dados.questoes.length}
          current={currentIndex}
          answered={respondidasArray}
          onSelect={setCurrentIndex}
        />
      </div>

      <QuestionPromptCard
        subject={questao.materia}
        subjectColor={questao.materia_cor ?? 'purple'}
        examInfo={`Questão ${questao.numero}`}
        question={questao.enunciado}
      />

      <div className={styles.options}>
        {questao.alternativas.map((alternativa, index) => (
          <AnswerOption
            key={alternativa.id}
            letter={alternativa.id.length === 1 ? alternativa.id.toUpperCase() : LETRAS_FALLBACK[index] ?? String(index + 1)}
            text={alternativa.texto}
            selected={respostas[questao.id] === alternativa.id}
            onSelect={() => handleSelecionarAlternativa(alternativa.id)}
          />
        ))}
      </div>

      <div className={styles.navRow}>
        <Button
          variant="outline"
          size="sm"
          fullWidth={false}
          icon={<ChevronLeftIcon />}
          iconPosition="left"
          disabled={isFirst}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
        >
          Anterior
        </Button>

        {isLast ? (
          <Button
            fullWidth={false}
            icon={<CheckCircleIcon />}
            iconPosition="left"
            onClick={() => setConfirmandoFinalizar(true)}
            disabled={finalizando}
          >
            Finalizar simulado
          </Button>
        ) : (
          <Button
            size="sm"
            fullWidth={false}
            icon={<ChevronRightIcon />}
            iconPosition="right"
            onClick={() => setCurrentIndex((prev) => Math.min(dados.questoes.length - 1, prev + 1))}
          >
            Próxima
          </Button>
        )}
      </div>

      <CardDiv>
        <button type="button" className={styles.finalizarLink} onClick={() => setConfirmandoFinalizar(true)} disabled={finalizando}>
          Finalizar simulado agora
        </button>
      </CardDiv>

      {confirmandoFinalizar && (
        <ConfirmDialog
          title="Finalizar simulado?"
          description={`Você respondeu ${Object.keys(respostas).length} de ${dados.total_questoes} questões. Depois de finalizar, não será possível alterar suas respostas.`}
          confirmLabel="Finalizar"
          confirmando={finalizando}
          onConfirm={() => handleFinalizar(false)}
          onClose={() => setConfirmandoFinalizar(false)}
        />
      )}
    </main>
  )
}
