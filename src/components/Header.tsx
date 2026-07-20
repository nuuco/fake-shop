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

function IconShop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 9.5h16l-1.2 10.2a1.5 1.5 0 0 1-1.5 1.3H6.7a1.5 1.5 0 0 1-1.5-1.3L4 9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.5V7.2a3.5 3.5 0 0 1 7 0v2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3.5 5.5h2.1l1.4 11.2a1.5 1.5 0 0 0 1.5 1.3h8.6a1.5 1.5 0 0 0 1.5-1.3L19.5 8H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="20" r="1.2" fill="currentColor" />
    </svg>
  )
}

function IconLogin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 19.2c1.6-3 4-4.5 6.5-4.5s4.9 1.5 6.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M10 5.5H7.2A1.7 1.7 0 0 0 5.5 7.2v9.6c0 .9.8 1.7 1.7 1.7H10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10.5 12H19M16 8.5 19.5 12 16 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Header({ brand }: HeaderProps) {
  const cartCount = useAppSelector(selectCartCount)
  const { status, user, logout } = useAuthContext()
  const [scrolled, setScrolled] = useState(false)
  const displayName = user?.displayName ?? maskEmail(user?.email ?? null) ?? '회원'

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
          <Link to="/" className="site-header__link" aria-label="Shop">
            <span className="site-header__label">Shop</span>
            <span className="site-header__icon">
              <IconShop />
            </span>
          </Link>

          <Link to="/cart" className="site-header__link site-header__cart" aria-label={`Cart (${cartCount})`}>
            <span className="site-header__label">Cart ({cartCount})</span>
            <span className="site-header__icon site-header__icon--cart">
              <IconCart />
              {cartCount > 0 && <span className="site-header__count">{cartCount}</span>}
            </span>
          </Link>

          {status === 'loading' && <span className="site-header__muted">…</span>}

          {status !== 'loading' && user && (
            <div className="site-header__user">
              <span
                className="site-header__initial"
                data-tooltip={displayName}
                aria-label={`${displayName}님 로그인 중`}
                tabIndex={0}
              >
                {(user.displayName ?? user.email ?? 'M').trim().charAt(0).toUpperCase()}
              </span>
              <button
                type="button"
                className="site-header__link site-header__action"
                onClick={() => void logout()}
                aria-label="Logout"
              >
                <span className="site-header__label">Logout</span>
                <span className="site-header__icon">
                  <IconLogout />
                </span>
              </button>
            </div>
          )}

          {status !== 'loading' && !user && (
            <Link to="/login" className="site-header__link" aria-label="Login">
              <span className="site-header__label">Login</span>
              <span className="site-header__icon">
                <IconLogin />
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
