import { Link, Outlet, useLocation } from 'react-router-dom'

export function NavBar() {
  const location = useLocation()

  return (
    <>
      <nav className='navbar'>
        <ul className='nav-links'>
          <li>
            <Link
              to='/game'
              className={location.pathname === '/game' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to='/scores'
              className={location.pathname === '/scores' ? 'active' : ''}
            >
              Scores
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}
