import { useEffect, useState } from 'react'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { FilterChip } from '../../components/ui/FilterChip'
import { SelectField } from '../../components/ui/SelectField'
import { Pagination } from '../../components/ui/Pagination'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { AdminStatCard } from '../../components/cards/AdminStatCard'
import { UsersTable } from '../../components/cards/UsersTable'
import { UserDetailPanel } from '../../components/cards/UserDetailPanel'
import { SuspensionModal } from '../../components/cards/SuspensionModal'
import { BanModal } from '../../components/cards/BanModal'
import { NewUserModal } from '../../components/cards/NewUserModal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import { AreaLineChart } from '../../components/charts/AreaLineChart'
import { DonutChart } from '../../components/charts/DonutChart'
import type { DonutChartSlice } from '../../components/charts/DonutChart'
import { UsersIcon, UserIcon, FireIcon, AlertCircleIcon, SearchIcon, PlusIcon } from '../../components/ui/icons'
import styles from './AdminUsuariosLista.module.css'

import { getUsuarios, postUsuario, suspenderUsuario, banirUsuario, reativarUsuario, resetarSenha, resetarOfensiva } from '../../services/usuarios'
import type { UsuarioResumo, UsuarioCargo, UsuarioStatus } from '../../types/usuarios'

const ITENS_POR_PAGINA = 8

const CARGO_FILTERS: { value: UsuarioCargo | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos os cargos' },
  { value: 'aluno', label: 'Aluno' },
  { value: 'moderador', label: 'Moderador' },
  { value: 'editor', label: 'Editor' },
  { value: 'administrador', label: 'Administrador' },
]

const STATUS_FILTERS: { value: UsuarioStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'suspenso', label: 'Suspenso' },
  { value: 'banido', label: 'Banido' },
]

export function AdminUsuariosLista() {
  const [busca, setBusca] = useState('')
  const [cargo, setCargo] = useState<UsuarioCargo | 'todos'>('todos')
  const [status, setStatus] = useState<UsuarioStatus | 'todos'>('todos')
  const [ordenacao, setOrdenacao] = useState('nome-az')
  const [pagina, setPagina] = useState(1)

  const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [totalAtivos, setTotalAtivos] = useState(0)
  const [totalSuspensos, setTotalSuspensos] = useState(0)
  const [ofensivaMedia, setOfensivaMedia] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  const [usuarioParaSuspender, setUsuarioParaSuspender] = useState<UsuarioResumo | null>(null)
  const [usuarioParaBanir, setUsuarioParaBanir] = useState<UsuarioResumo | null>(null)
  const [usuarioParaReativar, setUsuarioParaReativar] = useState<UsuarioResumo | null>(null)
  const [usuarioParaResetarSenha, setUsuarioParaResetarSenha] = useState<UsuarioResumo | null>(null)
  const [usuarioParaResetarOfensiva, setUsuarioParaResetarOfensiva] = useState<UsuarioResumo | null>(null)
  const [usuarioParaCriar, setUsuarioParaCriar] = useState(false)
  const [processando, setProcessando] = useState(false)

  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState<string | null>(null)
  const [abrirEdicaoAoSelecionar, setAbrirEdicaoAoSelecionar] = useState(false)

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [novoUsuarioModalKey, setNovoUsuarioModalKey] = useState(0)

  async function carregarUsuarios() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getUsuarios({
        busca: busca.trim() || undefined,
        cargo: cargo === 'todos' ? undefined : cargo,
        status: status === 'todos' ? undefined : status,
        ordenar: ordenacao as 'nome-az' | 'nome-za' | 'recentes' | 'xp-desc' | 'ofensiva-desc',
        pagina,
        limite: ITENS_POR_PAGINA,
      })

      setUsuarios(resposta.usuarios ?? [])
      setTotalPaginas(resposta.total_paginas || 1)
      setTotalUsuarios(resposta.total_usuarios ?? 0)
      setTotalAtivos(resposta.total_ativos ?? 0)
      setTotalSuspensos(resposta.total_suspensos ?? 0)
      setOfensivaMedia(resposta.ofensiva_media ?? 0)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, cargo, status, ordenacao, pagina])

  async function handleConfirmarSuspensao(motivo: string, duracaoDias: number) {
    if (!usuarioParaSuspender) return
    setProcessando(true)
    try {
      await suspenderUsuario(usuarioParaSuspender.id, { motivo, duracao_dias: duracaoDias })
      setUsuarioParaSuspender(null)
      carregarUsuarios()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarBanimento(motivo: string) {
    if (!usuarioParaBanir) return
    setProcessando(true)
    try {
      await banirUsuario(usuarioParaBanir.id, { motivo })
      setUsuarioParaBanir(null)
      carregarUsuarios()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarReativacao() {
    if (!usuarioParaReativar) return
    setProcessando(true)
    try {
      await reativarUsuario(usuarioParaReativar.id)
      setUsuarioParaReativar(null)
      carregarUsuarios()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarResetSenha() {
    if (!usuarioParaResetarSenha) return
    setProcessando(true)
    try {
      await resetarSenha(usuarioParaResetarSenha.id)
      setUsuarioParaResetarSenha(null)
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  async function handleConfirmarCriacao(nome: string, email: string, cargo: UsuarioCargo) {
    setProcessando(true)
    try {
      await postUsuario({ nome, email, cargo })
      setUsuarioParaCriar(false)
      setNovoUsuarioModalKey((key) => key + 1)
      setToast({ type: 'success', message: 'Usuário criado com sucesso.' })
      carregarUsuarios()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível criar o usuário.'
      setToast({ type: 'error', message })
    } finally {
      setProcessando(false)
    }
  }

  const statusSlices: DonutChartSlice[] = (() => {
    const totalListado = usuarios.length || 1
    const ativos = usuarios.filter((usuario) => usuario.status === 'ativo').length
    const suspensos = usuarios.filter((usuario) => usuario.status === 'suspenso').length
    const banidos = usuarios.filter((usuario) => usuario.status === 'banido').length

    return [
      { label: 'Ativos', value: ativos, percentual: (ativos / totalListado) * 100, color: 'teal' },
      { label: 'Suspensos', value: suspensos, percentual: (suspensos / totalListado) * 100, color: 'gold' },
      { label: 'Banidos', value: banidos, percentual: (banidos / totalListado) * 100, color: 'red' },
    ]
  })()

  async function handleConfirmarResetOfensiva() {
    if (!usuarioParaResetarOfensiva) return
    setProcessando(true)
    try {
      await resetarOfensiva(usuarioParaResetarOfensiva.id)
      setUsuarioParaResetarOfensiva(null)
      carregarUsuarios()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Usuários' }]} />

        <div className={styles.header}>
          <TitlePage title="Usuários" subtitle="Gerencie os usuários da plataforma" />

          <Button fullWidth={false} icon={<PlusIcon />} iconPosition="left" onClick={() => setUsuarioParaCriar(true)}>
            Novo Usuário
          </Button>
        </div>

        <div className={styles.statsRow}>
          <AdminStatCard icon={<UsersIcon />} iconColor="purple" label="Total de usuários" value={(totalUsuarios ?? 0).toLocaleString('pt-BR')} />
          <AdminStatCard icon={<UserIcon />} iconColor="green" label="Usuários ativos" value={(totalAtivos ?? 0).toLocaleString('pt-BR')} />
          <AdminStatCard icon={<FireIcon />} iconColor="gold" label="Ofensiva média" value={`${ofensivaMedia ?? 0} dias`} />
          <AdminStatCard icon={<AlertCircleIcon />} iconColor="red" label="Usuários suspensos" value={(totalSuspensos ?? 0).toLocaleString('pt-BR')} />
        </div>

        <CardDiv>
          <div className={styles.searchRow}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar usuário por nome ou email..."
              aria-label="Buscar usuário"
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value)
                setPagina(1)
              }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Cargo</span>
              <div className={styles.chips}>
                {CARGO_FILTERS.map((item) => (
                  <FilterChip
                    key={item.value}
                    label={item.label}
                    selected={item.value === cargo}
                    onClick={() => {
                      setCargo(item.value)
                      setPagina(1)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Status</span>
              <div className={styles.chips}>
                {STATUS_FILTERS.map((item) => (
                  <FilterChip
                    key={item.value}
                    label={item.label}
                    selected={item.value === status}
                    onClick={() => {
                      setStatus(item.value)
                      setPagina(1)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.sortGroup}>
              <SelectField id="ordenar-usuarios" label="Ordenar por" value={ordenacao} onChange={(event) => setOrdenacao(event.target.value)}>
                <option value="nome-az">Nome (A-Z)</option>
                <option value="nome-za">Nome (Z-A)</option>
                <option value="recentes">Mais recentes</option>
                <option value="xp-desc">Maior XP</option>
                <option value="ofensiva-desc">Maior ofensiva</option>
              </SelectField>
            </div>
          </div>
        </CardDiv>

        <div className={usuarioSelecionadoId ? styles.splitLayout : undefined}>
          <div className={usuarioSelecionadoId ? styles.tableColumn : undefined}>
            {carregando ? (
              <CardDiv>
                <p className={styles.emptyState}>Carregando usuários...</p>
              </CardDiv>
            ) : erro ? (
              <CardDiv>
                <p className={styles.emptyState}>Não foi possível carregar os usuários.</p>
                <div className={styles.retryRow}>
                  <Button fullWidth={false} onClick={carregarUsuarios}>
                    Tentar novamente
                  </Button>
                </div>
              </CardDiv>
            ) : usuarios.length > 0 ? (
              <CardDiv>
                <UsersTable
                  usuarios={usuarios}
                  onVisualizar={(usuario) => {
                    setAbrirEdicaoAoSelecionar(false)
                    setUsuarioSelecionadoId(usuario.id)
                  }}
                  onEditar={(usuario) => {
                    setAbrirEdicaoAoSelecionar(true)
                    setUsuarioSelecionadoId(usuario.id)
                  }}
                  onSuspender={setUsuarioParaSuspender}
                  onBanir={setUsuarioParaBanir}
                  onReativar={setUsuarioParaReativar}
                  onResetarSenha={setUsuarioParaResetarSenha}
                  onResetarOfensiva={setUsuarioParaResetarOfensiva}
                />
              </CardDiv>
            ) : (
              <CardDiv>
                <p className={styles.emptyState}>Nenhum usuário encontrado para os filtros selecionados.</p>
              </CardDiv>
            )}

            <div className={styles.footer}>
              <span className={styles.footerText}>
                Mostrando {usuarios.length} de {totalUsuarios} usuários
              </span>
              <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
            </div>
          </div>

          {usuarioSelecionadoId && (
            <UserDetailPanel
              usuarioId={usuarioSelecionadoId}
              editarAoAbrir={abrirEdicaoAoSelecionar}
              onVoltar={() => setUsuarioSelecionadoId(null)}
              onUsuarioAtualizado={carregarUsuarios}
            />
          )}
        </div>

        {!usuarioSelecionadoId && usuarios.length > 0 && (
          <div className={styles.insightsRow}>
            <AreaLineChart
              title="Ofensiva dos usuários nesta página"
              data={usuarios.map((usuario) => ({ label: usuario.nome.split(' ')[0], value: usuario.ofensiva_atual ?? 0 }))}
              valueSuffix=" dias"
            />
            <DonutChart
              title="Status dos usuários nesta página"
              slices={statusSlices}
              centerLabel="usuários"
              centerValue={String(usuarios.length)}
            />
          </div>
        )}
      </div>

      {usuarioParaSuspender && (
        <SuspensionModal
          nome={usuarioParaSuspender.nome}
          enviando={processando}
          onConfirm={handleConfirmarSuspensao}
          onClose={() => setUsuarioParaSuspender(null)}
        />
      )}

      {usuarioParaBanir && (
        <BanModal nome={usuarioParaBanir.nome} enviando={processando} onConfirm={handleConfirmarBanimento} onClose={() => setUsuarioParaBanir(null)} />
      )}

      {usuarioParaReativar && (
        <ConfirmDialog
          title="Reativar usuário"
          description={`Tem certeza que deseja reativar ${usuarioParaReativar.nome}?`}
          confirmLabel="Reativar"
          confirmando={processando}
          onConfirm={handleConfirmarReativacao}
          onClose={() => setUsuarioParaReativar(null)}
        />
      )}

      {usuarioParaResetarSenha && (
        <ConfirmDialog
          title="Resetar senha"
          description={`Um email de redefinição de senha será enviado para ${usuarioParaResetarSenha.nome}. Confirmar?`}
          confirmLabel="Resetar senha"
          confirmando={processando}
          onConfirm={handleConfirmarResetSenha}
          onClose={() => setUsuarioParaResetarSenha(null)}
        />
      )}

      {usuarioParaResetarOfensiva && (
        <ConfirmDialog
          title="Resetar ofensiva"
          description={`A ofensiva atual de ${usuarioParaResetarOfensiva.nome} será zerada. Confirmar?`}
          confirmLabel="Resetar ofensiva"
          confirmando={processando}
          onConfirm={handleConfirmarResetOfensiva}
          onClose={() => setUsuarioParaResetarOfensiva(null)}
        />
      )}

      {usuarioParaCriar && (
        <NewUserModal
          key={novoUsuarioModalKey}
          criando={processando}
          onConfirm={handleConfirmarCriacao}
          onClose={() => setUsuarioParaCriar(false)}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </AdminPageLayout>
  )
}
