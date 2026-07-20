import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useAppSelector } from '../store/hooks'
import { selectCartCount } from '../store/cartSlice'
import { maskEmail } from '../utils/format'
import './Header.css'

type HeaderProps = {
  brand: string
}

export function Header({ brand }: HeaderProps) {
  const cartCount = useAppSelector(selectCartCount)
  const { status, user, logout } = useAuthContext()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          {brand}
        </Link>
        <nav className="site-header__nav" aria-label="주요 메뉴">
          <Link to="/">Shop</Link>
          <Link to="/cart" className="site-header__cart">
            Cart{cartCount > 0 ? ` (${cartCount})` : ' (0)'}
          </Link>
          {status === 'loading' && <span className="site-header__muted">…</span>}
          {status !== 'loading' && user && (
            <div className="site-header__user">
              <span className="site-header__name">
                {user.displayName ?? maskEmail(user.email) ?? '회원'}
              </span>
              <button type="button" className="btn--login" onClick={() => void logout()}>
                Logout
              </button>
            </div>
          )}
          {status !== 'loading' && !user && (
            <Link to="/login" className="btn--login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
