import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cognitoRedirectUrl = import.meta.env.VITE_COGNITO_REDIRECT_URL;

export function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Login.jsx] window.location.hash:', window.location.hash);
    console.log('[Login.jsx] location.href:', window.location.href);
    console.log('[Login.jsx] location.hash:', window.location.hash);

    const hash = window.location.hash;
    if (hash.includes('id_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const token = params.get('id_token');
      console.log('token: ', token);
      if (token) {
        localStorage.setItem('id_token', token);
        navigate('/game', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = cognitoRedirectUrl;
  };

  return (
    <div className="login-page-wrapper">
      <h1>Login</h1>
      <button onClick={handleLogin} className="btn btn--new">
        Login with Cognito
      </button>
    </div>
  );
}
