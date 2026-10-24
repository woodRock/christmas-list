export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="mb-3 h-9 w-56 rounded-xl bg-surface-muted" />
      <div className="mb-8 h-4 w-40 rounded-lg bg-surface-muted" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-surface-muted" />
        ))}
      </div>
    </div>
  )
}
