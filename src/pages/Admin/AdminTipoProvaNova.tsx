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
import { getTipoProvaPorId, patchTipoProva, postTipoProva } from '../../services/tiposProva'
import styles from './AdminTipoProvaNova.module.css'

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo', color: 'green' as const },
  { value: 'inativo', label: 'Inativo', color: 'gold' as const },
]

export function AdminTipoProvaNova() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const emEdicao = Boolean(id)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('ativo')

  const [carregando, setCarregando] = useState(emEdicao)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      try {
        const resposta = await getTipoProvaPorId(id!)
        if (cancelado) return
        const tipo = resposta.tipo_prova
        setNome(tipo.nome)
        setDescricao(tipo.descricao ?? '')
        setStatus(tipo.ativo ? 'ativo' : 'inativo')
      } catch (error) {
        console.error(error)
        if (!cancelado) setErro('Não foi possível carregar os dados do tipo de prova.')
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
    navigate('/admin/tipos-prova')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      ativo: status === 'ativo',
    }

    setSalvando(true)
    setErro('')
    try {
      if (emEdicao) {
        await patchTipoProva(id!, payload)
      } else {
        await postTipoProva(payload)
      }
      navigate('/admin/tipos-prova')
    } catch (error) {
      console.error(error)
      setErro('Não foi possível salvar o tipo de prova. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb
          items={[
            { label: 'Tipos de Prova', to: '/admin/tipos-prova' },
            { label: emEdicao ? 'Editar tipo de prova' : 'Novo tipo de prova' },
          ]}
        />

        <div className={styles.header}>
          <TitlePage
            title={emEdicao ? 'Editar tipo de prova' : 'Novo tipo de prova'}
            subtitle="Cadastre categorias para classificar questões e listas."
          />

          <div className={styles.headerActions}>
            <Button type="button" variant="outline" fullWidth={false} icon={<XIcon />} iconPosition="left" onClick={cancelar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" form="novo-tipo-prova-form" fullWidth={false} icon={<SaveIcon />} iconPosition="left" disabled={carregando || salvando}>
              {salvando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Salvar tipo de prova'}
            </Button>
          </div>
        </div>

        {erro ? <div className={styles.alert} role="alert">{erro}</div> : null}

        <form id="novo-tipo-prova-form" className={styles.contentRow} onSubmit={handleSubmit}>
          <div className={styles.mainColumn}>
            <CardDiv>
              <CardHeading>Informações</CardHeading>
              <div className={styles.grid}>
                <TextField
                  id="nome"
                  label="Nome *"
                  placeholder="Ex.: ENEM"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  disabled={carregando}
                  required
                />

                <div className={styles.fieldGroup}>
                  <span>Status *</span>
                  <StatusToggle options={STATUS_OPTIONS} value={status} onChange={setStatus} />
                </div>
              </div>

              <label className={styles.textareaField}>
                <span>Descrição</span>
                <textarea
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  rows={4}
                  placeholder="Descreva este tipo de prova..."
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
