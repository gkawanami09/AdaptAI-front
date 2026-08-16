import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import { CameraIcon } from '../ui/icons'
import styles from './ProfileCard.module.css'

type ProfileCardProps = {
  name: string
  email: string
  level: number
  xp: number
  escola: string
  anoEnem: string
  avatarUrl?: string | null
  onSave: (dados: { nome: string; escola: string; anoEnem: string }) => Promise<void>
  onUploadAvatar: (arquivo: File) => Promise<void>
}

export function ProfileCard({
  name,
  email,
  level,
  xp,
  escola,
  anoEnem,
  avatarUrl,
  onSave,
  onUploadAvatar,
}: ProfileCardProps) {
  const [nomeCompleto, setNomeCompleto] = useState(name)
  const [escolaValue, setEscolaValue] = useState(escola)
  const [anoEnemValue, setAnoEnemValue] = useState(anoEnem)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [erroFoto, setErroFoto] = useState('')

  function handleAlterarFoto() {
    fileInputRef.current?.click()
  }

  async function handleArquivoSelecionado(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    event.target.value = ''
    if (!arquivo) return

    setErroFoto('')
    const previewUrl = URL.createObjectURL(arquivo)
    setPreview(previewUrl)
    setEnviandoFoto(true)

    try {
      await onUploadAvatar(arquivo)
    } catch (err) {
      setErroFoto(err instanceof Error ? err.message : 'Não foi possível atualizar a foto de perfil.')
      setPreview(null)
    } finally {
      setEnviandoFoto(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setSucesso(false)
    setSalvando(true)

    try {
      await onSave({ nome: nomeCompleto, escola: escolaValue, anoEnem: anoEnemValue })
      setSucesso(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar as alterações.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <CardDiv>
      <CardHeading>Meu Perfil</CardHeading>

      <div className={styles.identity}>
        <div className={styles.avatarWrap}>
          {preview || avatarUrl ? (
            <img className={styles.avatarImage} src={preview ?? avatarUrl ?? ''} alt="" />
          ) : (
            <span className={styles.avatar}>🤖</span>
          )}
          <button
            type="button"
            className={styles.avatarEdit}
            onClick={handleAlterarFoto}
            aria-label="Alterar foto de perfil"
            disabled={enviandoFoto}
          >
            <CameraIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.avatarInput}
            onChange={handleArquivoSelecionado}
          />
        </div>

        <div className={styles.identityInfo}>
          <span className={styles.name}>{name}</span>
          <span className={styles.email}>{email}</span>
          <span className={styles.badgeWrap}>
            <Badge color="purple">
              Nível {level} · {xp.toLocaleString('pt-BR')} XP
            </Badge>
          </span>
          {enviandoFoto && <span className={styles.avatarStatus}>Enviando foto...</span>}
          {erroFoto && <span className={styles.avatarError}>{erroFoto}</span>}
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          id="nome-completo"
          label="Nome completo"
          labelVariant="caps"
          value={nomeCompleto}
          onChange={(event) => setNomeCompleto(event.target.value)}
        />
        <TextField
          id="email"
          type="email"
          label="E-mail"
          labelVariant="caps"
          value={email}
          disabled
        />
        <TextField
          id="escola"
          label="Escola/Cursinho"
          labelVariant="caps"
          value={escolaValue}
          onChange={(event) => setEscolaValue(event.target.value)}
        />
        <TextField
          id="ano-enem"
          label="Ano do ENEM"
          labelVariant="caps"
          value={anoEnemValue}
          onChange={(event) => setAnoEnemValue(event.target.value)}
        />

        {erro && <p className={styles.errorMessage}>{erro}</p>}
        {sucesso && <p className={styles.successMessage}>Perfil atualizado com sucesso.</p>}

        <Button type="submit" fullWidth={false} className={styles.submitButton} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </CardDiv>
  )
}
