import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'

export function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  )
}
