export default function Loading({ label = 'Loading...' }) {
  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}
