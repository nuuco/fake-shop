import { useEffect, useState, useCallback } from 'react'
import {
  onAuthStateChanged,
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
      const message =
        error instanceof Error ? error.message : '로그인에 실패했습니다.'
      setErrorMessage(message)
    }
  }, [])

  const logout = useCallback(async () => {
    if (!auth) return
    setErrorMessage(null)
    try {
      await signOut(auth)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '로그아웃에 실패했습니다.'
      setErrorMessage(message)
    }
  }, [])

  return {
    status,
    user,
    errorMessage,
    loginWithGoogle,
    logout,
    isConfigured: isFirebaseConfigured,
  }
}
