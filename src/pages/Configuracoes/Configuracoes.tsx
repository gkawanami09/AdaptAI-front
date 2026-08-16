import { useEffect, useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { SettingsNavCard } from '../../components/cards/SettingsNavCard'
import { ProfileCard } from '../../components/cards/ProfileCard'
import { NotificationSettingsCard } from '../../components/cards/NotificationSettingsCard'
import { BrowserNotificationsCard } from '../../components/cards/BrowserNotificationsCard'
import { AppearanceCard } from '../../components/cards/AppearanceCard'
import { PrivacyCard } from '../../components/cards/PrivacyCard'
import { AIDataCard } from '../../components/cards/AIDataCard'
import { PasswordChangeModal } from '../../components/cards/PasswordChangeModal'
import { DeleteAccountModal } from '../../components/cards/DeleteAccountModal'
import { Toast } from '../../components/ui/Toast'
import { useTheme } from '../../hooks/useTheme'
import type { ThemePreference } from '../../hooks/useTheme'
import { UserIcon, BellIcon, PaletteIcon, ShieldIcon } from '../../components/ui/icons'
import styles from './Configuracoes.module.css'

import {
  getConfiguracoesAluno,
  patchNotificacaoAluno,
  patchAparenciaAluno,
  patchPerfilAluno,
  uploadAvatarAluno,
  alterarSenhaAluno,
  excluirContaAluno,
  getDadosIAAluno,
  patchDadoIAAluno,
} from '../../services/configuracoesAluno'
import { clearStoredAuth } from '../../services/auth'
import { removeCookie, TOKEN_COOKIE_NAME } from '../../utils/cookies'
import type { GetConfiguracoesAlunoResponse, DadosIAResponse } from '../../types/configuracoesAluno'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'perfil', icon: <UserIcon />, iconColor: 'purple' as const, label: 'Perfil' },
  { id: 'notificacoes', icon: <BellIcon />, iconColor: 'blue' as const, label: 'Notificações' },
  { id: 'aparencia', icon: <PaletteIcon />, iconColor: 'gold' as const, label: 'Aparência' },
  { id: 'privacidade', icon: <ShieldIcon />, iconColor: 'blue' as const, label: 'Privacidade' },
]

const NOTIFICACOES_OCULTAS = new Set(['relatorio-semanal'])

export function Configuracoes() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('perfil')
  const [tema, setTema] = useTheme()

  const [dados, setDados] = useState<GetConfiguracoesAlunoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [dadosIA, setDadosIA] = useState<DadosIAResponse | null>(null)
  const [carregandoDadosIA, setCarregandoDadosIA] = useState(false)
  const [erroDadosIA, setErroDadosIA] = useState(false)

  const [modalAberto, setModalAberto] = useState<'senha' | 'excluir-conta' | null>(null)
  const [excluindoConta, setExcluindoConta] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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

  async function carregarDadosIA() {
    setCarregandoDadosIA(true)
    setErroDadosIA(false)

    try {
      const resposta = await getDadosIAAluno()
      setDadosIA(resposta)
    } catch (err) {
      console.error(err)
      setErroDadosIA(true)
    } finally {
      setCarregandoDadosIA(false)
    }
  }

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  useEffect(() => {
    if (activeId === 'privacidade' && !dadosIA && !carregandoDadosIA) {
      carregarDadosIA()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

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
      setToast({ type: 'error', message: 'Não foi possível salvar a preferência de notificação.' })
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
      setToast({ type: 'error', message: 'Não foi possível salvar a preferência de aparência.' })
    }
  }

  async function handleSalvarPerfil(dadosPerfil: { nome: string; escola: string; anoEnem: string }) {
    const resposta = await patchPerfilAluno({
      nome: dadosPerfil.nome,
      escola: dadosPerfil.escola,
      ano_enem: dadosPerfil.anoEnem,
    })

    setDados((prev) => (prev ? { ...prev, perfil: resposta } : prev))
  }

  async function handleUploadAvatar(arquivo: File) {
    const resposta = await uploadAvatarAluno(arquivo)
    setDados((prev) => (prev ? { ...prev, perfil: { ...prev.perfil, avatar_url: resposta.avatar_url } } : prev))
  }

  async function handleAlterarSenha(senhaAtual: string, novaSenha: string) {
    await alterarSenhaAluno({ senha_atual: senhaAtual, nova_senha: novaSenha })
    setModalAberto(null)
    setToast({ type: 'success', message: 'Senha alterada com sucesso.' })
  }

  async function handleExcluirConta(senha: string) {
    setExcluindoConta(true)
    try {
      await excluirContaAluno({ senha })
      clearStoredAuth()
      removeCookie(TOKEN_COOKIE_NAME)
      navigate('/login', { replace: true })
    } finally {
      setExcluindoConta(false)
    }
  }

  async function handleToggleDadoIA(id: string, utilizado: boolean) {
    if (!dadosIA) return
    const anterior = dadosIA.dados

    setDadosIA({
      ...dadosIA,
      dados: dadosIA.dados.map((item) => (item.id === id ? { ...item, utilizado } : item)),
    })

    try {
      await patchDadoIAAluno({ id, utilizado })
    } catch (err) {
      console.error(err)
      setDadosIA((prev) => (prev ? { ...prev, dados: anterior } : prev))
      setToast({ type: 'error', message: 'Não foi possível atualizar essa preferência de dados.' })
    }
  }

  function handlePrivacyAction(id: string) {
    if (id === 'alterar-senha') setModalAberto('senha')
    if (id === 'excluir-conta') setModalAberto('excluir-conta')
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

  const notificacoesVisiveis = dados.notificacoes.filter((item) => !NOTIFICACOES_OCULTAS.has(item.id))

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
              avatarUrl={dados.perfil.avatar_url}
              onSave={handleSalvarPerfil}
              onUploadAvatar={handleUploadAvatar}
            />
          )}
          {activeId === 'notificacoes' && (
            <div className={styles.stack}>
              <NotificationSettingsCard
                title="Notificações"
                items={notificacoesVisiveis}
                onToggle={handleToggleNotificacao}
              />
              <BrowserNotificationsCard />
            </div>
          )}
          {activeId === 'aparencia' && <AppearanceCard value={tema} onChange={handleChangeTema} />}
          {activeId === 'privacidade' && (
            <div className={styles.stack}>
              <PrivacyCard onAction={handlePrivacyAction} />
              <AIDataCard
                dados={dadosIA?.dados ?? []}
                insights={dadosIA?.insights ?? []}
                carregando={carregandoDadosIA}
                erro={erroDadosIA}
                onToggleDado={handleToggleDadoIA}
                onTentarNovamente={carregarDadosIA}
              />
            </div>
          )}
        </div>
      </div>

      {modalAberto === 'senha' && (
        <PasswordChangeModal onClose={() => setModalAberto(null)} onSubmit={handleAlterarSenha} />
      )}

      {modalAberto === 'excluir-conta' && (
        <DeleteAccountModal onClose={() => setModalAberto(null)} onConfirm={handleExcluirConta} />
      )}

      {excluindoConta && <div className={styles.overlay} />}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </main>
  )
}
