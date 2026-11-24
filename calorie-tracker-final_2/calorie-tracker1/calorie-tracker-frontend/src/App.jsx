import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from './context/AuthContext.jsx'
import AuthenticatedLayout from './components/AuthenticatedLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LogFoodPage from './pages/LogFoodPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Заедничка школка (Sidebar на десктоп / BottomNav на мобилен) за сите најавени страни */}
          <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/log-food" element={<LogFoodPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
