import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { BRAND_NAME } from '../constants/brand'
import './LoginPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type AuthMode = 'login' | 'signup'

function getEmailState(value: string, touched: boolean) {
  if (!touched || value.length === 0) return 'idle' as const
  return EMAIL_PATTERN.test(value.trim()) ? ('valid' as const) : ('invalid' as const)
}

function getPasswordState(value: string, touched: boolean) {
  if (!touched || value.length === 0) return 'idle' as const
  return value.length >= 6 ? ('valid' as const) : ('invalid' as const)
}

export function LoginPage() {
  const {
    status,
    user,
    errorMessage,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    isConfigured,
  } = useAuthContext()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [pending, setPending] = useState<'email' | 'google' | null>(null)

  const emailState = useMemo(() => getEmailState(email, emailTouched), [email, emailTouched])
  const passwordState = useMemo(
    () => getPasswordState(password, passwordTouched),
    [password, passwordTouched],
  )
  const formValid = emailState === 'valid' && passwordState === 'valid'

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

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)
    if (!EMAIL_PATTERN.test(email.trim()) || password.length < 6) return

    setPending('email')
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password)
      } else {
        await signupWithEmail(email, password)
      }
    } finally {
      setPending(null)
    }
  }

  const handleGoogleLogin = async () => {
    setPending('google')
    try {
      await loginWithGoogle()
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="login-page page-container">
      <section className="login">
        <div className="login__intro">
          <p className="login__eyebrow">{BRAND_NAME}</p>
          <h1>{mode === 'login' ? 'Login' : 'Sign up'}</h1>
          <p className="login__lead">
            이메일·비밀번호 또는 Google 계정으로 {mode === 'login' ? '로그인' : '가입'}하세요.
            <br />
            비회원으로도 상품을 보고 장바구니에 담을 수 있습니다.
          </p>
        </div>

        <div className="login__tabs" role="tablist" aria-label="인증 방식">
          <button
            type="button"
            role="tab"
            className={`login__tab${mode === 'login' ? ' is-active' : ''}`}
            aria-selected={mode === 'login'}
            onClick={() => setMode('login')}
          >
            로그인
          </button>
          <button
            type="button"
            role="tab"
            className={`login__tab${mode === 'signup' ? ' is-active' : ''}`}
            aria-selected={mode === 'signup'}
            onClick={() => setMode('signup')}
          >
            회원가입
          </button>
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
            <p className="login__notice-title">
              {mode === 'login' ? '로그인에 실패했습니다' : '회원가입에 실패했습니다'}
            </p>
            <p>{errorMessage}</p>
          </div>
        )}

        <form className="login__form" onSubmit={(event) => void handleEmailSubmit(event)} noValidate>
          <div className={`login__field${emailState === 'invalid' ? ' is-invalid' : ''}${emailState === 'valid' ? ' is-valid' : ''}`}>
            <label htmlFor="login-email">이메일</label>
            <div className="login__control">
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setEmailTouched(true)}
                disabled={!isConfigured || pending !== null}
                placeholder="you@example.com"
                required
              />
              {emailState === 'valid' && (
                <span className="login__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </div>
            {emailState === 'invalid' && (
              <p className="login__field-error" role="alert">
                올바른 이메일 주소를 입력해 주세요.
              </p>
            )}
          </div>

          <div
            className={`login__field${passwordState === 'invalid' ? ' is-invalid' : ''}${passwordState === 'valid' ? ' is-valid' : ''}`}
          >
            <label htmlFor="login-password">비밀번호</label>
            <div className="login__control">
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setPasswordTouched(true)}
                disabled={!isConfigured || pending !== null}
                placeholder="6자 이상"
                minLength={6}
                required
              />
              {passwordState === 'valid' && (
                <span className="login__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </div>
            {passwordState === 'invalid' && (
              <p className="login__field-error" role="alert">
                비밀번호는 6자 이상이어야 합니다.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login__submit"
            disabled={!isConfigured || pending !== null || !formValid}
          >
            {pending === 'email'
              ? mode === 'login'
                ? '로그인 중…'
                : '가입 중…'
              : mode === 'login'
                ? '이메일로 로그인'
                : '이메일로 가입'}
          </button>
        </form>

        <div className="login__divider" aria-hidden="true">
          <span>or</span>
        </div>

        <div className="login__actions">
          <button
            type="button"
            className="login__google"
            onClick={() => void handleGoogleLogin()}
            disabled={!isConfigured || pending !== null}
          >
            {pending === 'google' ? 'Connecting…' : 'Continue with Google'}
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
