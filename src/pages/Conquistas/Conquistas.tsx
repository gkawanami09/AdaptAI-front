import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { StatHighlightCard } from '../../components/cards/StatHighlightCard'
import { LevelProgressCard } from '../../components/cards/LevelProgressCard'
import { AchievementCard } from '../../components/cards/AchievementCard'
import { DailyMissionsCard } from '../../components/cards/DailyMissionsCard'
import { WeeklyMissionsCard } from '../../components/cards/WeeklyMissionsCard'
import styles from './Conquistas.module.css'

import { useConquistas } from '../../hooks/useConquistas'

export function Conquistas() {
  const { dados, carregando, erro, recarregar } = useConquistas()

  if (carregando) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Carregando conquistas...</p>
        </CardDiv>
      </main>
    )
  }

  if (erro || !dados) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Não foi possível carregar as conquistas.</p>
          <Button fullWidth={false} onClick={recarregar}>
            Tentar novamente
          </Button>
        </CardDiv>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <TitlePage title="Conquistas" subtitle={dados.subtitulo} />

      <div className={styles.summaryRow}>
        <StatHighlightCard icon="🔥" value={`${dados.ofensiva_dias} dias`} label="Ofensiva" />
        <StatHighlightCard icon="⚡" value={dados.xp_total.toLocaleString('pt-BR')} label="XP total" />
        <StatHighlightCard icon="🏆" value={`Nível ${dados.nivel_atual}`} label="Nível atual" />
        <StatHighlightCard icon="🥇" value={String(dados.total_medalhas)} label="Medalhas" />
      </div>

      <div className={styles.levelRow}>
        <LevelProgressCard level={dados.nivel_atual} currentXp={dados.xp_total} targetXp={dados.xp_proximo_nivel} />
      </div>

      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          <h2 className={styles.sectionTitle}>Conquistas desbloqueadas</h2>

          <div className={styles.achievementsGrid}>
            {dados.conquistas_desbloqueadas.map((item) => (
              <AchievementCard
                key={item.titulo}
                icon={item.icone}
                title={item.titulo}
                description={item.descricao}
                rarity={item.raridade}
                xp={item.xp}
              />
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Conquistas bloqueadas</h2>

          <div className={styles.achievementsGrid}>
            {dados.conquistas_bloqueadas.map((item) => (
              <AchievementCard
                key={item.titulo}
                icon={item.icone}
                title={item.titulo}
                description={item.descricao}
                rarity={item.raridade}
                locked
              />
            ))}
          </div>
        </div>

        <div className={styles.sideColumn}>
          <DailyMissionsCard title="Missões diárias" icon="🔥" missions={dados.missoes_diarias} />
          <WeeklyMissionsCard title="Missões semanais" icon="🏆" missions={dados.missoes_semanais} />
        </div>
      </div>
    </main>
  )
}
