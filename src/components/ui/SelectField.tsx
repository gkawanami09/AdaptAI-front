import type { ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from './icons'
import './TextField.css'
import './SelectField.css'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  placeholder?: string
  children: ReactNode
}

export function SelectField({ label, id, placeholder, children, ...selectProps }: SelectFieldProps) {
  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="text-field__control">
        <select id={id} className="text-field__input select-field__input" {...selectProps}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className="text-field__adornment select-field__chevron">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  )
}
