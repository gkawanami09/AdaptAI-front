import type { InputHTMLAttributes, ReactNode } from 'react'
import './TextField.css'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  endAdornment?: ReactNode
  labelVariant?: 'default' | 'caps'
}

export function TextField({ label, id, endAdornment, labelVariant = 'default', ...inputProps }: TextFieldProps) {
  return (
    <div className="text-field">
      <label
        className={`text-field__label${labelVariant === 'caps' ? ' text-field__label--caps' : ''}`}
        htmlFor={id}
      >
        {label}
      </label>
      <div className="text-field__control">
        <input id={id} className="text-field__input" {...inputProps} />
        {endAdornment && <span className="text-field__adornment">{endAdornment}</span>}
      </div>
    </div>
  )
}
