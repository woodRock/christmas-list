'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Gift, HelpCircle, ListChecks, LogOut, ShoppingBag, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'
import Menu from '@/components/ui/Menu'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

const NAV = [
  { href: '/', label: 'My lists', Icon: ListChecks },
  { href: '/claimed-items', label: 'Shopping', Icon: ShoppingBag },
  { href: '/onboarding', label: 'Help', Icon: HelpCircle },
]

const HIDDEN_ON = ['/login', '/auth/update-password']

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' || pathname.startsWith('/list') : pathname.startsWith(href)
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const [supabase] = useState(createClient)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const name = (user?.user_metadata?.full_name as string | undefined) || user?.email
  const hideChrome = HIDDEN_ON.some((p) => pathname.startsWith(p))

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-line/80 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 rounded-lg" aria-label="Giftd home">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Gift className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">Giftd</span>
          </Link>

          {!loading && user && !hideChrome && (
            <div className="flex items-center gap-1">
              <div className="mr-2 hidden items-center gap-1 md:flex">
                {NAV.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive(pathname, href) ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      isActive(pathname, href) ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-muted hover:text-ink',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </Link>
                ))}
              </div>
              <Menu
                label="Account"
                items={[
                  { label: 'Profile & settings', href: '/profile', icon: <UserRound className="h-4 w-4" aria-hidden /> },
                  { label: 'Sign out', onSelect: signOut, icon: <LogOut className="h-4 w-4" aria-hidden /> },
                ]}
                trigger={({ open, toggle, id }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    aria-controls={open ? id : undefined}
                    aria-label="Account menu"
                    className="flex items-center rounded-full p-0.5 ring-offset-2 ring-offset-bg transition hover:ring-2 hover:ring-line-strong"
                  >
                    <Avatar name={name} id={user.id} />
                  </button>
                )}
              />
            </div>
          )}

          {!loading && !user && !hideChrome && (
            <Link href="/login" className={buttonClasses({ size: 'sm' })}>Sign in</Link>
          )}
        </div>
      </nav>

      {!loading && user && !hideChrome && (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        >
          <div className="mx-auto grid max-w-md grid-cols-4">
            {[...NAV, { href: '/profile', label: 'Profile', Icon: UserRound }].map(({ href, label, Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors', active ? 'text-primary' : 'text-muted')}
                >
                  <span className={cn('flex h-7 w-12 items-center justify-center rounded-full transition-colors', active && 'bg-primary-soft')}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
