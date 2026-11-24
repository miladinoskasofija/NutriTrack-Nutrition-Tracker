import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'

/**
 * Заеднички "школка" за сите најавени страни:
 * - Sidebar лево на широки екрани (десктоп/лаптоп)
 * - BottomNav долу на мали екрани (мобилен/таблет)
 * Секоја страна само го рендерира својот content преку <Outlet />.
 */
export default function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />
      <main className="lg:pl-64 pb-24 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
