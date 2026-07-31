import { useState } from 'react'
import { TextField } from '../ui/TextField'
import { EyeIcon, EyeOffIcon } from '../ui/icons'
import styles from './ApiKeyInput.module.css'

type ApiKeyInputProps = {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export function ApiKeyInput({ id, label, value, placeholder, onChange }: ApiKeyInputProps) {
  const [visivel, setVisivel] = useState(false)

  return (
    <TextField
      id={id}
      label={label}
      type={visivel ? 'text' : 'password'}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      endAdornment={
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setVisivel((atual) => !atual)}
          aria-label={visivel ? 'Ocultar chave' : 'Exibir chave'}
        >
          {visivel ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  )
}
