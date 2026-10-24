import { cn } from './cn'

const palette = [
  'bg-[#e3efe8] text-[#1f5c45] dark:bg-[#1b3428] dark:text-[#8fd6b1]',
  'bg-[#fbe8eb] text-[#9b1f35] dark:bg-[#3a1b21] dark:text-[#f5a0ae]',
  'bg-[#f8eed6] text-[#8a6417] dark:bg-[#33291a] dark:text-[#e9c77c]',
  'bg-[#e6ecf7] text-[#2e4a7d] dark:bg-[#1c2538] dark:text-[#9db6e6]',
  'bg-[#efe6f5] text-[#5d3683] dark:bg-[#2a1f36] dark:text-[#c5a5e4]',
]

function hash(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function initials(name?: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?'
}

export default function Avatar({ name, id, size = 'md', className }: { name?: string | null; id?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-14 w-14 text-lg' }
  return (
    <span
      aria-hidden
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', palette[hash(id || name || '') % palette.length], sizes[size], className)}
    >
      {initials(name)}
    </span>
  )
}
