import { Navigate, Outlet } from 'react-router-dom'
import { NavBar } from '../components/NavBar'

export function PrivateRoute() {
  const token = localStorage.getItem('id_token')
  return token ? (
    <>
      <NavBar />
      <Outlet />
    </>
  ) : (
    <Navigate to='/login' replace />
  )
}
