import { useState } from 'react'
import type { FormEvent } from 'react'
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
}

export function ProfileCard({ name, email, level, xp, escola, anoEnem }: ProfileCardProps) {
  const [nomeCompleto, setNomeCompleto] = useState(name)
  const [emailValue, setEmailValue] = useState(email)
  const [escolaValue, setEscolaValue] = useState(escola)
  const [anoEnemValue, setAnoEnemValue] = useState(anoEnem)

  function handleAlterarFoto() {
    // TODO: abrir seletor de imagem / upload de avatar
    console.log('alterar foto de perfil')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: conectar ao backend — salvar alterações do perfil (PATCH /me)
    console.log('salvar perfil', { nomeCompleto, emailValue, escolaValue, anoEnemValue })
  }

  return (
    <CardDiv>
      <CardHeading>Meu Perfil</CardHeading>

      <div className={styles.identity}>
        <div className={styles.avatarWrap}>
          <span className={styles.avatar}>🤖</span>
          <button
            type="button"
            className={styles.avatarEdit}
            onClick={handleAlterarFoto}
            aria-label="Alterar foto de perfil"
          >
            <CameraIcon />
          </button>
        </div>

        <div className={styles.identityInfo}>
          <span className={styles.name}>{name}</span>
          <span className={styles.email}>{email}</span>
          <span className={styles.badgeWrap}>
            <Badge color="purple">
              Nível {level} · {xp.toLocaleString('pt-BR')} XP
            </Badge>
          </span>
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
          value={emailValue}
          onChange={(event) => setEmailValue(event.target.value)}
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

        <Button type="submit" fullWidth={false} className={styles.submitButton}>
          Salvar alterações
        </Button>
      </form>
    </CardDiv>
  )
}
