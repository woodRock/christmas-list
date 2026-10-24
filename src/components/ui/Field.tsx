import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from './cn'

export const inputClasses = cn(
  'block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink',
  'placeholder:text-muted/70 transition-colors',
  'hover:border-line-strong focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15',
  'disabled:opacity-60',
)

interface FieldProps {
  label: string
  htmlFor: string
  hint?: React.ReactNode
  optional?: boolean
  children: React.ReactNode
  className?: string
}

export function Field({ label, htmlFor, hint, optional, children, className }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(inputClasses, className)} {...props} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(inputClasses, 'resize-y min-h-20', className)} {...props} />
})

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, ...props },
  ref,
) {
  return (
    <div className={cn('relative', className)}>
      <select ref={ref} className={cn(inputClasses, 'appearance-none pr-10')} {...props} />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  )
})
