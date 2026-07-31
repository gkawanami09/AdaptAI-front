import { useEffect, useState } from 'react'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { UnderlineTabs } from '../../components/ui/UnderlineTabs'
import { TextField } from '../../components/ui/TextField'
import { SelectField } from '../../components/ui/SelectField'
import { FilterChip } from '../../components/ui/FilterChip'
import { Pagination } from '../../components/ui/Pagination'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { SettingsSection } from '../../components/cards/SettingsSection'
import { SettingsToggleRow } from '../../components/cards/SettingsToggleRow'
import { PermissionTable } from '../../components/cards/PermissionTable'
import { IntegrationCard } from '../../components/cards/IntegrationCard'
import { ApiKeyInput } from '../../components/cards/ApiKeyInput'
import { SaveBar } from '../../components/layout/SaveBar'
import {
  BoltIcon,
  GoogleIcon,
  SearchIcon,
  SparklesIcon,
} from '../../components/ui/icons'
import styles from './AdminConfiguracoes.module.css'

import {
  getConfiguracoesAutenticacao,
  getConfiguracoesConteudo,
  getConfiguracoesGerais,
  getConfiguracoesIa,
  getConfiguracoesNotificacoes,
  getIntegracoes,
  getUsuariosAdmin,
  patchConfiguracoesAutenticacao,
  patchConfiguracoesConteudo,
  patchConfiguracoesGerais,
  patchConfiguracoesIa,
  patchConfiguracoesNotificacoes,
  patchIntegracao,
  patchUsuarioAdmin,
  postTestarIa,
} from '../../services/configuracoes'
import type {
  ConfiguracoesAutenticacao,
  ConfiguracoesConteudo,
  ConfiguracoesGerais,
  ConfiguracoesIa,
  ConfiguracoesNotificacoes,
  Integracao,
  PostTestarIaResponse,
  UsuarioAdmin,
  UsuarioAdminCargo,
  UsuarioAdminStatus,
} from '../../types/configuracoes'

const ITENS_POR_PAGINA = 8

const TABS = [
  { value: 'geral', label: 'Geral' },
  { value: 'usuarios', label: 'Usuários e Permissões' },
  { value: 'autenticacao', label: 'Autenticação' },
  { value: 'conteudo', label: 'Conteúdo' },
  { value: 'ia', label: 'IA' },
  { value: 'notificacoes', label: 'Notificações' },
  { value: 'integracoes', label: 'Integrações' },
]

const CARGO_FILTERS: { value: UsuarioAdminCargo | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'suporte', label: 'Suporte' },
  { value: 'aluno', label: 'Aluno' },
]

const STATUS_FILTERS: { value: UsuarioAdminStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativo', label: 'Ativos' },
  { value: 'inativo', label: 'Inativos' },
]

const INTEGRACOES_ICON: Record<string, { icon: React.ReactNode; color: 'purple' | 'green' | 'blue' | 'gold' | 'red' }> = {
  openai: { icon: <SparklesIcon />, color: 'green' },
  google: { icon: <GoogleIcon />, color: 'blue' },
  microsoft: { icon: <BoltIcon />, color: 'purple' },
  supabase: { icon: <BoltIcon />, color: 'gold' },
  sentry: { icon: <BoltIcon />, color: 'red' },
  slack: { icon: <BoltIcon />, color: 'purple' },
}

export function AdminConfiguracoes() {
  const [tab, setTab] = useState('geral')

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Configurações' }]} />

        <div className={styles.header}>
          <TitlePage title="Configurações" subtitle="Gerencie as configurações da plataforma." />
        </div>

        <div className={styles.tabsRow}>
          <UnderlineTabs options={TABS} value={tab} onChange={setTab} />
        </div>

        {tab === 'geral' && <TabGeral />}
        {tab === 'usuarios' && <TabUsuarios />}
        {tab === 'autenticacao' && <TabAutenticacao />}
        {tab === 'conteudo' && <TabConteudo />}
        {tab === 'ia' && <TabIa />}
        {tab === 'notificacoes' && <TabNotificacoes />}
        {tab === 'integracoes' && <TabIntegracoes />}
      </div>
    </AdminPageLayout>
  )
}

function TabGeral() {
  const [config, setConfig] = useState<ConfiguracoesGerais | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getConfiguracoesGerais()
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSalvar() {
    if (!config) return
    setSalvando(true)
    try {
      const resposta = await patchConfiguracoesGerais(config)
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando configurações...</p>
      </CardDiv>
    )
  }

  if (erro || !config) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar as configurações.</p>
        <div className={styles.retryRow}>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      </CardDiv>
    )
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionsRow}>
        <SettingsSection title="Informações da Plataforma" description="Dados básicos da plataforma exibidos para os usuários.">
          <TextField
            id="nome-plataforma"
            label="Nome da Plataforma"
            value={config.nome_plataforma}
            onChange={(event) => setConfig({ ...config, nome_plataforma: event.target.value })}
          />
          <TextField
            id="slogan"
            label="Slogan"
            value={config.slogan}
            onChange={(event) => setConfig({ ...config, slogan: event.target.value })}
          />
          <label className={styles.textareaField}>
            <span>Descrição</span>
            <textarea
              rows={3}
              value={config.descricao}
              onChange={(event) => setConfig({ ...config, descricao: event.target.value })}
            />
          </label>
        </SettingsSection>

        <SettingsSection title="Aparência e Branding" description="Personalize a identidade visual da plataforma.">
          <div className={styles.fieldGroup}>
            <span>Logo da Plataforma</span>
            <div className={styles.logoRow}>
              <span className={styles.logoPreview}>
                <BoltIcon />
              </span>
              <div className={styles.logoActions}>
                <Button type="button" variant="outline" fullWidth={false} size="sm">
                  Alterar Logo
                </Button>
                <Button type="button" variant="outline" fullWidth={false} size="sm">
                  Remover
                </Button>
              </div>
            </div>
          </div>

          <SelectField
            id="tema"
            label="Modo Padrão"
            value={config.tema}
            onChange={(event) => setConfig({ ...config, tema: event.target.value as ConfiguracoesGerais['tema'] })}
          >
            <option value="claro">Claro</option>
            <option value="escuro">Escuro</option>
            <option value="sistema">Sistema</option>
          </SelectField>
        </SettingsSection>

        <SettingsSection title="Configurações de Data e Hora" description="Defina o fuso horário e formato de exibição.">
          <SelectField
            id="timezone"
            label="Fuso Horário"
            value={config.timezone}
            onChange={(event) => setConfig({ ...config, timezone: event.target.value })}
          >
            <option value="America/Sao_Paulo">America/Sao_Paulo</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/Lisbon">Europe/Lisbon</option>
          </SelectField>

          <SelectField
            id="formato-data"
            label="Formato de Data"
            value={config.formato_data}
            onChange={(event) => setConfig({ ...config, formato_data: event.target.value })}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </SelectField>

          <SelectField
            id="idioma"
            label="Idioma"
            value={config.idioma}
            onChange={(event) => setConfig({ ...config, idioma: event.target.value })}
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </SelectField>
        </SettingsSection>
      </div>

      <SaveBar salvando={salvando} onSave={handleSalvar} />
    </div>
  )
}

function TabUsuarios() {
  const [busca, setBusca] = useState('')
  const [cargo, setCargo] = useState<UsuarioAdminCargo | 'todos'>('todos')
  const [status, setStatus] = useState<UsuarioAdminStatus | 'todos'>('todos')
  const [pagina, setPagina] = useState(1)

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getUsuariosAdmin({
        busca: busca.trim() || undefined,
        cargo: cargo === 'todos' ? undefined : cargo,
        status: status === 'todos' ? undefined : status,
        pagina,
        limite: ITENS_POR_PAGINA,
      })
      setUsuarios(resposta.usuarios)
      setTotalPaginas(resposta.total_paginas || 1)
      setTotalRegistros(resposta.total_registros)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, cargo, status, pagina])

  async function handleAlterarCargo(usuario: UsuarioAdmin, novoCargo: UsuarioAdminCargo) {
    try {
      await patchUsuarioAdmin(usuario.id, { cargo: novoCargo })
      carregar()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAlterarStatus(usuario: UsuarioAdmin, ativo: boolean) {
    try {
      await patchUsuarioAdmin(usuario.id, { status: ativo ? 'ativo' : 'inativo' })
      carregar()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.tabContent}>
      <CardDiv>
        <div className={styles.searchRow}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Buscar usuário..."
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
        </div>
      </CardDiv>

      {carregando ? (
        <CardDiv>
          <p className={styles.emptyState}>Carregando usuários...</p>
        </CardDiv>
      ) : erro ? (
        <CardDiv>
          <p className={styles.emptyState}>Não foi possível carregar os usuários.</p>
          <div className={styles.retryRow}>
            <Button fullWidth={false} onClick={carregar}>
              Tentar novamente
            </Button>
          </div>
        </CardDiv>
      ) : usuarios.length > 0 ? (
        <CardDiv>
          <PermissionTable usuarios={usuarios} onAlterarCargo={handleAlterarCargo} onAlterarStatus={handleAlterarStatus} />

          <div className={styles.footer}>
            <span className={styles.footerText}>
              Mostrando {usuarios.length} de {totalRegistros} usuários
            </span>
            <Pagination page={pagina} totalPages={totalPaginas} onChange={setPagina} />
          </div>
        </CardDiv>
      ) : (
        <CardDiv>
          <p className={styles.emptyState}>Nenhum usuário encontrado para os filtros selecionados.</p>
        </CardDiv>
      )}
    </div>
  )
}

function TabAutenticacao() {
  const [config, setConfig] = useState<ConfiguracoesAutenticacao | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getConfiguracoesAutenticacao()
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSalvar() {
    if (!config) return
    setSalvando(true)
    try {
      const resposta = await patchConfiguracoesAutenticacao(config)
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando configurações...</p>
      </CardDiv>
    )
  }

  if (erro || !config) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar as configurações.</p>
        <div className={styles.retryRow}>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      </CardDiv>
    )
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionsRow}>
        <SettingsSection title="Acesso e Autenticação" description="Configurações de segurança da plataforma.">
          <TextField
            id="tempo-sessao"
            label="Expiração da sessão (minutos)"
            type="number"
            value={config.tempo_sessao_min}
            onChange={(event) => setConfig({ ...config, tempo_sessao_min: Number(event.target.value) })}
          />

          <SettingsToggleRow
            label="Login por Google"
            checked={config.login_google_ativo}
            onChange={(checked) => setConfig({ ...config, login_google_ativo: checked })}
          />
          <SettingsToggleRow
            label="Login por Microsoft"
            checked={config.login_microsoft_ativo}
            onChange={(checked) => setConfig({ ...config, login_microsoft_ativo: checked })}
          />
          <SettingsToggleRow
            label="Autenticação em dois fatores"
            checked={config.autenticacao_dois_fatores_ativo}
            onChange={(checked) => setConfig({ ...config, autenticacao_dois_fatores_ativo: checked })}
          />
          <SettingsToggleRow
            label="Reset de senha habilitado"
            checked={config.reset_senha_ativo}
            onChange={(checked) => setConfig({ ...config, reset_senha_ativo: checked })}
          />
        </SettingsSection>

        <SettingsSection title="Políticas de Senha" description="Defina os requisitos de senha dos usuários.">
          <TextField
            id="senha-tamanho-minimo"
            label="Tamanho mínimo"
            type="number"
            value={config.senha_tamanho_minimo}
            onChange={(event) => setConfig({ ...config, senha_tamanho_minimo: Number(event.target.value) })}
          />
          <SettingsToggleRow
            label="Exigir número"
            checked={config.senha_exigir_numero}
            onChange={(checked) => setConfig({ ...config, senha_exigir_numero: checked })}
          />
          <SettingsToggleRow
            label="Exigir letra maiúscula"
            checked={config.senha_exigir_maiuscula}
            onChange={(checked) => setConfig({ ...config, senha_exigir_maiuscula: checked })}
          />
          <SettingsToggleRow
            label="Exigir caractere especial"
            checked={config.senha_exigir_caractere_especial}
            onChange={(checked) => setConfig({ ...config, senha_exigir_caractere_especial: checked })}
          />
        </SettingsSection>
      </div>

      <SaveBar salvando={salvando} onSave={handleSalvar} />
    </div>
  )
}

function TabConteudo() {
  const [config, setConfig] = useState<ConfiguracoesConteudo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getConfiguracoesConteudo()
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSalvar() {
    if (!config) return
    setSalvando(true)
    try {
      const resposta = await patchConfiguracoesConteudo(config)
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando configurações...</p>
      </CardDiv>
    )
  }

  if (erro || !config) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar as configurações.</p>
        <div className={styles.retryRow}>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      </CardDiv>
    )
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionsRow}>
        <SettingsSection title="Padrões de Questões" description="Parâmetros padrão para criação de questões.">
          <TextField
            id="itens-por-pagina"
            label="Quantidade padrão por página"
            type="number"
            value={config.itens_por_pagina}
            onChange={(event) => setConfig({ ...config, itens_por_pagina: Number(event.target.value) })}
          />

          <SelectField
            id="editor-padrao"
            label="Editor padrão"
            value={config.editor_padrao}
            onChange={(event) => setConfig({ ...config, editor_padrao: event.target.value as ConfiguracoesConteudo['editor_padrao'] })}
          >
            <option value="markdown">Markdown</option>
            <option value="rich-text">Rich Text</option>
          </SelectField>
        </SettingsSection>

        <SettingsSection title="Uploads" description="Configurações de envio de arquivos.">
          <TextField
            id="tamanho-maximo-upload"
            label="Tamanho máximo de arquivo (MB)"
            type="number"
            value={config.tamanho_maximo_upload_mb}
            onChange={(event) => setConfig({ ...config, tamanho_maximo_upload_mb: Number(event.target.value) })}
          />

          <TextField
            id="tipos-arquivo"
            label="Formatos permitidos (separados por vírgula)"
            value={config.tipos_arquivo_permitidos.join(', ')}
            onChange={(event) =>
              setConfig({
                ...config,
                tipos_arquivo_permitidos: event.target.value.split(',').map((tipo) => tipo.trim()).filter(Boolean),
              })
            }
          />
        </SettingsSection>

        <SettingsSection title="Auto Salvamento" description="Configurações de salvamento automático do editor.">
          <SettingsToggleRow
            label="Auto salvamento ativo"
            checked={config.auto_salvamento_ativo}
            onChange={(checked) => setConfig({ ...config, auto_salvamento_ativo: checked })}
          />
          <TextField
            id="auto-salvamento-intervalo"
            label="Intervalo de salvamento (segundos)"
            type="number"
            value={config.auto_salvamento_intervalo_seg}
            onChange={(event) => setConfig({ ...config, auto_salvamento_intervalo_seg: Number(event.target.value) })}
            disabled={!config.auto_salvamento_ativo}
          />
        </SettingsSection>
      </div>

      <SaveBar salvando={salvando} onSave={handleSalvar} />
    </div>
  )
}

function TabIa() {
  const [config, setConfig] = useState<ConfiguracoesIa | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  const [promptTeste, setPromptTeste] = useState('')
  const [testando, setTestando] = useState(false)
  const [resultadoTeste, setResultadoTeste] = useState<PostTestarIaResponse | null>(null)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getConfiguracoesIa()
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSalvar() {
    if (!config) return
    setSalvando(true)
    try {
      const resposta = await patchConfiguracoesIa(config)
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  async function handleTestar() {
    if (!config) return
    setTestando(true)
    setResultadoTeste(null)
    try {
      const resposta = await postTestarIa({
        modelo: config.modelo,
        temperatura: config.temperatura,
        max_tokens: config.max_tokens,
        prompt_base: config.prompt_base,
        prompt_teste: promptTeste,
      })
      setResultadoTeste(resposta)
    } catch (err) {
      console.error(err)
    } finally {
      setTestando(false)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando configurações...</p>
      </CardDiv>
    )
  }

  if (erro || !config) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar as configurações.</p>
        <div className={styles.retryRow}>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      </CardDiv>
    )
  }

  return (
    <div className={styles.tabContent}>
      <SettingsSection title="Configuração da Inteligência Artificial" description="Parâmetros usados nas gerações de IA da plataforma.">
        <div className={styles.grid}>
          <SelectField
            id="ia-modelo"
            label="Modelo utilizado"
            value={config.modelo}
            onChange={(event) => setConfig({ ...config, modelo: event.target.value })}
          >
            <option value="claude-sonnet-5">Claude Sonnet 5</option>
            <option value="claude-opus-5">Claude Opus 5</option>
            <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
          </SelectField>

          <TextField
            id="ia-temperatura"
            label="Temperatura"
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={config.temperatura}
            onChange={(event) => setConfig({ ...config, temperatura: Number(event.target.value) })}
          />

          <TextField
            id="ia-max-tokens"
            label="Máximo de Tokens"
            type="number"
            value={config.max_tokens}
            onChange={(event) => setConfig({ ...config, max_tokens: Number(event.target.value) })}
          />

          <TextField
            id="ia-limite-geracoes"
            label="Limite de gerações por dia"
            type="number"
            value={config.limite_geracoes_dia}
            onChange={(event) => setConfig({ ...config, limite_geracoes_dia: Number(event.target.value) })}
          />
        </div>

        <label className={styles.textareaField}>
          <span>Prompt Base</span>
          <textarea
            rows={5}
            value={config.prompt_base}
            onChange={(event) => setConfig({ ...config, prompt_base: event.target.value })}
          />
        </label>
      </SettingsSection>

      <SettingsSection title="Testar Configuração" description="Envie um prompt de teste usando os parâmetros acima.">
        <label className={styles.textareaField}>
          <span>Prompt de teste</span>
          <textarea
            rows={3}
            placeholder="Digite um prompt para testar a configuração..."
            value={promptTeste}
            onChange={(event) => setPromptTeste(event.target.value)}
          />
        </label>

        <div>
          <Button fullWidth={false} icon={<SparklesIcon />} iconPosition="left" onClick={handleTestar} disabled={testando || !promptTeste.trim()}>
            {testando ? 'Testando...' : 'Testar Configuração'}
          </Button>
        </div>

        {resultadoTeste && (
          <div className={styles.testResult}>
            {resultadoTeste.resposta}
            <div className={styles.testMeta}>
              <span>{resultadoTeste.tokens_utilizados} tokens</span>
              <span>{resultadoTeste.tempo_resposta_ms}ms</span>
            </div>
          </div>
        )}
      </SettingsSection>

      <SaveBar salvando={salvando} onSave={handleSalvar} />
    </div>
  )
}

function TabNotificacoes() {
  const [config, setConfig] = useState<ConfiguracoesNotificacoes | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getConfiguracoesNotificacoes()
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleSalvar() {
    if (!config) return
    setSalvando(true)
    try {
      const resposta = await patchConfiguracoesNotificacoes(config)
      setConfig(resposta.configuracoes)
    } catch (err) {
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando configurações...</p>
      </CardDiv>
    )
  }

  if (erro || !config) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar as configurações.</p>
        <div className={styles.retryRow}>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      </CardDiv>
    )
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionsRow}>
        <SettingsSection title="Canais de Notificação" description="Defina os canais utilizados para as notificações.">
          <SettingsToggleRow
            label="Notificações por e-mail"
            checked={config.email_ativo}
            onChange={(checked) => setConfig({ ...config, email_ativo: checked })}
          />
          <SettingsToggleRow
            label="Notificações no sistema"
            checked={config.alertas_internos_ativo}
            onChange={(checked) => setConfig({ ...config, alertas_internos_ativo: checked })}
          />
          <SettingsToggleRow
            label="Notificações push"
            checked={config.push_ativo}
            onChange={(checked) => setConfig({ ...config, push_ativo: checked })}
          />
          <SettingsToggleRow
            label="Resumo diário por e-mail"
            checked={config.resumo_diario_email}
            onChange={(checked) => setConfig({ ...config, resumo_diario_email: checked })}
          />
          <SettingsToggleRow
            label="Resumo semanal por e-mail"
            checked={config.resumo_semanal_email}
            onChange={(checked) => setConfig({ ...config, resumo_semanal_email: checked })}
          />
        </SettingsSection>

        <SettingsSection title="Eventos" description="Selecione quais eventos devem gerar notificações.">
          <SettingsToggleRow
            label="Novo usuário cadastrado"
            checked={config.evento_novo_usuario}
            onChange={(checked) => setConfig({ ...config, evento_novo_usuario: checked })}
          />
          <SettingsToggleRow
            label="Questão criada"
            checked={config.evento_questao_criada}
            onChange={(checked) => setConfig({ ...config, evento_questao_criada: checked })}
          />
          <SettingsToggleRow
            label="Questão editada"
            checked={config.evento_questao_editada}
            onChange={(checked) => setConfig({ ...config, evento_questao_editada: checked })}
          />
          <SettingsToggleRow
            label="Lista publicada"
            checked={config.evento_lista_publicada}
            onChange={(checked) => setConfig({ ...config, evento_lista_publicada: checked })}
          />
          <SettingsToggleRow
            label="Prova criada"
            checked={config.evento_prova_criada}
            onChange={(checked) => setConfig({ ...config, evento_prova_criada: checked })}
          />
          <SettingsToggleRow
            label="Prova publicada"
            checked={config.evento_prova_publicada}
            onChange={(checked) => setConfig({ ...config, evento_prova_publicada: checked })}
          />
          <SettingsToggleRow
            label="Usuário completou lista"
            checked={config.evento_usuario_completou_lista}
            onChange={(checked) => setConfig({ ...config, evento_usuario_completou_lista: checked })}
          />
        </SettingsSection>
      </div>

      <SaveBar salvando={salvando} onSave={handleSalvar} />
    </div>
  )
}

function TabIntegracoes() {
  const [integracoes, setIntegracoes] = useState<Integracao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  async function carregar() {
    setCarregando(true)
    setErro(false)
    try {
      const resposta = await getIntegracoes()
      setIntegracoes(resposta.integracoes)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleToggle(integracao: Integracao, ativo: boolean) {
    setIntegracoes((atual) => atual.map((item) => (item.id === integracao.id ? { ...item, ativo } : item)))
    try {
      await patchIntegracao(integracao.id, { ativo })
    } catch (err) {
      console.error(err)
      carregar()
    }
  }

  async function handleSalvarCampo(integracao: Integracao, campo: 'api_key' | 'webhook_url', valor: string) {
    setIntegracoes((atual) =>
      atual.map((item) => (item.id === integracao.id ? { ...item, [campo === 'api_key' ? 'api_key_mascarada' : 'webhook_url']: valor } : item)),
    )
    try {
      await patchIntegracao(integracao.id, { [campo]: valor })
    } catch (err) {
      console.error(err)
    }
  }

  if (carregando) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Carregando integrações...</p>
      </CardDiv>
    )
  }

  if (erro) {
    return (
      <CardDiv>
        <p className={styles.emptyState}>Não foi possível carregar as integrações.</p>
        <div className={styles.retryRow}>
          <Button fullWidth={false} onClick={carregar}>
            Tentar novamente
          </Button>
        </div>
      </CardDiv>
    )
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.integrationsGrid}>
        {integracoes.map((integracao) => (
          <IntegrationCard
            key={integracao.id}
            icon={INTEGRACOES_ICON[integracao.provedor]?.icon ?? <BoltIcon />}
            iconColor={INTEGRACOES_ICON[integracao.provedor]?.color ?? 'purple'}
            nome={integracao.nome}
            descricao={integracao.descricao}
            ativo={integracao.ativo}
            onToggle={(ativo) => handleToggle(integracao, ativo)}
          >
            {integracao.api_key_mascarada !== null && (
              <ApiKeyInput
                id={`api-key-${integracao.id}`}
                label="ID de Mensuração / API Key"
                value={integracao.api_key_mascarada ?? ''}
                placeholder="Insira a chave de API"
                onChange={(valor) => handleSalvarCampo(integracao, 'api_key', valor)}
              />
            )}

            {integracao.webhook_url !== null && (
              <TextField
                id={`webhook-${integracao.id}`}
                label="Webhook URL"
                value={integracao.webhook_url ?? ''}
                placeholder="https://..."
                onChange={(event) => handleSalvarCampo(integracao, 'webhook_url', event.target.value)}
              />
            )}
          </IntegrationCard>
        ))}
      </div>
    </div>
  )
}
