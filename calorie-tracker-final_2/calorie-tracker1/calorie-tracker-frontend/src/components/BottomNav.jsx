import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Дома',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'Историја',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  { to: '/log-food', label: '', icon: null, isCenter: true },
  {
    to: '/chat',
    label: 'Асистент',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Профил',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 py-2 relative">
        {NAV_ITEMS.map((item) => {
          if (item.isCenter) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="w-14 h-14 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 transition-colors -mt-8 border-4 border-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </Link>
            )
          }

          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon(active)}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
