import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Game } from './pages/game/Game'
import { Login } from './pages/login/Login'

function App() {
  const token = localStorage.getItem('id_token')

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='/game'
          element={token ? <Game /> : <Navigate to='/login' replace />}
        />
        <Route
          path='*'
          element={<Navigate to={token ? '/game' : '/login'} replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
