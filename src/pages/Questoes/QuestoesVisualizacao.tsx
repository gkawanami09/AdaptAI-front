import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { QuestionProgressDots } from '../../components/ui/QuestionProgressDots'
import { QuestionPromptCard } from '../../components/cards/QuestionPromptCard'
import { AnswerOption } from '../../components/cards/AnswerOption'
import { DicaCard } from '../../components/cards/DicaCard'
import { AskAiCard } from '../../components/cards/AskAiCard'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { AskAiMessage } from '../../components/cards/AskAiCard'
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightbulbIcon,
  SparklesIcon,
  FlagIcon,
} from '../../components/ui/icons'
import styles from './QuestoesVisualizacao.module.css'

import { getListaQuestoes, responderQuestao, favoritarQuestao, finalizarLista } from '../../services/questoesVisualizacao'
import type { GetListaQuestoesResponse } from '../../types/questoesVisualizacao'

const LETRAS = ['A', 'B', 'C', 'D', 'E']

function horaAtual() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function QuestoesVisualizacao() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const questaoAlvo = searchParams.get('questao')

  const [dados, setDados] = useState<GetListaQuestoesResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [dicaAberta, setDicaAberta] = useState(false)
  const [iaAberta, setIaAberta] = useState(false)
  const [iaMensagens, setIaMensagens] = useState<AskAiMessage[]>([])
  const [iaInput, setIaInput] = useState('')
  const [enviandoResposta, setEnviandoResposta] = useState(false)
  const [finalizando, setFinalizando] = useState(false)
  const [confirmandoFinalizacao, setConfirmandoFinalizacao] = useState(false)

  async function carregarLista() {
    if (!slug) return
    setCarregando(true)
    setErro(null)

    try {
      const resposta = await getListaQuestoes(slug)
      setDados(resposta)
      const indiceAlvo = questaoAlvo ? resposta.questoes.findIndex((item) => item.id === questaoAlvo) : -1
      setCurrentIndex(indiceAlvo >= 0 ? indiceAlvo : 0)
    } catch (err) {
      console.error(err)
      setErro(err instanceof Error ? err.message : 'Não foi possível carregar a lista de questões.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarLista()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => {
    setDicaAberta(false)
    setIaAberta(false)
    setIaMensagens([])
    setIaInput('')
  }, [currentIndex])

  const questao = dados?.questoes[currentIndex]
  const isLast = currentIndex === (dados?.questoes.length ?? 0) - 1
  const isFirst = currentIndex === 0
  const respondidas = dados?.questoes.map((item) => item.respondida) ?? []
  const flagged = dados?.questoes.map(() => false) ?? []

  function handleSelecionarOpcao(index: number) {
    if (!dados || !questao) return
    setDados({
      ...dados,
      questoes: dados.questoes.map((item, i) => (i === currentIndex ? { ...item, opcaoSelecionada: index } : item)),
    })
  }

  async function handleResponder() {
    if (!dados || !questao || !slug || questao.opcaoSelecionada === null) return
    setEnviandoResposta(true)

    try {
      const resultado = await responderQuestao(slug, questao.id, { opcao_selecionada: questao.opcaoSelecionada })

      setDados((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          questoes_concluidas: resultado.questoes_concluidas,
          progresso_percentual: resultado.progresso_percentual,
          questoes: prev.questoes.map((item, i) =>
            i === currentIndex
              ? { ...item, respondida: resultado.respondida, opcaoSelecionada: resultado.opcaoSelecionada, correta: resultado.correta }
              : item,
          ),
        }
      })

      if (!isLast) {
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (err) {
      console.error(err)
      setErro(err instanceof Error ? err.message : 'Não foi possível registrar a resposta.')
    } finally {
      setEnviandoResposta(false)
    }
  }

  async function handleFinalizarLista() {
    if (!slug) return
    setFinalizando(true)

    try {
      await finalizarLista(slug)
      navigate('/questoes')
    } catch (err) {
      console.error(err)
      setErro(err instanceof Error ? err.message : 'Não foi possível finalizar a lista.')
    } finally {
      setFinalizando(false)
    }
  }

  function handleConfirmarFinalizacao() {
    setConfirmandoFinalizacao(false)
    handleFinalizarLista()
  }

  function handleAnterior() {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  function handleProxima() {
    setCurrentIndex((prev) => Math.min((dados?.questoes.length ?? 1) - 1, prev + 1))
  }

  function handleSelecionarQuestao(index: number) {
    setCurrentIndex(index)
  }

  async function handleToggleFavorito() {
    if (!dados || !questao) return
    const favoritaAnterior = questao.favorita

    setDados({
      ...dados,
      questoes: dados.questoes.map((item, i) => (i === currentIndex ? { ...item, favorita: !favoritaAnterior } : item)),
    })

    try {
      await favoritarQuestao(questao.id)
    } catch (err) {
      console.error(err)
      setDados((prev) =>
        prev
          ? { ...prev, questoes: prev.questoes.map((item, i) => (i === currentIndex ? { ...item, favorita: favoritaAnterior } : item)) }
          : prev,
      )
    }
  }

  function handlePedirDica() {
    setDicaAberta((prev) => !prev)
    setIaAberta(false)
  }

  function handleExplicarComIA() {
    if (!questao) return
    setIaAberta((prev) => {
      const abrindo = !prev
      if (abrindo && iaMensagens.length === 0) {
        setIaMensagens([
          {
            sender: 'ada',
            text: `Vamos analisar juntos! Sobre "${questao.subject}": me diga qual parte da questão está te deixando em dúvida que eu explico com mais detalhes.`,
            time: horaAtual(),
          },
        ])
      }
      return abrindo
    })
    setDicaAberta(false)
  }

  function handleEnviarPerguntaIA() {
    if (!iaInput.trim()) return
    const pergunta = iaInput
    setIaMensagens((prev) => [
      ...prev,
      { sender: 'user', text: pergunta, time: horaAtual() },
      {
        sender: 'ada',
        text: 'Ótima pergunta! Ainda não tenho acesso a explicações personalizadas aqui, mas em breve vou conseguir te responder isso com detalhes. Por enquanto, tenta revisar a dica da questão!',
        time: horaAtual(),
      },
    ])
    setIaInput('')
  }

  if (carregando) {
    return (
      <main className={styles.page}>
        <p>Carregando questões...</p>
      </main>
    )
  }

  if (erro || !dados || !questao) {
    return (
      <main className={styles.page}>
        <p>{erro ?? 'Não foi possível carregar a lista de questões.'}</p>
        <Button fullWidth={false} onClick={carregarLista}>
          Tentar novamente
        </Button>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Link to="/questoes" className={styles.backLink}>
          <ArrowLeftIcon className={styles.backIcon} />
          Banco de Questões
        </Link>

        <div className={styles.progress}>
          <span className={styles.progressText}>
            Questão {currentIndex + 1}/{dados.questoes.length}
          </span>
          <QuestionProgressDots
            total={dados.questoes.length}
            current={currentIndex}
            answered={respondidas}
            flagged={flagged}
            onSelect={handleSelecionarQuestao}
          />
          <button
            type="button"
            className={`${styles.flagButton}${questao.favorita ? ` ${styles['flagButton--active']}` : ''}`}
            onClick={handleToggleFavorito}
            aria-pressed={questao.favorita}
            aria-label={questao.favorita ? 'Remover dos favoritos' : 'Marcar como favorita'}
          >
            <FlagIcon />
          </button>
        </div>
      </div>

      <QuestionPromptCard
        subject={questao.subject}
        subjectColor={questao.subjectColor}
        examInfo={questao.examInfo}
        question={questao.question}
      />

      <div className={styles.options}>
        {questao.options.map((option, index) => (
          <AnswerOption
            key={index}
            letter={LETRAS[index]}
            text={option}
            selected={questao.opcaoSelecionada === index}
            onSelect={() => handleSelecionarOpcao(index)}
          />
        ))}
      </div>

      <div className={styles.actions}>
        <Button
          fullWidth={false}
          className={styles.answerButton}
          disabled={questao.opcaoSelecionada === null || enviandoResposta || finalizando}
          onClick={handleResponder}
        >
          {enviandoResposta ? 'Enviando...' : 'Responder'}
        </Button>
        <Button variant="outline" icon={<LightbulbIcon />} iconPosition="left" fullWidth={false} onClick={handlePedirDica}>
          Pedir dica
        </Button>
        <Button variant="outline" icon={<SparklesIcon />} iconPosition="left" fullWidth={false} onClick={handleExplicarComIA}>
          Explicar com IA
        </Button>
        <Button
          variant="outline"
          fullWidth={false}
          disabled={finalizando}
          onClick={() => setConfirmandoFinalizacao(true)}
        >
          Finalizar lista
        </Button>
      </div>

      {dicaAberta && <DicaCard title="Dica" message={questao.hint} />}

      {iaAberta && (
        <AskAiCard
          messages={iaMensagens}
          value={iaInput}
          onChange={setIaInput}
          onSend={handleEnviarPerguntaIA}
          onClose={() => setIaAberta(false)}
        />
      )}

      <div className={styles.navRow}>
        <Button
          variant="outline"
          size="sm"
          fullWidth={false}
          icon={<ChevronLeftIcon />}
          iconPosition="left"
          disabled={isFirst}
          onClick={handleAnterior}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          fullWidth={false}
          icon={<ChevronRightIcon />}
          iconPosition="right"
          disabled={isLast}
          onClick={handleProxima}
        >
          Próxima
        </Button>
      </div>

      {confirmandoFinalizacao && (
        <ConfirmDialog
          title="Finalizar lista de questões"
          description="Tem certeza que deseja finalizar? Após finalizar você não poderá alterar as respostas dessa lista."
          confirmLabel="Finalizar"
          confirmando={finalizando}
          onConfirm={handleConfirmarFinalizacao}
          onClose={() => setConfirmandoFinalizacao(false)}
        />
      )}
    </main>
  )
}
