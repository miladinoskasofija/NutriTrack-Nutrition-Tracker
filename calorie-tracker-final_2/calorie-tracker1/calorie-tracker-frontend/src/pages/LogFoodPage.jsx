import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'

const MEAL_TYPES = [
  { value: 'BREAKFAST', label: 'Доручек', icon: '🌅' },
  { value: 'LUNCH', label: 'Ручек', icon: '☀️' },
  { value: 'DINNER', label: 'Вечера', icon: '🌙' },
  { value: 'SNACK', label: 'Ужина', icon: '🍎' },
]

// Брз избор на чести намирници - клик директно пребарува (олеснува почеток без празна страна)
const QUICK_PICKS = [
  { label: 'Банана', query: 'banana', emoji: '🍌' },
  { label: 'Пилешки гради', query: 'chicken breast', emoji: '🍗' },
  { label: 'Јајца', query: 'eggs', emoji: '🥚' },
  { label: 'Ориз', query: 'rice', emoji: '🍚' },
  { label: 'Овесна каша', query: 'oatmeal', emoji: '🥣' },
  { label: 'Грчки јогурт', query: 'greek yogurt', emoji: '🥛' },
  { label: 'Јаболко', query: 'apple', emoji: '🍎' },
  { label: 'Ореви', query: 'almonds', emoji: '🥜' },
]

// Дополнителни нутриенти прикажани во Nutrition Facts преглед (како MyFitnessPal)
const MICRO_NUTRIENTS = [
  { key: 'fiber', label: 'Влакна', unit: 'г' },
  { key: 'sugar', label: 'Шеќери', unit: 'г' },
  { key: 'sodium', label: 'Натриум', unit: 'мг' },
  { key: 'potassium', label: 'Калиум', unit: 'мг' },
  { key: 'calcium', label: 'Калциум', unit: 'мг' },
  { key: 'iron', label: 'Железо', unit: 'мг' },
  { key: 'vitaminC', label: 'Витамин Ц', unit: 'мг' },
]

function scaled(value, factor) {
  return Math.round(((value || 0) * factor) * 10) / 10
}

export default function LogFoodPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(100)
  const [mealType, setMealType] = useState('BREAKFAST')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setSearchError('')
      return
    }
    const timeout = setTimeout(async () => {
      setIsSearching(true)
      setSearchError('')
      try {
        const res = await apiClient.get('/foods/search', { params: { query } })
        setResults(res.data || [])
      } catch (err) {
        setResults([])
        const backendMessage = err.response?.data?.message
        setSearchError(
          backendMessage ||
          (err.code === 'ERR_NETWORK'
            ? 'Не можам да се поврзам со серверот. Провери дали backend-от работи.'
            : 'Пребарувањето не успеа. Пробај повторно.')
        )
      } finally {
        setIsSearching(false)
      }
    }, 400)
    return () => clearTimeout(timeout)
  }, [query])

  async function handleSaveEntry() {
    if (!selectedFood) return
    setIsSaving(true)
    setError('')
    try {
      const factor = quantity / 100
      await apiClient.post('/food-entries', {
        fdcId: selectedFood.fdcId,
        foodName: selectedFood.name,
        quantity,
        unit: 'g',
        mealType,
        calories: scaled(selectedFood.calories, factor),
        protein: scaled(selectedFood.protein, factor),
        carbs: scaled(selectedFood.carbs, factor),
        fat: scaled(selectedFood.fat, factor),
        fiber: scaled(selectedFood.fiber, factor),
        sugar: scaled(selectedFood.sugar, factor),
        sodium: scaled(selectedFood.sodium, factor),
        potassium: scaled(selectedFood.potassium, factor),
        calcium: scaled(selectedFood.calcium, factor),
        iron: scaled(selectedFood.iron, factor),
        vitaminC: scaled(selectedFood.vitaminC, factor),
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Не успеав да го зачувам оброкот. Пробај повторно.')
    } finally {
      setIsSaving(false)
    }
  }

  const factor = quantity / 100

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-5">
        <div className="max-w-md lg:max-w-3xl mx-auto flex items-center gap-4">
          <div className="w-11 h-11 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
            🍽️
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Додади храна</h1>
            <p className="text-sm text-gray-500 mt-0.5">Пребарај намирница или избери од популарните</p>
          </div>
        </div>
      </div>

      <div className="max-w-md lg:max-w-3xl mx-auto px-6 lg:px-10 pt-6 pb-6">

        {/* Избор на оброк - секогаш видлив, за контекст пред пребарување */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Внесувам за:</p>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt.value}
                onClick={() => setMealType(mt.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-colors ${
                  mealType === mt.value
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{mt.icon}</span>
                <span className="text-[11px] font-medium">{mt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Пребарувачко поле */}
        <div className="relative mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="на пр. chicken breast, banana..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Базата на податоци (USDA) е на англиски јазик - пребарувај со англиски термини за најдобри резултати.
        </p>

        {isSearching && <p className="text-sm text-gray-400 text-center py-4">Пребарувам...</p>}

        {searchError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-center mb-4">{searchError}</p>
        )}

        {!isSearching && !searchError && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Нема резултати за „{query}“.</p>
        )}

        {/* Резултати од пребарување */}
        {!selectedFood && results.length > 0 && (
          <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0 mb-6">
            {results.map((food) => (
              <button
                key={food.fdcId}
                onClick={() => setSelectedFood(food)}
                className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{food.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">на 100г</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">{food.calories} kcal</span>
              </button>
            ))}
          </div>
        )}

        {/* Популарни намирници - брз избор кога нема активно пребарување */}
        {!selectedFood && query.trim().length < 2 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-3">Популарни намирници</p>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_PICKS.map((item) => (
                <button
                  key={item.query}
                  onClick={() => setQuery(item.query)}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3.5 hover:border-primary-300 transition-colors text-left"
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <span className="text-sm font-medium text-gray-800">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Форма за внес + целосен Nutrition Facts преглед откако е избрана намирница */}
        {selectedFood && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden lg:max-w-lg">
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">{selectedFood.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">USDA база на податоци</p>
                </div>
                <button onClick={() => setSelectedFood(null)} className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0">
                  Промени
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Количина (г)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Оброк</label>
                <div className="grid grid-cols-4 gap-2">
                  {MEAL_TYPES.map((mt) => (
                    <button
                      key={mt.value}
                      onClick={() => setMealType(mt.value)}
                      className={`text-xs font-medium py-2 rounded-lg border transition-colors ${
                        mealType === mt.value
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {mt.icon} {mt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nutrition Facts преглед - слично на MyFitnessPal, скалирано според количината */}
            <div className="border-t-4 border-gray-900 mx-6"></div>
            <div className="px-6 pb-6 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-900 mb-3">Нутритивни вредности</p>

              <div className="flex items-baseline justify-between py-2 border-b-2 border-gray-900">
                <span className="text-sm font-bold text-gray-900">Калории</span>
                <span className="text-xl font-bold text-gray-900">{scaled(selectedFood.calories, factor)} kcal</span>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-700">Протеини</span>
                  <span className="font-medium text-gray-900">{scaled(selectedFood.protein, factor)}г</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-700">Јаглехидрати</span>
                  <span className="font-medium text-gray-900">{scaled(selectedFood.carbs, factor)}г</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-700">Масти</span>
                  <span className="font-medium text-gray-900">{scaled(selectedFood.fat, factor)}г</span>
                </div>
                {MICRO_NUTRIENTS.map((n) => (
                  <div key={n.key} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-500">{n.label}</span>
                    <span className="font-medium text-gray-700">{scaled(selectedFood[n.key], factor)}{n.unit}</span>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}

              <button
                onClick={handleSaveEntry}
                disabled={isSaving}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-full py-3.5 transition-colors disabled:opacity-50 mt-5"
              >
                {isSaving ? 'Се зачувува...' : 'Додади во дневникот'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
