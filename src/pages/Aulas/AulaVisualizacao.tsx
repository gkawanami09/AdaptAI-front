import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { VideoPlayer } from '../../components/ui/VideoPlayer'
import { LessonSummaryCard, LessonParagraph, LessonHighlight } from '../../components/cards/LessonSummaryCard'
import { LessonConceptsCard } from '../../components/cards/LessonConceptsCard'
import { ModuleLessonsCard } from '../../components/cards/ModuleLessonsCard'
import { NextLessonCard } from '../../components/cards/NextLessonCard'
import { DicaCard } from '../../components/cards/DicaCard'
import { ArrowLeftIcon, ClockIcon, CheckCircleIcon, BookIcon, BarChartIcon } from '../../components/ui/icons'
import styles from './AulaVisualizacao.module.css'

// TODO: substituir pelos dados reais vindos do backend (detalhe da aula + URL do vídeo)
const AULA = {
  title: 'Função Quadrática',
  subject: 'Matemática',
  subjectColor: 'blue' as const,
  duration: '35 min',
  difficulty: 'Médio',
  progress: 60,
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
}

// TODO: substituir pelos dados reais vindos do backend (conceitos abordados nesta aula)
const CONCEITOS_INICIAIS = [
  { id: 'definicao', label: 'Definição de função quadrática f(x) = ax² + bx + c', checked: false },
  { id: 'discriminante', label: 'Cálculo do discriminante (Δ = b² - 4ac)', checked: false },
  { id: 'bhaskara', label: 'Fórmula de Bhaskara', checked: false },
  { id: 'grafico', label: 'Interpretação gráfica da parábola', checked: false },
]

// TODO: substituir pelos dados reais vindos do backend (aulas do módulo + progresso do aluno)
const MODULO_LESSONS = [
  { order: 1, label: 'Função Afim', status: 'concluida' as const },
  { order: 2, label: 'Função Quadrática', status: 'atual' as const },
  { order: 3, label: 'Função Exponencial', status: 'bloqueada' as const },
  { order: 4, label: 'Função Logarítmica', status: 'bloqueada' as const },
]

// TODO: substituir pelos dados reais vindos do backend (próxima aula do módulo)
const PROXIMA_AULA = {
  title: 'Função Exponencial',
  duration: '28 min',
  difficulty: 'Médio',
}

export function AulaVisualizacao() {
  const [conceitos, setConceitos] = useState(CONCEITOS_INICIAIS)

  function handleToggleConceito(id: string, checked: boolean) {
    setConceitos((prev) => prev.map((item) => (item.id === id ? { ...item, checked } : item)))
  }

  function handleMarcarConcluido() {
    // TODO: conectar ao backend — marcar a aula como concluída
    console.log('marcar aula como concluída')
  }

  function handleFazerQuestoes() {
    // TODO: conectar à navegação real — lista de questões desta aula
    console.log('fazer questões')
  }

  return (
    <main className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/aulas" className={styles.backLink}>
          <ArrowLeftIcon className={styles.backIcon} />
          Aulas
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{AULA.title}</span>
      </div>

      <div className={styles.meta}>
        <Badge color={AULA.subjectColor}>{AULA.subject}</Badge>
        <span className={styles.metaText}>
          <ClockIcon className={styles.metaIcon} />
          {AULA.duration} · {AULA.difficulty}
        </span>
      </div>

      <h1 className={styles.title}>{AULA.title}</h1>

      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          <VideoPlayer src={AULA.videoUrl} initialProgress={AULA.progress} />

          <LessonSummaryCard title="Resumo da aula">
            <LessonParagraph>
              A <strong>função quadrática</strong> é definida por f(x) = ax² + bx + c, onde a ≠ 0. Seu gráfico é uma{' '}
              <strong>parábola</strong> que abre para cima quando a &gt; 0 e para baixo quando a &lt; 0.
            </LessonParagraph>
            <LessonParagraph>
              Para encontrar as raízes (zeros) da função, usamos a <strong>Fórmula de Bhaskara</strong>:
            </LessonParagraph>
            <LessonHighlight>x = (-b ± √Δ) / 2a, onde Δ = b² - 4ac</LessonHighlight>
            <LessonParagraph>
              O <strong>vértice</strong> da parábola é o ponto de máximo ou mínimo da função, com coordenadas V =
              (-b/2a, -Δ/4a).
            </LessonParagraph>
          </LessonSummaryCard>

          <LessonConceptsCard title="Conceitos desta aula" items={conceitos} onToggle={handleToggleConceito} />

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
          <ModuleLessonsCard title="Módulo: Funções" lessons={MODULO_LESSONS} />

          <NextLessonCard
            title="Próxima aula"
            icon={<BarChartIcon />}
            iconColor="blue"
            lessonTitle={PROXIMA_AULA.title}
            duration={PROXIMA_AULA.duration}
            difficulty={PROXIMA_AULA.difficulty}
          />

          <DicaCard
            icon="🤖"
            title="Dica da Ada"
            message="Preste atenção no sinal de 'a' — ele define se a parábola abre para cima ou para baixo. Isso cai muito no ENEM!"
          />
        </div>
      </div>
    </main>
  )
}
