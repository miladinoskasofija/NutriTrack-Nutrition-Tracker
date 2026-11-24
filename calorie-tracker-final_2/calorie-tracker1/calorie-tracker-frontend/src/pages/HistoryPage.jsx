import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

const MEAL_TYPE_LABELS = {
  BREAKFAST: 'Доручек',
  LUNCH: 'Ручек',
  DINNER: 'Вечера',
  SNACK: 'Ужина',
}

function groupByDate(entries) {
  const groups = {}
  for (const entry of entries) {
    const date = (entry.consumedAt || '').slice(0, 10)
    if (!groups[date]) groups[date] = []
    groups[date].push(entry)
  }
  return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Денес'
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
  return date.toLocaleDateString('mk-MK', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function HistoryPage() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await apiClient.get('/food-entries')
        setEntries(res.data || [])
      } catch (err) {
        setEntries([])
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [])

  const grouped = groupByDate(entries)

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-5">
        <div className="max-w-md lg:max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Историја</h1>
          <p className="text-sm text-gray-500 mt-0.5">Преглед на твоите претходни оброци</p>
        </div>
      </div>

      <div className="max-w-md lg:max-w-3xl mx-auto px-6 lg:px-10 pt-6 pb-6 space-y-6">
        {isLoading && <p className="text-sm text-gray-400 text-center py-8">Се вчитува...</p>}

        {!isLoading && grouped.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400">Сè уште немаш внесени оброци.</p>
          </div>
        )}

        {grouped.map(([date, dayEntries]) => {
          const dayTotal = dayEntries.reduce((sum, e) => sum + (e.calories || 0), 0)
          return (
            <div key={date}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 capitalize">{formatDateLabel(date)}</h2>
                <span className="text-xs text-gray-500">{dayTotal} kcal вкупно</span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.foodName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {MEAL_TYPE_LABELS[entry.mealType] || entry.mealType} · {entry.quantity}{entry.unit}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{entry.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
