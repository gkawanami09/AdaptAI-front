import { TitlePage } from '../../components/ui/TitlePage'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { LevelProgressCard } from '../../components/cards/LevelProgressCard'
import { AchievementCard } from '../../components/cards/AchievementCard'
import { DailyMissionsCard } from '../../components/cards/DailyMissionsCard'
import { WeeklyMissionsCard } from '../../components/cards/WeeklyMissionsCard'
import styles from './Conquistas.module.css'

// TODO: substituir pelos dados reais vindos do backend (resumo de conquistas do aluno)
const RESUMO = [
  { icon: '🔥', value: '8 dias', label: 'Ofensiva' },
  { icon: '⚡', value: '4.820', label: 'XP total' },
  { icon: '🏆', value: 'Nível 12', label: 'Nível atual' },
  { icon: '🥇', value: '4', label: 'Medalhas' },
]

// TODO: substituir pelos dados reais vindos do backend (conquistas desbloqueadas do aluno)
const CONQUISTAS_DESBLOQUEADAS = [
  { icon: '🏆', title: 'Primeira Semana', description: 'Complete 7 dias de estudo', rarity: 'comum' as const, xp: 100 },
  { icon: '💯', title: '100 Questões', description: 'Resolva 100 questões', rarity: 'incomum' as const, xp: 200 },
  { icon: '✍️', title: 'Primeira Redação', description: 'Envie sua primeira redação', rarity: 'comum' as const, xp: 150 },
  { icon: '🔥', title: '7 Dias de Ofensiva', description: 'Mantenha 7 dias seguidos', rarity: 'raro' as const, xp: 300 },
]

// TODO: substituir pelos dados reais vindos do backend (conquistas ainda bloqueadas do aluno)
const CONQUISTAS_BLOQUEADAS = [
  { icon: '🛡️', title: 'Matemática Sem Medo', description: 'Acerte 80% em Matemática', rarity: 'epico' as const },
  { icon: '🔍', title: 'Revisor de Erros', description: 'Revise 50 questões erradas', rarity: 'incomum' as const },
  { icon: '🎯', title: 'Mestre do ENEM', description: 'Complete um simulado completo', rarity: 'lendario' as const },
  { icon: '⭐', title: 'Nota 1000', description: 'Simule nota 1000 em redação', rarity: 'lendario' as const },
  { icon: '🏃', title: 'Maratonista', description: 'Estude 5h em um único dia', rarity: 'raro' as const },
]

// TODO: substituir pelos dados reais vindos do backend (missões diárias do aluno)
const MISSOES_DIARIAS = [
  { label: 'Resolver 10 questões', xp: 50, completed: true },
  { label: 'Assistir 1 aula', xp: 30, completed: true },
  { label: 'Estudar 1h30', xp: 80, completed: false },
  { label: 'Revisar anotações', xp: 20, completed: false },
]

// TODO: substituir pelos dados reais vindos do backend (missões semanais do aluno)
const MISSOES_SEMANAIS = [
  { label: 'Completar plano semanal', xp: 200, current: 5, target: 7 },
  { label: 'Resolver 50 questões', xp: 150, current: 32, target: 50 },
  { label: 'Enviar 1 redação', xp: 100, current: 0, target: 1 },
]

export function Conquistas() {
  return (
    <main className={styles.page}>
      <TitlePage title="Conquistas" subtitle="4 de 9 conquistas encontradas" />

      <div className={styles.summaryRow}>
        {RESUMO.map((item) => (
          <StatHighlightCard key={item.label} icon={item.icon} value={item.value} label={item.label} />
        ))}
      </div>

      <div className={styles.levelRow}>
        <LevelProgressCard level={12} currentXp={4820} targetXp={5000} />
      </div>

      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          <h2 className={styles.sectionTitle}>Conquistas desbloqueadas</h2>

          <div className={styles.achievementsGrid}>
            {CONQUISTAS_DESBLOQUEADAS.map((item) => (
              <AchievementCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                rarity={item.rarity}
                xp={item.xp}
              />
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Conquistas bloqueadas</h2>

          <div className={styles.achievementsGrid}>
            {CONQUISTAS_BLOQUEADAS.map((item) => (
              <AchievementCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                rarity={item.rarity}
                locked
              />
            ))}
          </div>
        </div>

        <div className={styles.sideColumn}>
          <DailyMissionsCard title="Missões diárias" icon="🔥" missions={MISSOES_DIARIAS} />
          <WeeklyMissionsCard title="Missões semanais" icon="🏆" missions={MISSOES_SEMANAIS} />
        </div>
      </div>
    </main>
  )
}
