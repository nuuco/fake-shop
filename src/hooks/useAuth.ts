import { useEffect, useState, useCallback } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase'
import type { AuthStatus, AuthUser } from '../types/auth'

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }
}

function mapAuthError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code: string }).code)
    switch (code) {
      case 'auth/invalid-email':
        return '이메일 형식이 올바르지 않습니다.'
      case 'auth/user-disabled':
        return '비활성화된 계정입니다.'
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return '이메일 또는 비밀번호가 올바르지 않습니다.'
      case 'auth/email-already-in-use':
        return '이미 가입된 이메일입니다. 로그인으로 시도해 보세요.'
      case 'auth/weak-password':
        return '비밀번호는 6자 이상이어야 합니다.'
      case 'auth/too-many-requests':
        return '시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.'
      case 'auth/popup-closed-by-user':
        return '로그인 팝업이 닫혔습니다.'
      default:
        break
    }
  }
  return error instanceof Error ? error.message : '인증에 실패했습니다.'
}

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setStatus('unauthenticated')
      setErrorMessage(null)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser(toAuthUser(firebaseUser))
          setStatus('authenticated')
          setErrorMessage(null)
        } else {
          setUser(null)
          setStatus('unauthenticated')
        }
      },
      (error) => {
        setUser(null)
        setStatus('error')
        setErrorMessage(error.message)
      },
    )

    return unsubscribe
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!auth) {
      setErrorMessage('Firebase가 설정되지 않아 로그인할 수 없습니다.')
      return
    }
    setErrorMessage(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setErrorMessage(mapAuthError(error))
    }
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) {
      setErrorMessage('Firebase가 설정되지 않아 로그인할 수 없습니다.')
      return
    }
    setErrorMessage(null)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (error) {
      setErrorMessage(mapAuthError(error))
    }
  }, [])

  const signupWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) {
      setErrorMessage('Firebase가 설정되지 않아 가입할 수 없습니다.')
      return
    }
    setErrorMessage(null)
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
    } catch (error) {
      setErrorMessage(mapAuthError(error))
    }
  }, [])

  const logout = useCallback(async () => {
    if (!auth) return
    setErrorMessage(null)
    try {
      await signOut(auth)
    } catch (error) {
      setErrorMessage(mapAuthError(error))
    }
  }, [])

  return {
    status,
    user,
    errorMessage,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    isConfigured: isFirebaseConfigured,
  }
}
