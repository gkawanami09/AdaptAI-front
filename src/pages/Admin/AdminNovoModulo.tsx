import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { TextField } from '../../components/ui/TextField'
import { SelectField } from '../../components/ui/SelectField'
import { StatusToggle } from '../../components/ui/StatusToggle'
import { IconPickerGrid } from '../../components/ui/IconPickerGrid'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { CardIcon } from '../../components/cards/CardIcon'
import { TipsCard } from '../../components/cards/TipsCard'
import { BookIcon, ChevronRightIcon, InfoIcon, PencilIcon, SaveIcon, StarIcon, ClipboardIcon, XIcon } from '../../components/ui/icons'
import styles from './AdminNovoModulo.module.css'

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo', color: 'green' as const },
  { value: 'rascunho', label: 'Rascunho', color: 'gold' as const },
]

const MATERIAS = [{ value: 'matematica', label: 'Matemática' }]

const ICON_OPTIONS = [
  { value: 'regua', icon: '📐', color: 'purple' as const },
  { value: 'raio', icon: '⚡', color: 'gold' as const },
  { value: 'frasco', icon: '🧪', color: 'blue' as const },
  { value: 'folha', icon: '🌿', color: 'green' as const },
  { value: 'predio', icon: '🏛️', color: 'gold' as const },
  { value: 'lapis', icon: '✍️', color: 'red' as const },
  { value: 'globo', icon: '🌐', color: 'blue' as const },
  { value: 'paleta', icon: '🎨', color: 'purple' as const },
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
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [materia, setMateria] = useState('matematica')
  const [descricaoCurta, setDescricaoCurta] = useState('')
  const [ordem, setOrdem] = useState('1')
  const [status, setStatus] = useState('ativo')
  const [icone, setIcone] = useState('regua')
  const [observacoes, setObservacoes] = useState('')

  const nomePreview = nome || 'Novo módulo'
  const iconeSelecionado = ICON_OPTIONS.find((option) => option.value === icone) ?? ICON_OPTIONS[0]

  function handleCancelar() {
    navigate('/admin/materias/matematica')
  }

  function handleAdicionarIconePersonalizado() {
    // TODO: abrir upload/seletor de ícone personalizado
    console.log('adicionar ícone personalizado')
  }

  function handleGerenciarAulas() {
    // TODO: conectar à navegação real — só disponível depois do módulo ser criado
    console.log('gerenciar aulas')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: conectar ao backend — criar o módulo (POST /admin/materias/:id/modulos)
    console.log('salvar módulo', { nome, slug, materia, descricaoCurta, ordem, status, icone, observacoes })
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Conteúdos', to: '/admin' },
            { label: 'Matérias', to: '/admin/materias' },
            { label: 'Matemática', to: '/admin/materias/matematica' },
            { label: 'Novo módulo' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage title="Novo módulo" subtitle="Cadastre um módulo dentro da matéria Matemática" />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button type="submit" form="novo-modulo-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left">
              Salvar módulo
            </Button>
          </div>
        </div>

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
                  required
                />
                <TextField
                  id="slug"
                  label={
                    <>
                      Slug * <InfoIcon className={styles.infoIcon} />
                    </>
                  }
                  placeholder="ex.: funcoes"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  required
                />

                <SelectField
                  id="materia"
                  label="Matéria *"
                  value={materia}
                  onChange={(event) => setMateria(event.target.value)}
                  required
                >
                  {MATERIAS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectField>

                <TextField
                  id="descricao-curta"
                  label="Descrição curta *"
                  placeholder="Ex.: Estude os principais tipos de funções e suas propriedades."
                  value={descricaoCurta}
                  onChange={(event) => setDescricaoCurta(event.target.value.slice(0, 120))}
                  maxLength={120}
                  required
                />

                <TextField
                  id="ordem"
                  type="number"
                  min={1}
                  label={
                    <>
                      Ordem * <InfoIcon className={styles.infoIcon} />
                    </>
                  }
                  value={ordem}
                  onChange={(event) => setOrdem(event.target.value)}
                  required
                />

                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>
                    Status *<InfoIcon className={styles.infoIcon} />
                  </span>
                  <StatusToggle options={STATUS_OPTIONS} value={status} onChange={setStatus} />
                </div>
              </div>

              <div className={styles.iconField}>
                <span className={styles.fieldLabel}>Cor/ícone do módulo *</span>
                <IconPickerGrid
                  options={ICON_OPTIONS}
                  value={icone}
                  onChange={setIcone}
                  onAddCustom={handleAdicionarIconePersonalizado}
                />
              </div>

              <div className={styles.descriptionField}>
                <span className={styles.fieldLabel}>
                  Descrição completa / Observações
                  <InfoIcon className={styles.infoIcon} />
                </span>
                <textarea
                  className={styles.textarea}
                  placeholder="Detalhe os objetivos, conteúdos abordados e observações importantes sobre este módulo..."
                  value={observacoes}
                  onChange={(event) => setObservacoes(event.target.value.slice(0, 1000))}
                  maxLength={1000}
                />
                <span className={styles.charCount}>{observacoes.length} / 1000</span>
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
                  <Badge color="blue">Matemática</Badge>
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
