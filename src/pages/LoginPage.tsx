import { Link, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { maskEmail } from '../utils/format'
import './LoginPage.css'

export function LoginPage() {
  const { status, user, errorMessage, loginWithGoogle, isConfigured } = useAuthContext()

  if (status === 'loading') {
    return (
      <section className="login">
        <p className="state-message" role="status">
          인증 상태를 확인하는 중입니다…
        </p>
      </section>
    )
  }

  if (status === 'authenticated' && user) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="login">
      <h1>로그인</h1>
      <p className="login__lead">
        Google 계정으로 로그인합니다. 비로그인 상태에서도 상품 열람과 장바구니를 사용할 수
        있습니다.
      </p>

      {!isConfigured && (
        <div className="banner banner--warn" role="alert">
          <p>
            Firebase 환경 변수가 없습니다. `.env.example`을 참고해 `.env`를 만들고 개발 서버를
            재시작하세요.
          </p>
        </div>
      )}

      {isConfigured && errorMessage && (
        <div className="banner banner--error" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => void loginWithGoogle()}
        disabled={!isConfigured}
      >
        Google로 로그인
      </button>

      {user && (
        <p className="login__hint">현재 사용자: {user.displayName ?? maskEmail(user.email)}</p>
      )}

      <Link to="/" className="login__back">
        상품 목록으로 돌아가기
      </Link>
    </section>
  )
}
