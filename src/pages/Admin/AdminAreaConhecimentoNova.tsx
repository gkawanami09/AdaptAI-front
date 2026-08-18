import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { Button } from '../../components/ui/Button'
import { StatusToggle } from '../../components/ui/StatusToggle'
import { TextField } from '../../components/ui/TextField'
import { TitlePage } from '../../components/ui/TitlePage'
import { SaveIcon, XIcon } from '../../components/ui/icons'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { getAreaConhecimentoPorId, patchAreaConhecimento, postAreaConhecimento } from '../../services/areasConhecimento'
import styles from './AdminTipoProvaNova.module.css'

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo', color: 'green' as const },
  { value: 'inativo', label: 'Inativo', color: 'gold' as const },
]

export function AdminAreaConhecimentoNova() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const emEdicao = Boolean(id)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('ativo')
  const [slug, setSlug] = useState<string | undefined>(undefined)

  const [carregando, setCarregando] = useState(emEdicao)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      try {
        const resposta = await getAreaConhecimentoPorId(id!)
        if (cancelado) return
        const area = resposta.area
        setNome(area.nome)
        setDescricao(area.descricao ?? '')
        setStatus(area.ativo ? 'ativo' : 'inativo')
        setSlug(area.slug)
      } catch (error) {
        console.error(error)
        if (!cancelado) setErro('Não foi possível carregar os dados desta área do conhecimento.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [id])

  function cancelar() {
    navigate('/admin/areas-conhecimento')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nome.trim()) {
      setErro('Informe o nome da área do conhecimento.')
      return
    }

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      ativo: status === 'ativo',
    }

    setSalvando(true)
    setErro('')
    try {
      const resposta = emEdicao ? await patchAreaConhecimento(id!, payload) : await postAreaConhecimento(payload)
      navigate('/admin/areas-conhecimento', {
        state: { toast: { type: 'success', message: resposta.mensagem || 'Área do conhecimento salva com sucesso.' } },
      })
    } catch (error) {
      console.error(error)
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar a área do conhecimento. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Áreas do Conhecimento', to: '/admin/areas-conhecimento' },
            { label: emEdicao ? 'Editar área' : 'Nova área' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={emEdicao ? 'Editar área do conhecimento' : 'Nova área do conhecimento'}
            subtitle="Cadastre grandes áreas para agrupar as matérias da plataforma."
          />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={cancelar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" form="nova-area-conhecimento-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left" disabled={carregando || salvando}>
              {salvando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Salvar área'}
            </Button>
          </div>
        </div>

        {erro ? <div className={styles.alert} role="alert">{erro}</div> : null}

        <form id="nova-area-conhecimento-form" className={styles.contentRow} onSubmit={handleSubmit}>
          <div className={styles.mainColumn}>
            <CardDiv>
              <CardHeading>Informações</CardHeading>
              <div className={styles.grid}>
                <TextField
                  id="nome"
                  label="Nome *"
                  placeholder="Ex.: Ciências da Natureza"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  disabled={carregando}
                  required
                />

                <div className={styles.fieldGroup}>
                  <span>Status *</span>
                  <StatusToggle options={STATUS_OPTIONS} value={status} onChange={setStatus} />
                </div>

                {slug && (
                  <div className={styles.fieldGroup}>
                    <span>Slug</span>
                    <span>{slug}</span>
                  </div>
                )}
              </div>

              <label className={styles.textareaField}>
                <span>Descrição</span>
                <textarea
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  rows={4}
                  placeholder="Descreva esta área do conhecimento..."
                  disabled={carregando}
                />
              </label>
            </CardDiv>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  )
}
