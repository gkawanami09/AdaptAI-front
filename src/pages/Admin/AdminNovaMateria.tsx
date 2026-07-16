import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { TextField } from '../../components/ui/TextField'
import { SelectField } from '../../components/ui/SelectField'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { CardIcon } from '../../components/cards/CardIcon'
import { BookIcon, FolderIcon, InfoIcon, SaveIcon, UsersIcon, CheckCircleIcon } from '../../components/ui/icons'
import styles from './AdminNovaMateria.module.css'

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

export function AdminNovaMateria() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [area, setArea] = useState('')
  const [descricaoCurta, setDescricaoCurta] = useState('')
  const [ordem, setOrdem] = useState('1')
  const [status, setStatus] = useState('ativa')
  const [descricao, setDescricao] = useState('')

  const nomePreview = nome || 'Nova matéria'

  function handleCancelar() {
    navigate('/admin/materias')
  }

  function handleAlterarIcone() {
    // TODO: abrir seletor de ícone/categoria
    console.log('alterar ícone')
  }

  function handleAlterarCor() {
    // TODO: abrir seletor de cor de destaque
    console.log('alterar cor de destaque')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: conectar ao backend — criar a matéria (POST /admin/materias)
    console.log('salvar matéria', { nome, slug, area, descricaoCurta, ordem, status, descricao })
  }

  function handleVerModulos() {
    // TODO: conectar à navegação real — só disponível depois da matéria ser criada
    console.log('ver módulos')
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[{ label: 'Conteúdos', to: '/admin' }, { label: 'Matérias', to: '/admin/materias' }, { label: 'Nova matéria' }]}
        />

        <div className={styles.header}>
          <TitlePage title="Nova matéria" subtitle="Cadastre uma nova matéria para organizar módulos e aulas" />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button type="submit" form="nova-materia-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left">
              Salvar matéria
            </Button>
          </div>
        </div>

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
                  required
                />
                <span />
                <span className={styles.fieldHint}>Usado na URL. Apenas letras minúsculas, números e hífens.</span>

                <SelectField
                  id="area"
                  label="Área do conhecimento *"
                  placeholder="Selecione uma área"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  required
                >
                  {AREAS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectField>

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
                    <CardIcon color="purple">📐</CardIcon>
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
                    <span className={styles.colorSwatch} />
                    #7C4DFF
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
                  <CardIcon color="purple">📐</CardIcon>
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
      </div>
    </AdminPageLayout>
  )
}
