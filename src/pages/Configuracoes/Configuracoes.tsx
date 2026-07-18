import { useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { SettingsNavCard } from '../../components/cards/SettingsNavCard'
import { ProfileCard } from '../../components/cards/ProfileCard'
import { NotificationSettingsCard } from '../../components/cards/NotificationSettingsCard'
import { StudyGoalsCard } from '../../components/cards/StudyGoalsCard'
import { AppearanceCard } from '../../components/cards/AppearanceCard'
import { PrivacyCard } from '../../components/cards/PrivacyCard'
import { useTheme } from '../../hooks/useTheme'
import { UserIcon, BellIcon, TargetIcon, PaletteIcon, ShieldIcon } from '../../components/ui/icons'
import styles from './Configuracoes.module.css'

// TODO: substituir pelos dados reais vindos do backend (perfil do aluno logado)
const PERFIL = {
  name: 'Guilherme Santos',
  email: 'guilherme@email.com',
  level: 12,
  xp: 4820,
  escola: 'Colégio Estadual SP',
  anoEnem: '2025',
}

// TODO: substituir pelos dados reais vindos do backend (preferências de notificação do aluno)
const NOTIFICACOES_INICIAIS = [
  {
    id: 'lembrete-diario',
    label: 'Lembrete diário de estudos',
    description: 'Receba um lembrete no horário que você definir',
    enabled: true,
  },
  {
    id: 'alerta-ofensiva',
    label: 'Alerta de ofensiva',
    description: 'Aviso quando sua ofensiva estiver em risco',
    enabled: true,
  },
  {
    id: 'novas-conquistas',
    label: 'Novas conquistas',
    description: 'Notificação ao desbloquear conquistas',
    enabled: true,
  },
  {
    id: 'relatorio-semanal',
    label: 'Relatório semanal',
    description: 'Resumo do seu progresso toda segunda-feira',
    enabled: false,
  },
  {
    id: 'novidades',
    label: 'Novidades do AdaptAI',
    description: 'Atualizações e novos recursos da plataforma',
    enabled: false,
  },
]

// TODO: substituir pelos dados reais vindos do backend (metas de estudo do aluno)
const METAS = {
  objetivo: 'Passar em universidade pública',
  tempoEstudo: '2h',
  notaAlvo: '700',
}

const NAV_ITEMS = [
  { id: 'perfil', icon: <UserIcon />, iconColor: 'purple' as const, label: 'Perfil' },
  { id: 'notificacoes', icon: <BellIcon />, iconColor: 'blue' as const, label: 'Notificações' },
  { id: 'metas', icon: <TargetIcon />, iconColor: 'green' as const, label: 'Metas e plano' },
  { id: 'aparencia', icon: <PaletteIcon />, iconColor: 'gold' as const, label: 'Aparência' },
  { id: 'privacidade', icon: <ShieldIcon />, iconColor: 'blue' as const, label: 'Privacidade' },
]

export function Configuracoes() {
  const [activeId, setActiveId] = useState('perfil')
  const [notificacoes, setNotificacoes] = useState(NOTIFICACOES_INICIAIS)
  const [tema, setTema] = useTheme()

  function handleToggleNotificacao(id: string, enabled: boolean) {
    setNotificacoes((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)))
  }

  function handlePrivacyAction(id: string) {
    // TODO: conectar ao backend — abrir o fluxo correspondente (troca de senha, export, exclusão de conta, etc.)
    console.log('ação de privacidade', id)
  }

  return (
    <main className={styles.page}>
      <TitlePage title="Configurações" />

      <div className={styles.columns}>
        <div className={styles.sideColumn}>
          <SettingsNavCard items={NAV_ITEMS} activeId={activeId} onChange={setActiveId} />
        </div>

        <div className={styles.mainColumn}>
          {activeId === 'perfil' && (
            <ProfileCard
              name={PERFIL.name}
              email={PERFIL.email}
              level={PERFIL.level}
              xp={PERFIL.xp}
              escola={PERFIL.escola}
              anoEnem={PERFIL.anoEnem}
            />
          )}
          {activeId === 'notificacoes' && (
            <NotificationSettingsCard
              title="Notificações"
              items={notificacoes}
              onToggle={handleToggleNotificacao}
            />
          )}
          {activeId === 'metas' && (
            <StudyGoalsCard objetivo={METAS.objetivo} tempoEstudo={METAS.tempoEstudo} notaAlvo={METAS.notaAlvo} />
          )}
          {activeId === 'aparencia' && <AppearanceCard value={tema} onChange={setTema} />}
          {activeId === 'privacidade' && <PrivacyCard onAction={handlePrivacyAction} />}
        </div>
      </div>
    </main>
  )
}
