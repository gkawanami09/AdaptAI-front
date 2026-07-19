import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { QuestionProgressDots } from '../../components/ui/QuestionProgressDots'
import { QuestionPromptCard } from '../../components/cards/QuestionPromptCard'
import { AnswerOption } from '../../components/cards/AnswerOption'
import { DicaCard } from '../../components/cards/DicaCard'
import { AskAiCard } from '../../components/cards/AskAiCard'
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

// TODO: substituir pelos dados reais vindos do backend (banco de questões)
const QUESTOES = [
  {
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    examInfo: 'ENEM 2020 · Fácil',
    question: 'Resolva a equação do 2º grau x² - 7x + 12 = 0 e identifique suas raízes.',
    options: [
      'As raízes são x = 3 e x = 4.',
      'As raízes são x = 2 e x = 6.',
      'A equação não possui raízes reais.',
      'As raízes são x = -3 e x = -4.',
      'A raiz é única: x = 7.',
    ],
    hint: 'Use a Fórmula de Bhaskara com a = 1, b = -7 e c = 12. O discriminante Δ = b² - 4ac vai te dar duas raízes reais.',
  },
  {
    subject: 'Biologia',
    subjectColor: 'green' as const,
    examInfo: 'ENEM 2019 · Médio',
    question: 'Sobre a fotossíntese, marque a alternativa correta.',
    options: [
      'Ocorre apenas na ausência de luz.',
      'Libera CO₂ e consome O₂.',
      'Converte energia luminosa em energia química.',
      'Não depende da clorofila.',
      'É exclusiva de organismos heterótrofos.',
    ],
    hint: 'Pense na função da clorofila: ela captura luz e a converte em energia química (glicose). Isso já elimina algumas alternativas.',
  },
  {
    subject: 'História',
    subjectColor: 'red' as const,
    examInfo: 'ENEM 2021 · Médio',
    question: 'A Revolução Industrial teve início, de forma pioneira, em qual país?',
    options: ['França', 'Alemanha', 'Inglaterra', 'Estados Unidos', 'Itália'],
    hint: 'Pense em qual país tinha, no século XVIII, acesso a carvão, capital e uma marinha mercante forte o suficiente para industrializar primeiro.',
  },
  {
    subject: 'Física',
    subjectColor: 'purple' as const,
    examInfo: 'ENEM 2018 · Difícil',
    question: 'Um corpo em queda livre, desprezando a resistência do ar, apresenta:',
    options: [
      'Velocidade constante.',
      'Aceleração constante e igual a g.',
      'Aceleração decrescente.',
      'Velocidade decrescente.',
      'Movimento retilíneo uniforme.',
    ],
    hint: 'Sem resistência do ar, a única força atuando é o peso — isso significa aceleração constante durante toda a queda.',
  },
  {
    subject: 'Português',
    subjectColor: 'gold' as const,
    examInfo: 'ENEM 2022 · Fácil',
    question: 'Assinale a alternativa em que todas as palavras estão acentuadas corretamente.',
    options: ['Árvore, café, você', 'Arvore, café, voce', 'Árvore, cafe, você', 'Arvóre, café, você', 'Árvore, café, voçê'],
    hint: 'Lembre-se: palavras proparoxítonas são sempre acentuadas, e "café"/"você" seguem a regra dos monossílabos e oxítonas terminados em "e".',
  },
  {
    subject: 'Química',
    subjectColor: 'blue' as const,
    examInfo: 'ENEM 2020 · Médio',
    question: 'O número atômico de um elemento representa:',
    options: [
      'O número de nêutrons no núcleo.',
      'A massa total do átomo.',
      'O número de prótons no núcleo.',
      'O número de elétrons na camada de valência.',
      'O número de isótopos do elemento.',
    ],
    hint: 'O número atômico (Z) é uma identidade do elemento — ele conta os prótons, que definem de qual elemento químico se trata.',
  },
  {
    subject: 'Geografia',
    subjectColor: 'green' as const,
    examInfo: 'ENEM 2021 · Fácil',
    question: 'O fenômeno El Niño está diretamente relacionado a mudanças em qual oceano?',
    options: ['Atlântico', 'Índico', 'Pacífico', 'Ártico', 'Antártico'],
    hint: 'O nome "El Niño" (o menino) vem de pescadores peruanos, na costa oeste da América do Sul — pense em qual oceano banha essa região.',
  },
  {
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    examInfo: 'ENEM 2019 · Médio',
    question: 'Em uma progressão aritmética de razão 5, sendo o primeiro termo 3, qual é o 10º termo?',
    options: ['48', '45', '50', '53', '43'],
    hint: 'Use a fórmula do termo geral: aₙ = a₁ + (n-1)·r. Aqui, a₁ = 3, r = 5 e n = 10.',
  },
  {
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    examInfo: 'ENEM 2022 · Médio',
    question: (
      <>
        Considere a equação do 2º grau x² - 5x + 6 = 0. Analise as afirmações abaixo e marque a alternativa{' '}
        <strong>correta</strong>:
      </>
    ),
    options: [
      'A raiz da equação 2x² - 8x + 6 = 0 é x = 1 e x = 3.',
      'O discriminante da equação x² - 5x + 6 = 0 é Δ = 1, com raízes x = 2 e x = 3.',
      'Uma função quadrática com a > 0 tem ponto de máximo no vértice.',
      'A parábola de f(x) = -x² + 4x - 3 abre para cima.',
      'O vértice da parábola f(x) = x² - 4x + 3 tem coordenada y = 1.',
    ],
    hint: 'Calcule o discriminante Δ = b² - 4ac de cada equação citada antes de julgar as afirmações — várias alternativas mudam os coeficientes originais.',
  },
  {
    subject: 'Redação',
    subjectColor: 'purple' as const,
    examInfo: 'ENEM 2020 · Médio',
    question: 'Qual dos elementos abaixo é obrigatório em uma redação nota 1000 no ENEM?',
    options: [
      'Uso de gírias regionais.',
      'Proposta de intervenção que respeite os direitos humanos.',
      'Texto em primeira pessoa.',
      'Ausência de conclusão.',
      'Citação de uma única fonte.',
    ],
    hint: 'A competência 5 do ENEM exige uma proposta de intervenção completa (agente, ação, meio, finalidade e detalhamento) que respeite os direitos humanos.',
  },
  {
    subject: 'Biologia',
    subjectColor: 'green' as const,
    examInfo: 'ENEM 2018 · Fácil',
    question: 'A unidade básica da hereditariedade é:',
    options: ['A célula', 'O gene', 'O cromossomo inteiro', 'A proteína', 'O ribossomo'],
    hint: 'Pense na menor unidade que carrega uma informação hereditária específica, transmitida de pais para filhos.',
  },
  {
    subject: 'Física',
    subjectColor: 'purple' as const,
    examInfo: 'ENEM 2021 · Médio',
    question: 'A primeira Lei de Newton também é conhecida como:',
    options: [
      'Lei da Ação e Reação',
      'Lei da Gravitação Universal',
      'Lei da Inércia',
      'Lei de Ohm',
      'Lei da Conservação de Energia',
    ],
    hint: 'Ela descreve o que acontece com um corpo quando a força resultante sobre ele é nula — ele tende a manter seu estado de movimento.',
  },
  {
    subject: 'Química',
    subjectColor: 'blue' as const,
    examInfo: 'ENEM 2019 · Difícil',
    question: 'Uma reação exotérmica é aquela que:',
    options: [
      'Absorve energia do ambiente.',
      'Libera energia para o ambiente.',
      'Não troca energia com o ambiente.',
      'Ocorre apenas em altas temperaturas.',
      'É sempre irreversível.',
    ],
    hint: '"Exo" significa "para fora" — pense em qual direção a energia se move em relação ao sistema.',
  },
  {
    subject: 'História',
    subjectColor: 'red' as const,
    examInfo: 'ENEM 2022 · Médio',
    question: 'A Proclamação da República no Brasil ocorreu em qual ano?',
    options: ['1822', '1888', '1889', '1891', '1500'],
    hint: 'Não confunda com a Independência (1822) ou a Abolição da Escravidão (1888) — são eventos próximos, mas distintos.',
  },
  {
    subject: 'Geografia',
    subjectColor: 'green' as const,
    examInfo: 'ENEM 2020 · Fácil',
    question: 'O bioma predominante no Brasil, em extensão territorial, é:',
    options: ['Caatinga', 'Cerrado', 'Amazônia', 'Mata Atlântica', 'Pampa'],
    hint: 'Pense no maior bioma do país, associado à maior floresta tropical do mundo.',
  },
]

const LETRAS = ['A', 'B', 'C', 'D', 'E']

function horaAtual() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function QuestoesVisualizacao() {
  const [currentIndex, setCurrentIndex] = useState(8)
  const [respostas, setRespostas] = useState<Array<number | null>>(() => QUESTOES.map(() => null))
  const [flagged, setFlagged] = useState<boolean[]>(() => QUESTOES.map(() => false))
  const [dicaAberta, setDicaAberta] = useState(false)
  const [iaAberta, setIaAberta] = useState(false)
  const [iaMensagens, setIaMensagens] = useState<AskAiMessage[]>([])
  const [iaInput, setIaInput] = useState('')

  useEffect(() => {
    setDicaAberta(false)
    setIaAberta(false)
    setIaMensagens([])
    setIaInput('')
  }, [currentIndex])

  const questao = QUESTOES[currentIndex]
  const isLast = currentIndex === QUESTOES.length - 1
  const isFirst = currentIndex === 0
  const selectedOption = respostas[currentIndex]
  const respondidas = respostas.map((resposta) => resposta !== null)

  function handleSelecionarOpcao(index: number) {
    setRespostas((prev) => prev.map((resposta, i) => (i === currentIndex ? index : resposta)))
  }

  function handleResponder() {
    if (selectedOption === null) return
    // TODO: conectar ao backend — registrar a resposta escolhida
    console.log('resposta enviada', { questao: currentIndex, opcao: selectedOption })

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  function handleAnterior() {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  function handleProxima() {
    setCurrentIndex((prev) => Math.min(QUESTOES.length - 1, prev + 1))
  }

  function handleSelecionarQuestao(index: number) {
    setCurrentIndex(index)
  }

  function handleToggleFlag() {
    setFlagged((prev) => prev.map((value, i) => (i === currentIndex ? !value : value)))
  }

  function handlePedirDica() {
    setDicaAberta((prev) => !prev)
    setIaAberta(false)
  }

  function handleExplicarComIA() {
    setIaAberta((prev) => {
      const abrindo = !prev
      if (abrindo && iaMensagens.length === 0) {
        // TODO: conectar ao backend — pedir explicação real da IA para esta questão
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
    // TODO: conectar ao backend — enviar a pergunta para a IA e receber a resposta real
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

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Link to="/questoes" className={styles.backLink}>
          <ArrowLeftIcon className={styles.backIcon} />
          Banco de Questões
        </Link>

        <div className={styles.progress}>
          <span className={styles.progressText}>
            Questão {currentIndex + 1}/{QUESTOES.length}
          </span>
          <QuestionProgressDots
            total={QUESTOES.length}
            current={currentIndex}
            answered={respondidas}
            flagged={flagged}
            onSelect={handleSelecionarQuestao}
          />
          <button
            type="button"
            className={`${styles.flagButton}${flagged[currentIndex] ? ` ${styles['flagButton--active']}` : ''}`}
            onClick={handleToggleFlag}
            aria-pressed={flagged[currentIndex]}
            aria-label={flagged[currentIndex] ? 'Remover marcação de dúvida' : 'Marcar questão com dúvida'}
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
            selected={selectedOption === index}
            onSelect={() => handleSelecionarOpcao(index)}
          />
        ))}
      </div>

      <div className={styles.actions}>
        <Button fullWidth={false} className={styles.answerButton} disabled={selectedOption === null} onClick={handleResponder}>
          {isLast ? 'Finalizar' : 'Responder'}
        </Button>
        <Button variant="outline" icon={<LightbulbIcon />} iconPosition="left" fullWidth={false} onClick={handlePedirDica}>
          Pedir dica
        </Button>
        <Button variant="outline" icon={<SparklesIcon />} iconPosition="left" fullWidth={false} onClick={handleExplicarComIA}>
          Explicar com IA
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
    </main>
  )
}
