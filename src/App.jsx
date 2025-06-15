import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Game } from './pages/game/Game';
import { Login } from './pages/login/Login';
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('id_token'));

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('id_token');
      if (storedToken && storedToken !== token) {
        setToken(storedToken);
      }
    };

    window.addEventListener('storage', checkToken);
    // Also check after redirect
    checkToken();

    return () => window.removeEventListener('storage', checkToken);
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={token ? <Game /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={token ? '/game' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
