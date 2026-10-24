'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from './cn'

export interface MenuItem {
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  href?: string
  destructive?: boolean
  disabled?: boolean
}

/** Small dropdown menu used for overflow and account actions. */
export default function Menu({ trigger, items, label, align = 'right' }: { trigger: (props: { open: boolean; toggle: () => void; id: string }) => React.ReactNode; items: MenuItem[]; label: string; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus()
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const els = Array.from(ref.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])
    const i = els.indexOf(document.activeElement as HTMLElement)
    els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus()
  }

  const itemClass = (item: MenuItem) =>
    cn(
      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus:outline-none',
      item.destructive ? 'text-accent hover:bg-accent-soft focus:bg-accent-soft' : 'text-ink hover:bg-surface-muted focus:bg-surface-muted',
      item.disabled && 'pointer-events-none opacity-50',
    )

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o), id })}
      {open && (
        <div
          id={id}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          className={cn('absolute z-40 mt-2 min-w-52 rounded-xl border border-line bg-surface p-1.5 shadow-lift animate-pop-in', align === 'right' ? 'right-0' : 'left-0')}
        >
          {items.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} role="menuitem" className={itemClass(item)} onClick={() => setOpen(false)}>
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={itemClass(item)}
                onClick={() => {
                  setOpen(false)
                  item.onSelect?.()
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
