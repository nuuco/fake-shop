import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { BRAND_NAME } from '../constants/brand'
import './LoginPage.css'

export function LoginPage() {
  const { status, user, errorMessage, loginWithGoogle, isConfigured } = useAuthContext()
  const [pending, setPending] = useState(false)

  if (status === 'loading') {
    return (
      <div className="login-page page-container">
        <section className="login" aria-busy="true">
          <p className="login__eyebrow">{BRAND_NAME}</p>
          <h1>Login</h1>
          <p className="state-message" role="status">
            인증 상태를 확인하는 중입니다…
          </p>
        </section>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleGoogleLogin = async () => {
    setPending(true)
    try {
      await loginWithGoogle()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="login-page page-container">
      <section className="login">
        <div className="login__intro">
          <p className="login__eyebrow">{BRAND_NAME}</p>
          <h1>Login</h1>
          <p className="login__lead">
            Google 계정으로 간편하게 로그인하세요.
            <br />
            비회원으로도 상품을 보고 장바구니에 담을 수 있습니다.
          </p>
        </div>

        {!isConfigured && (
          <div className="login__notice login__notice--warn" role="alert">
            <p className="login__notice-title">설정이 필요합니다</p>
            <p>
              Firebase 환경 변수가 없습니다. <code>.env.example</code>을 참고해{' '}
              <code>.env</code>를 만든 뒤 개발 서버를 재시작하세요.
            </p>
          </div>
        )}

        {isConfigured && errorMessage && (
          <div className="login__notice login__notice--error" role="alert">
            <p className="login__notice-title">로그인에 실패했습니다</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="login__actions">
          <button
            type="button"
            className="login__google"
            onClick={() => void handleGoogleLogin()}
            disabled={!isConfigured || pending}
          >
            {pending ? 'Connecting…' : 'Continue with Google'}
          </button>
          <p className="login__hint">팝업이 차단되면 브라우저에서 허용해 주세요.</p>
        </div>

        <ul className="login__notes">
          <li>담아 둔 상품은 이 기기에 자동으로 기억됩니다.</li>
          <li>로그아웃 후에도 담아 둔 상품은 유지됩니다.</li>
        </ul>

        <Link to="/" className="login__back">
          ← Back to shop
        </Link>
      </section>
    </div>
  )
}
