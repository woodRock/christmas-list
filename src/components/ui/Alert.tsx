import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from './cn'

type Tone = 'error' | 'success' | 'info'

const tones: Record<Tone, { className: string; Icon: typeof Info }> = {
  error: { className: 'bg-accent-soft text-accent', Icon: AlertCircle },
  success: { className: 'bg-primary-soft text-primary', Icon: CheckCircle2 },
  info: { className: 'bg-gold-soft text-gold', Icon: Info },
}

export default function Alert({ tone = 'error', children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  const { className: toneClass, Icon } = tones[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('flex gap-2.5 rounded-xl px-3.5 py-3 text-sm', toneClass, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 break-words">{children}</div>
    </div>
  )
}
