import { useState } from 'react'
import type { FormEvent } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { SelectField } from '../ui/SelectField'
import { FilterChip } from '../ui/FilterChip'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import styles from './StudyGoalsCard.module.css'

const OBJETIVOS = [
  'Passar em universidade pública',
  'Passar em universidade particular',
  'Melhorar nota do Enem',
  'Conseguir bolsa de estudos',
]

const TEMPOS_ESTUDO = [
  { value: '30min', label: '30min' },
  { value: '1h', label: '1h' },
  { value: '2h', label: '2h' },
  { value: '3h+', label: '3h+' },
]

type StudyGoalsCardProps = {
  objetivo: string
  tempoEstudo: string
  notaAlvo: string
}

export function StudyGoalsCard({ objetivo, tempoEstudo, notaAlvo }: StudyGoalsCardProps) {
  const [objetivoValue, setObjetivoValue] = useState(objetivo)
  const [tempoValue, setTempoValue] = useState(tempoEstudo)
  const [notaValue, setNotaValue] = useState(notaAlvo)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: conectar ao backend — salvar metas de estudo (PATCH /me/metas)
    console.log('salvar metas', { objetivoValue, tempoValue, notaValue })
  }

  return (
    <CardDiv>
      <CardHeading>Metas e Plano de Estudos</CardHeading>

      <form className={styles.form} onSubmit={handleSubmit}>
        <SelectField
          id="objetivo-principal"
          label="Objetivo principal"
          labelVariant="caps"
          value={objetivoValue}
          onChange={(event) => setObjetivoValue(event.target.value)}
        >
          {OBJETIVOS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>

        <div className={styles.field}>
          <span className={styles.label}>Tempo de estudo por dia</span>
          <div className={styles.chips}>
            {TEMPOS_ESTUDO.map((item) => (
              <FilterChip
                key={item.value}
                label={item.label}
                selected={item.value === tempoValue}
                onClick={() => setTempoValue(item.value)}
                size="md"
              />
            ))}
          </div>
        </div>

        <TextField
          id="nota-alvo"
          type="number"
          label="Nota alvo no Enem"
          labelVariant="caps"
          value={notaValue}
          onChange={(event) => setNotaValue(event.target.value)}
        />

        <Button type="submit" fullWidth={false} className={styles.submitButton}>
          Salvar metas
        </Button>
      </form>
    </CardDiv>
  )
}
