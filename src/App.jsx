import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Game } from './pages/game/Game'
import { Login } from './pages/login/Login'
import { Scores } from './pages/scores/Scores'
import { PublicRoute } from './routes/PublicRoute'
import { PrivateRoute } from './routes/PrivateRoute'

function App() {
  const [token, setToken] = useState(localStorage.getItem('id_token'))

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('id_token')
      if (storedToken && storedToken !== token) {
        setToken(storedToken)
      }
    }

    window.addEventListener('storage', checkToken)
    checkToken()

    return () => window.removeEventListener('storage', checkToken)
  }, [token])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
        </Route>

        {/* Private Routes with NavBar */}
        <Route element={<PrivateRoute />}>
          <Route path='/game' element={<Game />} />
          <Route path='/scores' element={<Scores />} />
        </Route>

        {/* Fallback */}
        <Route
          path='*'
          element={<Navigate to={token ? '/game' : '/login'} replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
