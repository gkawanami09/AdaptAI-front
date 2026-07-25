import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { TextField } from '../../components/ui/TextField'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { FilterChip } from '../../components/ui/FilterChip'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { IconPickerGrid } from '../../components/ui/IconPickerGrid'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { CardIcon } from '../../components/cards/CardIcon'
import { BookIcon, FolderIcon, InfoIcon, SaveIcon, UsersIcon, CheckCircleIcon, CheckIcon } from '../../components/ui/icons'
import styles from './AdminNovaMateria.module.css'

import { postMaterias, putMateria, getMateriaPorId } from '../../services/materias'

const STATUS_OPTIONS = [
  { value: 'ativa', label: 'Ativa' },
  { value: 'rascunho', label: 'Rascunho' },
]

const AREAS = [
  { value: 'matematica', label: 'Matemática' },
  { value: 'ciencias-natureza', label: 'Ciências da Natureza' },
  { value: 'ciencias-humanas', label: 'Ciências Humanas' },
  { value: 'linguagens', label: 'Linguagens' },
  { value: 'redacao', label: 'Redação' },
]

const ICONE_OPTIONS = ['📐', '⚡', '🧪', '🌿', '🏛️', '✍️', '🌐', '🎨', '📚', '🔬']

const COR_OPTIONS: { hex: string; label: string }[] = [
  { hex: '#6C5CE7', label: 'Roxo' },
  { hex: '#2563EB', label: 'Azul' },
  { hex: '#0D9668', label: 'Verde' },
  { hex: '#B45309', label: 'Dourado' },
  { hex: '#C0362C', label: 'Vermelho' },
]

export function AdminNovaMateria() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const emEdicao = Boolean(id)
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [area, setArea] = useState<string[]>([])
  const [descricaoCurta, setDescricaoCurta] = useState('')
  const [ordem, setOrdem] = useState('1')
  const [status, setStatus] = useState('ativa')
  const [descricao, setDescricao] = useState('')
  const [icone, setIcone] = useState(ICONE_OPTIONS[0])
  const [cor, setCor] = useState(COR_OPTIONS[0].hex)
  const [modalAberto, setModalAberto] = useState<'icone' | 'cor' | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [carregandoMateria, setCarregandoMateria] = useState(emEdicao)
  const [erroCarregamento, setErroCarregamento] = useState('')

  const nomePreview = nome || 'Nova matéria'

  useEffect(() => {
    if (!id) return

    let cancelado = false

    async function carregarMateria() {
      setCarregandoMateria(true)
      setErroCarregamento('')
      try {
        const response = await getMateriaPorId(id!)
        if (cancelado) return

        const materia = response.materia
        setNome(materia.nome)
        setSlug(materia.slug)
        setArea(materia.area)
        setIcone(materia.icone)
        setCor(materia.cor)
        setOrdem(String(materia.ordem))
        setStatus(materia.ativo ? 'ativa' : 'rascunho')
      } catch (err) {
        console.error(err)
        if (!cancelado) setErroCarregamento('Não foi possível carregar essa matéria.')
      } finally {
        if (!cancelado) setCarregandoMateria(false)
      }
    }

    carregarMateria()
    return () => {
      cancelado = true
    }
  }, [id])

  function handleCancelar() {
    navigate('/admin/materias')
  }

  function handleAlterarIcone() {
    setModalAberto('icone')
  }

  function handleAlterarCor() {
    setModalAberto('cor')
  }

  function handleFecharModal() {
    setModalAberto(null)
  }

  function handleSelecionarIcone(value: string) {
    setIcone(value)
    setModalAberto(null)
  }

  function handleSelecionarCor(hex: string) {
    setCor(hex)
    setModalAberto(null)
  }

  function handleToggleArea(value: string) {
    setArea((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (area.length === 0) return

    const payload = {
      nome,
      slug,
      area,
      icone,
      cor,
      ordem: Number(ordem),
      ativo: status === 'ativa',
    }

    setCarregando(true)
    try {
      const response = emEdicao ? await putMateria(id!, payload) : await postMaterias(payload)
      console.log(response)
      navigate('/admin/materias')
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  function handleVerModulos() {
    // TODO: conectar à navegação real — só disponível depois da matéria ser criada
    console.log('ver módulos')
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Conteúdos', to: '/admin' },
            { label: 'Matérias', to: '/admin/materias' },
            { label: emEdicao ? 'Editar matéria' : 'Nova matéria' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={emEdicao ? 'Editar matéria' : 'Nova matéria'}
            subtitle={
              emEdicao
                ? 'Atualize as informações desta matéria'
                : 'Cadastre uma nova matéria para organizar módulos e aulas'
            }
          />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} onClick={handleCancelar} disabled={carregando}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="nova-materia-form"
              fullWidth={false}
              icon={<SaveIcon />}
              iconPosition="left"
              disabled={carregando || carregandoMateria}
            >
              {carregando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Salvar matéria'}
            </Button>
          </div>
        </div>

        {carregandoMateria && (
          <CardDiv>
            <p className={styles.fieldHint}>Carregando dados da matéria...</p>
          </CardDiv>
        )}

        {erroCarregamento && (
          <CardDiv>
            <p className={styles.fieldHint}>{erroCarregamento}</p>
          </CardDiv>
        )}

        <form id="nova-materia-form" className={styles.contentRow} onSubmit={handleSubmit}>
          <div className={styles.mainColumn}>
            <CardDiv>
              <CardHeading>Informações principais</CardHeading>

              <div className={styles.grid}>
                <TextField
                  id="nome"
                  label="Nome da matéria *"
                  placeholder="Ex.: Matemática"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  required
                />
                <TextField
                  id="slug"
                  label="Slug *"
                  placeholder="ex.: matematica"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  disabled={emEdicao}
                  required
                />
                <span />
                <span className={styles.fieldHint}>Usado na URL. Apenas letras minúsculas, números e hífens.</span>

                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Área do conhecimento *</span>
                  <div className={styles.areaChips}>
                    {AREAS.map((item) => (
                      <FilterChip
                        key={item.value}
                        label={item.label}
                        selected={area.includes(item.value)}
                        onClick={() => handleToggleArea(item.value)}
                      />
                    ))}
                  </div>
                </div>
                <span className={styles.fieldHint}>Selecione uma ou mais áreas relacionadas a esta matéria.</span>

                <TextField
                  id="descricao-curta"
                  label="Descrição curta *"
                  placeholder="Ex.: Estude números, álgebra, geometria e mais."
                  value={descricaoCurta}
                  onChange={(event) => setDescricaoCurta(event.target.value.slice(0, 120))}
                  maxLength={120}
                  required
                />
                <span />
                <span className={styles.charCount}>{descricaoCurta.length}/120</span>

                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Ícone / categoria *</span>
                  <div className={styles.iconPicker}>
                    <CardIcon hex={cor}>{icone}</CardIcon>
                    <span className={styles.iconPickerText}>
                      {nomePreview}
                      <small>Ícone selecionado</small>
                    </span>
                    <Button type="button" variant="outline" size="sm" fullWidth={false} onClick={handleAlterarIcone}>
                      Alterar ícone
                    </Button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Cor de destaque *</span>
                  <button type="button" className={styles.colorPicker} onClick={handleAlterarCor}>
                    <span className={styles.colorSwatch} style={{ background: cor }} />
                    {cor.toUpperCase()}
                  </button>
                </div>

                <TextField
                  id="ordem"
                  label="Ordem de exibição *"
                  type="number"
                  min={1}
                  value={ordem}
                  onChange={(event) => setOrdem(event.target.value)}
                  required
                />
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Status *</span>
                  <SegmentedControl options={STATUS_OPTIONS} value={status} onChange={setStatus} />
                </div>

                <span className={styles.fieldHint}>Define a posição da matéria na listagem.</span>
              </div>

              <div className={styles.descriptionField}>
                <span className={styles.fieldLabel}>Descrição</span>
                <textarea
                  className={styles.textarea}
                  placeholder="Descreva esta matéria, seus objetivos e o que os alunos irão aprender."
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value.slice(0, 500))}
                  maxLength={500}
                />
                <span className={styles.charCount}>{descricao.length}/500</span>
              </div>
            </CardDiv>
          </div>

          <div className={styles.sideColumn}>
            <CardDiv>
              <CardHeading>Pré-visualização</CardHeading>
              <p className={styles.previewHint}>Veja como sua matéria aparecerá na interface.</p>

              <div className={styles.previewCard}>
                <div className={styles.previewTop}>
                  <CardIcon hex={cor}>{icone}</CardIcon>
                  {status === 'ativa' ? <Badge color="teal">Ativa</Badge> : <Badge color="gold">Rascunho</Badge>}
                </div>
                <p className={styles.previewTitle}>{nomePreview}</p>
                <Badge color="blue">{nomePreview}</Badge>
                <p className={styles.previewMeta}>
                  <FolderIcon className={styles.previewMetaIcon} /> 0 módulos · 0 aulas
                </p>
                <Button type="button" icon={<FolderIcon />} iconPosition="left" onClick={handleVerModulos}>
                  Ver módulos
                </Button>
              </div>
            </CardDiv>

            <CardDiv>
              <CardHeading>Resumo</CardHeading>
              <div className={styles.summaryList}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <FolderIcon className={styles.summaryIcon} /> Módulos
                  </span>
                  <span className={styles.summaryValue}>0</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <BookIcon className={styles.summaryIcon} /> Aulas
                  </span>
                  <span className={styles.summaryValue}>0</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <UsersIcon className={styles.summaryIcon} /> Criado por
                  </span>
                  <span className={styles.summaryValue}>Admin</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    <CheckCircleIcon className={styles.summaryIcon} /> Status
                  </span>
                  {status === 'ativa' ? <Badge color="teal">Ativa</Badge> : <Badge color="gold">Rascunho</Badge>}
                </div>
              </div>
            </CardDiv>

            <CardDiv tone="purple">
              <div className={styles.infoCallout}>
                <InfoIcon className={styles.infoIcon} />
                <p>Após salvar, você poderá adicionar módulos e aulas à matéria.</p>
              </div>
            </CardDiv>
          </div>
        </form>

        {modalAberto === 'icone' && (
          <Modal title="Escolher ícone" onClose={handleFecharModal}>
            <IconPickerGrid
              options={ICONE_OPTIONS.map((value) => ({ value, icon: value, hex: cor }))}
              value={icone}
              onChange={handleSelecionarIcone}
            />
          </Modal>
        )}

        {modalAberto === 'cor' && (
          <Modal title="Escolher cor de destaque" onClose={handleFecharModal}>
            <div className={styles.colorOptions}>
              {COR_OPTIONS.map((option) => (
                <button
                  key={option.hex}
                  type="button"
                  className={styles.colorOption}
                  onClick={() => handleSelecionarCor(option.hex)}
                  aria-pressed={option.hex.toUpperCase() === cor.toUpperCase()}
                >
                  <span className={styles.colorOptionSwatch} style={{ background: option.hex }}>
                    {option.hex.toUpperCase() === cor.toUpperCase() && (
                      <CheckIcon className={styles.colorOptionCheck} />
                    )}
                  </span>
                  <span className={styles.colorOptionLabel}>{option.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.customColorRow}>
              <label className={styles.customColorSwatch} style={{ background: cor }}>
                <input
                  type="color"
                  className={styles.customColorInput}
                  value={cor}
                  onChange={(event) => setCor(event.target.value)}
                  aria-label="Escolher cor personalizada"
                />
              </label>
              <span className={styles.customColorLabel}>
                Cor personalizada
                <small>{cor.toUpperCase()}</small>
              </span>
            </div>
          </Modal>
        )}
      </div>
    </AdminPageLayout>
  )
}
