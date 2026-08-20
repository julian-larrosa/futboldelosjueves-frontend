import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`h-10 w-full rounded-lg border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        invalid
          ? 'border-destructive focus:ring-destructive/60'
          : 'border-border focus:border-ring focus:ring-ring/60'
      } ${className}`}
      {...props}
    />
  )
})