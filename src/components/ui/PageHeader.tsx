import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PageHeader({ title, description, back, actions }: { title: React.ReactNode; description?: React.ReactNode; back?: { href: string; label: string }; actions?: React.ReactNode }) {
  return (
    <header className="mb-6 sm:mb-8">
      {back && (
        <Link href={back.href} className="-ml-1 mb-3 inline-flex items-center gap-1 rounded-lg px-1 py-0.5 text-sm text-muted transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl break-words">{title}</h1>
          {description && <p className="mt-1.5 text-[15px] text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
