import { useEffect, useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { SettingsNavCard } from '../../components/cards/SettingsNavCard'
import { ProfileCard } from '../../components/cards/ProfileCard'
import { NotificationSettingsCard } from '../../components/cards/NotificationSettingsCard'
import { StudyGoalsCard } from '../../components/cards/StudyGoalsCard'
import { AppearanceCard } from '../../components/cards/AppearanceCard'
import { PrivacyCard } from '../../components/cards/PrivacyCard'
import { useTheme } from '../../hooks/useTheme'
import type { ThemePreference } from '../../hooks/useTheme'
import { UserIcon, BellIcon, TargetIcon, PaletteIcon, ShieldIcon } from '../../components/ui/icons'
import styles from './Configuracoes.module.css'

import { getConfiguracoesAluno, patchNotificacaoAluno, patchAparenciaAluno } from '../../services/configuracoesAluno'
import type { GetConfiguracoesAlunoResponse } from '../../types/configuracoesAluno'

const NAV_ITEMS = [
  { id: 'perfil', icon: <UserIcon />, iconColor: 'purple' as const, label: 'Perfil' },
  { id: 'notificacoes', icon: <BellIcon />, iconColor: 'blue' as const, label: 'Notificações' },
  { id: 'metas', icon: <TargetIcon />, iconColor: 'green' as const, label: 'Metas e plano' },
  { id: 'aparencia', icon: <PaletteIcon />, iconColor: 'gold' as const, label: 'Aparência' },
  { id: 'privacidade', icon: <ShieldIcon />, iconColor: 'blue' as const, label: 'Privacidade' },
]

export function Configuracoes() {
  const [activeId, setActiveId] = useState('perfil')
  const [tema, setTema] = useTheme()

  const [dados, setDados] = useState<GetConfiguracoesAlunoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarConfiguracoes() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getConfiguracoesAluno()
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  async function handleToggleNotificacao(id: string, enabled: boolean) {
    if (!dados) return
    const anterior = dados.notificacoes

    setDados({
      ...dados,
      notificacoes: dados.notificacoes.map((item) => (item.id === id ? { ...item, enabled } : item)),
    })

    try {
      await patchNotificacaoAluno({ id, enabled })
    } catch (err) {
      console.error(err)
      setDados((prev) => (prev ? { ...prev, notificacoes: anterior } : prev))
    }
  }

  async function handleChangeTema(novoTema: ThemePreference) {
    const anterior = tema
    setTema(novoTema)

    try {
      await patchAparenciaAluno({ tema: novoTema })
    } catch (err) {
      console.error(err)
      setTema(anterior)
    }
  }

  function handlePrivacyAction(id: string) {
    // TODO: conectar ao backend — abrir o fluxo correspondente (troca de senha, export, exclusão de conta, etc.)
    console.log('ação de privacidade', id)
  }

  if (carregando) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Carregando configurações...</p>
        </CardDiv>
      </main>
    )
  }

  if (erro || !dados) {
    return (
      <main className={styles.page}>
        <CardDiv>
          <p>Não foi possível carregar as configurações.</p>
          <Button fullWidth={false} onClick={carregarConfiguracoes}>
            Tentar novamente
          </Button>
        </CardDiv>
      </main>
    )
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
              name={dados.perfil.nome}
              email={dados.perfil.email}
              level={dados.perfil.nivel}
              xp={dados.perfil.xp_total}
              escola={dados.perfil.escola}
              anoEnem={dados.perfil.ano_enem}
            />
          )}
          {activeId === 'notificacoes' && (
            <NotificationSettingsCard
              title="Notificações"
              items={dados.notificacoes}
              onToggle={handleToggleNotificacao}
            />
          )}
          {activeId === 'metas' && (
            <StudyGoalsCard
              objetivo={dados.metas.objetivo}
              tempoEstudo={dados.metas.tempo_estudo}
              notaAlvo={dados.metas.nota_alvo}
            />
          )}
          {activeId === 'aparencia' && <AppearanceCard value={tema} onChange={handleChangeTema} />}
          {activeId === 'privacidade' && <PrivacyCard onAction={handlePrivacyAction} />}
        </div>
      </div>
    </main>
  )
}
