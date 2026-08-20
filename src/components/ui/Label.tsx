import type { LabelHTMLAttributes, ReactNode } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label className={`mb-1.5 block text-sm font-medium text-foreground ${className}`} {...props}>
      {children}
    </label>
  )
}