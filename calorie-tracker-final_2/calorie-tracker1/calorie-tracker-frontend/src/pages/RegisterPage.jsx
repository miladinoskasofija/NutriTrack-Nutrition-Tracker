import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from '../components/Logo.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Лозинките не се совпаѓаат.')
      return
    }
    if (password.length < 6) {
      setError('Лозинката треба да има најмалку 6 карактери.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiClient.post('/auth/register', {
        username: name,
        email,
        password,
      })
      login(response.data.token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Веќе постои профил со тој email.')
      } else {
        setError('Нешто тргна наопаку. Пробај повторно.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">

        <div
          className="h-56 relative overflow-hidden"
          style={{
            borderBottomLeftRadius: '55% 30%',
            borderBottomRightRadius: '55% 30%',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1641536885341-301aeb52f1c0?fm=jpg&q=80&w=800&auto=format&fit=crop"
            alt="Здрав оброк со гранола, овошје и јогурт"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-8 pt-8 pb-10">
          <div className="flex justify-center mb-5">
            <Logo size={40} showText={false} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Регистрирај се</h1>
          <p className="text-sm text-gray-500 text-center mt-2 mb-8">
            Направи си профил на NutriTrack
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Име и презиме"
                className="w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 px-0.5 py-2 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 px-0.5 py-2 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Лозинка"
                className="w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 px-0.5 py-2 pr-8 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Скриј лозинка' : 'Прикажи лозинка'}
                className="absolute right-0.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-6.5 0-10-7-10-7a19.4 19.4 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a19.5 19.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Потврди лозинка"
                className="w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 px-0.5 py-2 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm rounded-full py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Се креира профил...' : 'Регистрирај се'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Веќе имаш профил?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Најави се
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
