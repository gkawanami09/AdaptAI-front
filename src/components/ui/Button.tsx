import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  pill?: boolean
}

export function Button({
  variant = 'primary',
  icon,
  iconPosition = 'right',
  children,
  className,
  fullWidth = true,
  pill = false,
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    !fullWidth && 'button--auto-width',
    pill && 'button--pill',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {icon && iconPosition === 'right' && icon}
    </button>
  )
}
