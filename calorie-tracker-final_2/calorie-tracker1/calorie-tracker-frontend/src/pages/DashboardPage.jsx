import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api/client.js'

const FALLBACK_DATA = {
  user: { name: 'Корисник' },
  goals: {
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 120 },
    carbs: { current: 0, target: 220 },
    fat: { current: 0, target: 65 },
  },
  meals: [],
}

const MEAL_SECTIONS = [
  { type: 'BREAKFAST', label: 'Доручек', icon: '🌅' },
  { type: 'LUNCH', label: 'Ручек', icon: '☀️' },
  { type: 'DINNER', label: 'Вечера', icon: '🌙' },
  { type: 'SNACK', label: 'Ужина', icon: '🍎' },
]

function ProgressRing({ current, target }) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-40 h-40 lg:w-44 lg:h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="14" />
        <circle
          cx="80" cy="80" r={radius} fill="none" stroke="#0D9488" strokeWidth="14"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{current}</span>
        <span className="text-xs text-gray-500 mt-0.5">од {target} kcal</span>
      </div>
    </div>
  )
}

const MACRO_ICONS = {
  protein: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4" /><path d="M14 17c0-3 2-5 5-5" /><circle cx="19" cy="16" r="3" />
    </svg>
  ),
  carbs: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z" />
    </svg>
  ),
  fat: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

function MacroBar({ label, current, target, color, iconKey }) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <span style={{ color }}>{MACRO_ICONS[iconKey]}</span>
          {label}
        </span>
        <span className="text-xs text-gray-500">{current}г / {target}г</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(FALLBACK_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userRes, entriesRes] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/food-entries/today'),
        ])

        const meals = entriesRes.data || []
        const totals = meals.reduce(
          (acc, m) => ({
            calories: acc.calories + (m.calories || 0),
            protein: acc.protein + (m.protein || 0),
            carbs: acc.carbs + (m.carbs || 0),
            fat: acc.fat + (m.fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )

        setData({
          user: { name: userRes.data.username || 'Корисник' },
          goals: {
            calories: { current: Math.round(totals.calories), target: userRes.data.dailyCalorieGoal || 2000 },
            protein: { current: Math.round(totals.protein), target: userRes.data.dailyProteinGoal || 120 },
            carbs: { current: Math.round(totals.carbs), target: userRes.data.dailyCarbGoal || 220 },
            fat: { current: Math.round(totals.fat), target: userRes.data.dailyFatGoal || 65 },
          },
          meals,
        })
      } catch (err) {
        console.warn('Не можев да ги вчитам dashboard податоците:', err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const { user, goals, meals } = data
  const today = new Date().toLocaleDateString('mk-MK', { weekday: 'long', day: 'numeric', month: 'long' })
  const remaining = goals.calories.target - goals.calories.current

  // Групирање на оброците по тип (Доручек/Ручек/Вечера/Ужина), со посебна сума за секој
  const mealsByType = MEAL_SECTIONS.map((section) => {
    const entries = meals.filter((m) => m.mealType === section.type)
    const subtotal = entries.reduce((sum, e) => sum + (e.calories || 0), 0)
    return { ...section, entries, subtotal }
  })

  return (
    <div>
      <div className="relative h-40 lg:h-56 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?fm=jpg&q=70&w=1200&auto=format&fit=crop"
          alt="Свежа зеленчукова салата"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative h-full max-w-md lg:max-w-5xl mx-auto px-6 lg:px-10 flex flex-col justify-end pb-5">
          <p className="text-white/80 text-xs lg:text-sm capitalize">{today}</p>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl lg:text-2xl font-bold mt-0.5">Здраво, {user.name} 👋</h1>
            <Link to="/profile" className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold lg:hidden border border-white/30">
              {user.name.charAt(0)}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md lg:max-w-5xl mx-auto px-6 lg:px-10 pt-6 pb-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-5 lg:space-y-0">

          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
              <ProgressRing current={goals.calories.current} target={goals.calories.target} />
              <p className="text-sm text-gray-500 mt-4 text-center">
                {remaining > 0 ? (
                  <>Уште <span className="font-semibold text-gray-900">{remaining} kcal</span> до целта</>
                ) : (
                  <span className="font-semibold text-primary-700">Целта е достигната! 🎉</span>
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-1">Макронутриенти</h2>
              <MacroBar label="Протеини" iconKey="protein" current={goals.protein.current} target={goals.protein.target} color="#0D9488" />
              <MacroBar label="Јаглехидрати" iconKey="carbs" current={goals.carbs.current} target={goals.carbs.target} color="#D97706" />
              <MacroBar label="Масти" iconKey="fat" current={goals.fat.current} target={goals.fat.target} color="#DC2626" />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <Link to="/chat" className="flex items-center gap-4 bg-gray-900 rounded-2xl p-5 text-white hover:bg-gray-800 transition-colors">
              <div className="w-11 h-11 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">Прашај го AI асистентот</p>
                <p className="text-xs text-white/60 mt-0.5">Персонализирани совети за исхрана</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/40 ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>

            {/* Оброци групирани по тип - Доручек / Ручек / Вечера / Ужина, секој со своја сума */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">Денешни оброци</h2>
                <Link to="/history" className="text-xs font-medium text-primary-600 hover:text-primary-700">Види сè</Link>
              </div>

              {isLoading ? (
                <p className="text-sm text-gray-400 text-center py-4">Се вчитува...</p>
              ) : meals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 mb-3">Сè уште нема внесени оброци денес.</p>
                  <Link to="/log-food" className="inline-block text-sm font-semibold text-primary-700 hover:text-primary-800">
                    + Додади прв оброк
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {mealsByType.map((section) => (
                    <div key={section.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
                          <span>{section.icon}</span>
                          {section.label}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {section.subtotal > 0 ? `${section.subtotal} kcal` : '—'}
                        </span>
                      </div>

                      {section.entries.length === 0 ? (
                        <p className="text-xs text-gray-400 pl-1">Нема внесено ништо сè уште</p>
                      ) : (
                        <div className="space-y-2 pl-1">
                          {section.entries.map((meal) => (
                            <div key={meal.id} className="flex items-center justify-between">
                              <p className="text-sm text-gray-700">{meal.foodName}</p>
                              <span className="text-xs text-gray-500">{meal.calories} kcal</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
