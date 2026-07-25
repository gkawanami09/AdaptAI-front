import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { TextField } from '../../components/ui/TextField'
import { StatusToggle } from '../../components/ui/StatusToggle'
import { IconPickerGrid } from '../../components/ui/IconPickerGrid'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { CardIcon } from '../../components/cards/CardIcon'
import type { CardIconColor } from '../../components/cards/CardIcon'
import { TipsCard } from '../../components/cards/TipsCard'
import { BookIcon, ChevronRightIcon, InfoIcon, PencilIcon, SaveIcon, StarIcon, ClipboardIcon, XIcon } from '../../components/ui/icons'
import styles from './AdminNovoModulo.module.css'

import { getMateriaPorId } from '../../services/materias'
import { getTopicosPorMateria, postTopico, patchTopico } from '../../services/modulos'

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo', color: 'green' as const },
  { value: 'rascunho', label: 'Rascunho', color: 'gold' as const },
]

const SEM_ICONE = 'sem-icone'

const ICON_OPTIONS: { value: string; icon: string; color: CardIconColor }[] = [
  { value: SEM_ICONE, icon: '—', color: 'blue' },
  { value: '📐', icon: '📐', color: 'purple' },
  { value: '⚡', icon: '⚡', color: 'gold' },
  { value: '🧪', icon: '🧪', color: 'blue' },
  { value: '🌿', icon: '🌿', color: 'green' },
  { value: '🏛️', icon: '🏛️', color: 'gold' },
  { value: '✍️', icon: '✍️', color: 'red' },
  { value: '🌐', icon: '🌐', color: 'blue' },
  { value: '🎨', icon: '🎨', color: 'purple' },
]

const DICAS = [
  {
    icon: <PencilIcon />,
    iconColor: 'purple' as const,
    title: 'Use nomes curtos e claros',
    description: 'Nomes objetivos ajudam os alunos a entenderem rapidamente o conteúdo do módulo.',
  },
  {
    icon: <ClipboardIcon />,
    iconColor: 'blue' as const,
    title: 'Defina a ordem de exibição',
    description: 'Módulos com números menores aparecem primeiro na lista da matéria.',
  },
  {
    icon: <StarIcon />,
    iconColor: 'gold' as const,
    title: 'Escolha um ícone representativo',
    description: 'Ícones e cores ajudam na identificação visual e tornam a navegação mais fácil.',
  },
]

export function AdminNovoModulo() {
  const navigate = useNavigate()
  const { materiaId, topicoId } = useParams<{ materiaId: string; topicoId?: string }>()
  const emEdicao = Boolean(topicoId)

  const [materiaNome, setMateriaNome] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ordem, setOrdem] = useState('0')
  const [status, setStatus] = useState('ativo')
  const [icone, setIcone] = useState(SEM_ICONE)
  const [iconesDisponiveis, setIconesDisponiveis] = useState(ICON_OPTIONS)
  const [mostrarNovoIcone, setMostrarNovoIcone] = useState(false)
  const [novoIcone, setNovoIcone] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const nomePreview = nome || 'Novo módulo'
  const iconeSelecionado = iconesDisponiveis.find((option) => option.value === icone) ?? iconesDisponiveis[0]

  //carrega o nome da matéria (para o breadcrumb/preview) e, em edição, os dados do tópico
  useEffect(() => {
    if (!materiaId) return

    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const respostaMateria = await getMateriaPorId(materiaId!)
        if (cancelado) return
        setMateriaNome(respostaMateria.materia.nome)

        if (topicoId) {
          // não existe GET por tópico individual — busca a lista da matéria e filtra pelo id
          const respostaTopicos = await getTopicosPorMateria({ materia_id: materiaId! })
          if (cancelado) return
          const topico = respostaTopicos.topicos.find((item) => item.topico_id === topicoId)
          if (!topico) {
            setErro('Não foi possível encontrar esse módulo.')
            return
          }
          setNome(topico.nome ?? '')
          setDescricao(topico.descricao ?? '')
          setOrdem(String(topico.ordem))
          setStatus(topico.ativo ? 'ativo' : 'rascunho')
          setIcone(topico.icone ?? SEM_ICONE)
        }
      } catch (err) {
        console.error(err)
        if (!cancelado) setErro('Não foi possível carregar os dados necessários.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [materiaId, topicoId])

  function handleCancelar() {
    navigate(`/admin/materias/${materiaId}`)
  }

  function handleGerenciarAulas() {
    // TODO: conectar à navegação real — só disponível depois do módulo ser criado
    console.log('gerenciar aulas')
  }

  function handleAbrirNovoIcone() {
    setNovoIcone('')
    setMostrarNovoIcone(true)
  }

  function handleCancelarNovoIcone() {
    setMostrarNovoIcone(false)
    setNovoIcone('')
  }

  function handleConfirmarNovoIcone() {
    const valor = novoIcone.trim()
    if (!valor) return

    setIconesDisponiveis((prev) =>
      prev.some((option) => option.value === valor) ? prev : [...prev, { value: valor, icon: valor, color: 'purple' }],
    )
    setIcone(valor)
    setMostrarNovoIcone(false)
    setNovoIcone('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!materiaId) return

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      ordem: Number(ordem),
      icone: icone === SEM_ICONE ? null : icone,
      ativo: status === 'ativo',
    }

    setSalvando(true)
    setErro('')
    try {
      if (emEdicao) {
        await patchTopico(topicoId!, payload)
      } else {
        await postTopico({ materia_id: materiaId, ...payload })
      }
      navigate(`/admin/materias/${materiaId}`)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível salvar o módulo.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Conteúdos', to: '/admin' },
            { label: 'Matérias', to: '/admin/materias' },
            { label: materiaNome || 'Matéria', to: `/admin/materias/${materiaId}` },
            { label: emEdicao ? 'Editar módulo' : 'Novo módulo' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={emEdicao ? 'Editar módulo' : 'Novo módulo'}
            subtitle={
              emEdicao
                ? `Atualize as informações deste módulo em ${materiaNome || 'matéria'}`
                : `Cadastre um módulo dentro da matéria ${materiaNome || ''}`
            }
          />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="novo-modulo-form"
              fullWidth={false}
              icon={<SaveIcon />}
              iconPosition="left"
              disabled={salvando || carregando}
            >
              {salvando ? 'Salvando...' : 'Salvar módulo'}
            </Button>
          </div>
        </div>

        {erro && (
          <CardDiv>
            <p className={styles.fieldHint}>{erro}</p>
          </CardDiv>
        )}

        <form id="novo-modulo-form" className={styles.contentRow} onSubmit={handleSubmit}>
          <div className={styles.mainColumn}>
            <CardDiv>
              <CardHeading>Informações do módulo</CardHeading>

              <div className={styles.grid}>
                <TextField
                  id="nome"
                  label="Nome do módulo *"
                  placeholder="Ex.: Funções"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  disabled={carregando}
                  required
                />

                <TextField
                  id="descricao"
                  label="Descrição"
                  placeholder="Ex.: Estude os principais tipos de funções e suas propriedades."
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value.slice(0, 500))}
                  maxLength={500}
                  disabled={carregando}
                />

                <TextField
                  id="ordem"
                  type="number"
                  min={0}
                  label={
                    <>
                      Ordem <InfoIcon className={styles.infoIcon} />
                    </>
                  }
                  value={ordem}
                  onChange={(event) => setOrdem(event.target.value)}
                  disabled={carregando}
                />

                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>
                    Status *<InfoIcon className={styles.infoIcon} />
                  </span>
                  <StatusToggle options={STATUS_OPTIONS} value={status} onChange={setStatus} />
                </div>
              </div>

              <div className={styles.iconField}>
                <span className={styles.fieldLabel}>Ícone do módulo</span>
                <IconPickerGrid
                  options={iconesDisponiveis}
                  value={icone}
                  onChange={setIcone}
                  onAddCustom={handleAbrirNovoIcone}
                />

                {mostrarNovoIcone && (
                  <div className={styles.customIconRow}>
                    <input
                      type="text"
                      className={styles.customIconInput}
                      placeholder="Cole um emoji, ex.: 🚀"
                      value={novoIcone}
                      onChange={(event) => setNovoIcone(event.target.value.slice(0, 4))}
                      autoFocus
                    />
                    <Button type="button" size="sm" fullWidth={false} onClick={handleConfirmarNovoIcone}>
                      Adicionar
                    </Button>
                    <Button type="button" variant="outline" size="sm" fullWidth={false} onClick={handleCancelarNovoIcone}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              <div className={styles.structureField}>
                <span className={styles.fieldLabel}>
                  Estrutura
                  <InfoIcon className={styles.infoIcon} />
                </span>

                <div className={styles.structureRow}>
                  <CardIcon color="purple">
                    <BookIcon />
                  </CardIcon>
                  <div className={styles.structureInfo}>
                    <span className={styles.structureLabel}>Total de aulas neste módulo</span>
                    <span className={styles.structureValue}>0</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth={false}
                    icon={<ChevronRightIcon />}
                    onClick={handleGerenciarAulas}
                    disabled={!emEdicao}
                  >
                    Gerenciar aulas
                  </Button>
                </div>
              </div>
            </CardDiv>
          </div>

          <div className={styles.sideColumn}>
            <CardDiv>
              <CardHeading>Pré-visualização</CardHeading>
              <p className={styles.previewHint}>Assim que o módulo aparecerá na listagem</p>

              <div className={styles.previewCard}>
                <CardIcon color={iconeSelecionado.color}>{iconeSelecionado.icon}</CardIcon>
                <div className={styles.previewInfo}>
                  <div className={styles.previewTop}>
                    <span className={styles.previewTitle}>{nomePreview}</span>
                    {status === 'ativo' ? <Badge color="teal">Ativo</Badge> : <Badge color="gold">Rascunho</Badge>}
                  </div>
                  <Badge color="blue">{materiaNome || '—'}</Badge>
                  <span className={styles.previewMeta}>0 aulas</span>
                </div>
              </div>
            </CardDiv>

            <TipsCard title="Dicas" items={DICAS} />
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}
