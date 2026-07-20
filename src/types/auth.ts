export type AuthUser = {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'
