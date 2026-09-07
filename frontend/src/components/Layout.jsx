import { Link, NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-teal-50 text-teal-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export default function Layout() {
  return (
    <div className="min-h-svh bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
    
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              1Fi Marketplace
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Main">
            <NavLink to="/" end className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/marketplace" className={navLinkClass}>
              Marketplace
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6">
          1Fi SDE Intern Assignment — demo marketplace powered by mutual-fund-backed EMI.
        </div>
      </footer>
    </div>
  )
}
