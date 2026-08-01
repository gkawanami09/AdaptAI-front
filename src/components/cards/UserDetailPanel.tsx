import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { CardDiv } from './CardDiv'
import { UnderlineTabs } from '../ui/UnderlineTabs'
import { UserAvatar } from './UserAvatar'
import { UserStatusBadge } from './UserStatusBadge'
import { StatTile } from './StatTile'
import { AchievementCard } from './AchievementCard'
import { UserHistoryList } from './UserHistoryList'
import { AdminMeasureTable } from './AdminMeasureTable'
import { UserTimelineList } from './UserTimelineList'
import { AreaLineChart } from '../charts/AreaLineChart'
import { Pagination } from '../ui/Pagination'
import { EditUserModal } from './EditUserModal'
import { SuspensionModal } from './SuspensionModal'
import { BanModal } from './BanModal'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import {
  ArrowLeftIcon, PencilIcon, CalendarIcon, ClockIcon, CheckCircleIcon,
  FireIcon, TrophyIcon, BoltIcon, CheckSquareIcon, TargetIcon, ClipboardIcon,
  FileTextIcon, AlertCircleIcon, XIcon, LockIcon,
} from '../ui/icons'
import styles from './UserDetailPanel.module.css'

import {
  getUsuarioPorId, getOfensivaHistorico, getConquistas, getHistorico, getMedidas, getTimeline,
  patchUsuario, suspenderUsuario, banirUsuario, reativarUsuario, resetarSenha, resetarOfensiva,
} from '../../services/usuarios'
import type {
  UsuarioDetalhe, UsuarioCargo, OfensivaHistoricoPonto, Conquista, HistoricoItem,
  MedidaAdministrativa, TimelineEvento,
} from '../../types/usuarios'

const CARGO_LABEL: Record<UsuarioCargo, string> = {
  aluno: 'Aluno',
  moderador: 'Moderador',
  editor: 'Editor',
  administrador: 'Administrador',
}

const CARGO_BADGE_COLOR: Record<UsuarioCargo, BadgeColor> = {
  aluno: 'gray',
  moderador: 'purple',
  editor: 'gold',
  administrador: 'blue',
}

const TABS = [
  { value: 'visao-geral', label: 'Visão Geral' },
  { value: 'conquistas', label: 'Conquistas' },
  { value: 'historico', label: 'Histórico' },
  { value: 'medidas', label: 'Medidas Administrativas' },
  { value: 'timeline', label: 'Timeline' },
]

const ITENS_HISTORICO_POR_PAGINA = 8

type UserDetailPanelProps = {
  usuarioId: string
  editarAoAbrir?: boolean
  onVoltar?: () => void
  onUsuarioAtualizado?: () => void
}

export function UserDetailPanel({ usuarioId, editarAoAbrir, onVoltar, onUsuarioAtualizado }: UserDetailPanelProps) {
  const [usuario, setUsuario] = useState<UsuarioDetalhe | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  const [aba, setAba] = useState('visao-geral')
  const [ofensivaHistorico, setOfensivaHistorico] = useState<OfensivaHistoricoPonto[]>([])
  const [conquistas, setConquistas] = useState<Conquista[]>([])
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [historicoPagina, setHistoricoPagina] = useState(1)
  const [historicoTotalPaginas, setHistoricoTotalPaginas] = useState(1)
  const [medidas, setMedidas] = useState<MedidaAdministrativa[]>([])
  const [timeline, setTimeline] = useState<TimelineEvento[]>([])

  const [editando, setEditando] = useState(Boolean(editarAoAbrir))
  const [suspendendo, setSuspendendo] = useState(false)
  const [banindo, setBanindo] = useState(false)
  const [reativando, setReativando] = useState(false)
  const [resetandoSenha, setResetandoSenha] = useState(false)
  const [resetandoOfensiva, setResetandoOfensiva] = useState(false)
  const [processando, setProcessando] = useState(false)

  async function carregarUsuario() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getUsuarioPorId(usuarioId)
      setUsuario(resposta.usuario)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuario()
    setAba('visao-geral')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId])

  useEffect(() => {
    getOfensivaHistorico(usuarioId)
      .then((resposta) => setOfensivaHistorico(resposta.historico))
      .catch((err) => console.error(err))
  }, [usuarioId])

  useEffect(() => {
    if (aba !== 'conquistas') return
    getConquistas(usuarioId)
      .then((resposta) => setConquistas(resposta.conquistas))
      .catch((err) => console.error(err))
  }, [usuarioId, aba])

  useEffect(() => {
    if (aba !== 'historico') return
    getHistorico(usuarioId, { pagina: historicoPagina, limite: ITENS_HISTORICO_POR_PAGINA })
      .then((resposta) => {
        setHistorico(resposta.itens)
        setHistoricoTotalPaginas(resposta.total_paginas || 1)
      })
      .catch((err) => console.error(err))
  }, [usuarioId, aba, historicoPagina])

  useEffect(() => {
    if (aba !== 'medidas') return
    getMedidas(usuarioId)
      .then((resposta) => setMedidas(resposta.medidas))
      .catch((err) => console.error(err))
  }, [usuarioId, aba])

  useEffect(() => {
    if (aba !== 'timeline') return
    getTimeline(usuarioId)
      .then((resposta) => setTimeline(resposta.eventos))
      .catch((err) => console.error(err))
  }, [usuarioId, aba])

  async function handleSalvarEdicao(nome: string, email: string, cargo: UsuarioCargo) {
    setProcessando(true)
    try {
      await patchUsuario(usuarioId, { nome, email, cargo })
      setEditando(false)
      carregarUsuario()
      onUsuarioAtualizado?.()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarSuspensao(motivo: string, duracaoDias: number) {
    setProcessando(true)
    try {
      await suspenderUsuario(usuarioId, { motivo, duracao_dias: duracaoDias })
      setSuspendendo(false)
      carregarUsuario()
      onUsuarioAtualizado?.()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarBanimento(motivo: string) {
    setProcessando(true)
    try {
      await banirUsuario(usuarioId, { motivo })
      setBanindo(false)
      carregarUsuario()
      onUsuarioAtualizado?.()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarReativacao() {
    setProcessando(true)
    try {
      await reativarUsuario(usuarioId)
      setReativando(false)
      carregarUsuario()
      onUsuarioAtualizado?.()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarResetSenha() {
    setProcessando(true)
    try {
      await resetarSenha(usuarioId)
      setResetandoSenha(false)
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarResetOfensiva() {
    setProcessando(true)
    try {
      await resetarOfensiva(usuarioId)
      setResetandoOfensiva(false)
      carregarUsuario()
      onUsuarioAtualizado?.()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando usuário...</p>
      </CardDiv>
    )
  }

  if (erro || !usuario) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar este usuário.</p>
      </CardDiv>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.headerRow}>
        {onVoltar ? (
          <button type="button" className={styles.backLink} onClick={onVoltar}>
            <ArrowLeftIcon /> Voltar para a lista
          </button>
        ) : (
          <span />
        )}

        <Button fullWidth={false} variant="outline" size="sm" icon={<PencilIcon />} iconPosition="left" onClick={() => setEditando(true)}>
          Editar usuário
        </Button>
      </div>

      <CardDiv>
        <div className={styles.profileCard}>
          <UserAvatar nome={usuario.nome} avatarUrl={usuario.avatar_url} size="lg" />
          <div className={styles.profileInfo}>
            <span className={styles.nome}>{usuario.nome}</span>
            <span className={styles.email}>{usuario.email}</span>
            <div className={styles.badgeRow}>
              <Badge color={CARGO_BADGE_COLOR[usuario.cargo]}>{CARGO_LABEL[usuario.cargo]}</Badge>
              <UserStatusBadge status={usuario.status} />
            </div>
          </div>
        </div>

        <div className={styles.metaList}>
          <div className={styles.metaRow}>
            <ClipboardIcon />
            <span className={styles.metaLabel}>ID do usuário</span>
            <span className={styles.metaValue}>{usuario.id_publico}</span>
          </div>
          <div className={styles.metaRow}>
            <CalendarIcon />
            <span className={styles.metaLabel}>Data de cadastro</span>
            <span className={styles.metaValue}>{usuario.criado_em}</span>
          </div>
          <div className={styles.metaRow}>
            <ClockIcon />
            <span className={styles.metaLabel}>Último acesso</span>
            <span className={styles.metaValue}>{usuario.ultimo_acesso ?? '—'}</span>
          </div>
          <div className={styles.metaRow}>
            <CheckCircleIcon />
            <span className={styles.metaLabel}>Email verificado</span>
            <span className={`${styles.metaValue} ${usuario.email_verificado ? styles['metaValue--positive'] : ''}`}>
              {usuario.email_verificado ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
      </CardDiv>

      <div className={styles.statsGrid}>
        <StatTile icon={<FireIcon />} iconColor="gold" label="Ofensiva atual" value={`${usuario.ofensiva_atual ?? 0} dias`} />
        <StatTile icon={<TrophyIcon />} iconColor="purple" label="Maior ofensiva" value={`${usuario.maior_ofensiva ?? 0} dias`} />
        <StatTile icon={<BoltIcon />} iconColor="gold" label="XP" value={(usuario.xp ?? 0).toLocaleString('pt-BR')} />
        <StatTile icon={<CheckSquareIcon />} iconColor="blue" label="Questões respondidas" value={(usuario.questoes_respondidas ?? 0).toLocaleString('pt-BR')} />
        <StatTile icon={<TargetIcon />} iconColor="green" label="Taxa de acerto" value={`${usuario.taxa_acerto ?? 0}%`} />
        <StatTile icon={<ClockIcon />} iconColor="blue" label="Tempo de estudo" value={`${Math.floor((usuario.tempo_estudo_min ?? 0) / 60)}h ${(usuario.tempo_estudo_min ?? 0) % 60}m`} />
        <StatTile icon={<ClipboardIcon />} iconColor="purple" label="Listas concluídas" value={usuario.listas_concluidas ?? 0} />
        <StatTile icon={<FileTextIcon />} iconColor="blue" label="Provas realizadas" value={usuario.provas_realizadas ?? 0} />
        <StatTile icon={<TrophyIcon />} iconColor="red" label="Ranking geral" value={`#${usuario.ranking_geral ?? 0}`} />
      </div>

      <AreaLineChart title="Ofensiva nos últimos 90 dias" data={ofensivaHistorico.map((ponto) => ({ label: ponto.data, value: ponto.ofensiva }))} valueSuffix=" dias" />

      <div className={styles.tabsWrapper}>
        <UnderlineTabs options={TABS} value={aba} onChange={setAba} />

        {aba === 'visao-geral' && (
          <CardDiv>
            <p className={styles.emptyState}>Selecione outra aba para ver mais detalhes deste usuário.</p>
          </CardDiv>
        )}

        {aba === 'conquistas' && (
          conquistas.length > 0 ? (
            <div className={styles.achievementsGrid}>
              {conquistas.map((conquista) => (
                <AchievementCard
                  key={conquista.id}
                  icon={conquista.icone}
                  title={conquista.nome}
                  description={`Conquistado em ${conquista.conquistada_em}`}
                  rarity="raro"
                />
              ))}
            </div>
          ) : (
            <CardDiv>
              <p className={styles.emptyState}>Nenhuma conquista obtida ainda.</p>
            </CardDiv>
          )
        )}

        {aba === 'historico' && (
          <>
            <CardDiv>
              {historico.length > 0 ? (
                <UserHistoryList itens={historico} />
              ) : (
                <p className={styles.emptyState}>Nenhum registro de histórico.</p>
              )}
            </CardDiv>
            {historicoTotalPaginas > 1 && (
              <div className={styles.footer}>
                <span className={styles.footerText}>Página {historicoPagina} de {historicoTotalPaginas}</span>
                <Pagination page={historicoPagina} totalPages={historicoTotalPaginas} onChange={setHistoricoPagina} />
              </div>
            )}
          </>
        )}

        {aba === 'medidas' && (
          <CardDiv>
            {medidas.length > 0 ? (
              <AdminMeasureTable medidas={medidas} />
            ) : (
              <p className={styles.emptyState}>Nenhuma medida administrativa registrada.</p>
            )}
          </CardDiv>
        )}

        {aba === 'timeline' && (
          <CardDiv>
            {timeline.length > 0 ? (
              <UserTimelineList eventos={timeline} />
            ) : (
              <p className={styles.emptyState}>Nenhum evento registrado.</p>
            )}
          </CardDiv>
        )}
      </div>

      <CardDiv>
        <p className={styles.quickActionsTitle}>Ações rápidas</p>
        <div className={styles.quickActions}>
          {usuario.status === 'ativo' ? (
            <>
              <button type="button" className={`${styles.quickActionButton} ${styles['quickActionButton--red']}`} onClick={() => setSuspendendo(true)}>
                <AlertCircleIcon /> Suspender usuário
              </button>
              <button type="button" className={`${styles.quickActionButton} ${styles['quickActionButton--red']}`} onClick={() => setBanindo(true)}>
                <XIcon /> Banir usuário
              </button>
            </>
          ) : (
            <button type="button" className={`${styles.quickActionButton} ${styles['quickActionButton--green']}`} onClick={() => setReativando(true)}>
              <CheckCircleIcon /> Reativar usuário
            </button>
          )}
          <button type="button" className={`${styles.quickActionButton} ${styles['quickActionButton--gold']}`} onClick={() => setResetandoOfensiva(true)}>
            <FireIcon /> Resetar ofensiva
          </button>
          <button type="button" className={`${styles.quickActionButton} ${styles['quickActionButton--blue']}`} onClick={() => setResetandoSenha(true)}>
            <LockIcon /> Resetar senha
          </button>
          <button type="button" className={`${styles.quickActionButton} ${styles['quickActionButton--purple']}`} onClick={() => setEditando(true)}>
            <PencilIcon /> Alterar cargo
          </button>
        </div>
      </CardDiv>

      {editando && (
        <EditUserModal usuario={usuario} salvando={processando} onConfirm={handleSalvarEdicao} onClose={() => setEditando(false)} />
      )}

      {suspendendo && (
        <SuspensionModal nome={usuario.nome} enviando={processando} onConfirm={handleConfirmarSuspensao} onClose={() => setSuspendendo(false)} />
      )}

      {banindo && (
        <BanModal nome={usuario.nome} enviando={processando} onConfirm={handleConfirmarBanimento} onClose={() => setBanindo(false)} />
      )}

      {reativando && (
        <ConfirmDialog
          title="Reativar usuário"
          description={`Tem certeza que deseja reativar ${usuario.nome}?`}
          confirmLabel="Reativar"
          confirmando={processando}
          onConfirm={handleConfirmarReativacao}
          onClose={() => setReativando(false)}
        />
      )}

      {resetandoSenha && (
        <ConfirmDialog
          title="Resetar senha"
          description={`Um email de redefinição de senha será enviado para ${usuario.nome}. Confirmar?`}
          confirmLabel="Resetar senha"
          confirmando={processando}
          onConfirm={handleConfirmarResetSenha}
          onClose={() => setResetandoSenha(false)}
        />
      )}

      {resetandoOfensiva && (
        <ConfirmDialog
          title="Resetar ofensiva"
          description={`A ofensiva atual de ${usuario.nome} será zerada. Confirmar?`}
          confirmLabel="Resetar ofensiva"
          confirmando={processando}
          onConfirm={handleConfirmarResetOfensiva}
          onClose={() => setResetandoOfensiva(false)}
        />
      )}
    </div>
  )
}
