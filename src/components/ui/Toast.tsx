'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from './cn'

type ToastTone = 'success' | 'error'

interface ToastOptions {
  tone?: ToastTone
  action?: { label: string; onClick: () => void }
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
  message: string
}

const ToastContext = createContext<((message: string, options?: ToastOptions) => void) | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const toast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = ++nextId.current
    setToasts((t) => [...t.slice(-2), { id, message, ...options }])
    setTimeout(() => dismiss(id), options.duration ?? (options.action ? 6000 : 3500))
  }, [dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
      >
        {toasts.map((t) => {
          const Icon = t.tone === 'error' ? AlertCircle : CheckCircle2
          return (
            <div
              key={t.id}
              role={t.tone === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink py-3 pl-4 pr-2 text-sm text-bg shadow-lift animate-toast-in"
            >
              <Icon className={cn('h-4 w-4 shrink-0', t.tone === 'error' ? 'text-accent' : 'text-primary')} aria-hidden />
              <span className="min-w-0 flex-1">{t.message}</span>
              {t.action && (
                <button
                  type="button"
                  className="rounded-lg px-2.5 py-1.5 font-semibold text-bg underline-offset-2 hover:underline"
                  onClick={() => {
                    t.action?.onClick()
                    dismiss(t.id)
                  }}
                >
                  {t.action.label}
                </button>
              )}
              <button type="button" onClick={() => dismiss(t.id)} className="rounded-lg p-1.5 opacity-70 hover:opacity-100" aria-label="Dismiss">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
