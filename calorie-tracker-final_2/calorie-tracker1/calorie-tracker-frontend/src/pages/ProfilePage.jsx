import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState({ username: '', email: '' })
  const [goals, setGoals] = useState({
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 120,
    dailyCarbGoal: 220,
    dailyFatGoal: 65,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiClient.get('/users/me')
        setUser({ username: res.data.username || '', email: res.data.email || '' })
        setGoals({
          dailyCalorieGoal: res.data.dailyCalorieGoal || 2000,
          dailyProteinGoal: res.data.dailyProteinGoal || 120,
          dailyCarbGoal: res.data.dailyCarbGoal || 220,
          dailyFatGoal: res.data.dailyFatGoal || 65,
        })
      } catch (err) {
        // fallback остава default вредности
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function handleSaveGoals(e) {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')
    try {
      await apiClient.put('/users/me', goals)
      setSaveMessage('Целите се зачувани успешно.')
    } catch (err) {
      setSaveMessage('Не успеав да ги зачувам целите. Пробај повторно.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function updateGoal(key, value) {
    setGoals((prev) => ({ ...prev, [key]: Number(value) }))
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-5">
        <div className="max-w-md lg:max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Профил</h1>
        </div>
      </div>

      <div className="max-w-md lg:max-w-2xl mx-auto px-6 lg:px-10 pt-6 pb-6 space-y-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl flex-shrink-0">
            {(user.username || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{isLoading ? 'Се вчитува...' : user.username || 'Корисник'}</p>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveGoals} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Дневни нутритивни цели</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Калории (kcal)</label>
            <input
              type="number"
              min="0"
              value={goals.dailyCalorieGoal}
              onChange={(e) => updateGoal('dailyCalorieGoal', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Протеини (г)</label>
              <input
                type="number" min="0"
                value={goals.dailyProteinGoal}
                onChange={(e) => updateGoal('dailyProteinGoal', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Јаглехидрати (г)</label>
              <input
                type="number" min="0"
                value={goals.dailyCarbGoal}
                onChange={(e) => updateGoal('dailyCarbGoal', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Масти (г)</label>
              <input
                type="number" min="0"
                value={goals.dailyFatGoal}
                onChange={(e) => updateGoal('dailyFatGoal', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {saveMessage && <p className="text-sm text-primary-700 text-center">{saveMessage}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-full py-3 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Се зачувува...' : 'Зачувај цели'}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full lg:hidden bg-white border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600 font-medium text-sm rounded-full py-3 transition-colors"
        >
          Одјави се
        </button>
      </div>
    </div>
  )
}
