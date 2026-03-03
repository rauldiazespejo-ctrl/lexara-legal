import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface AuthUser {
  email: string
  nombre: string
  rol: 'superadmin' | 'admin' | 'abogado'
  avatar: string
}

const SUPER_ADMINS = ['rauldiazespejo@gmail.com']

const USERS_DB: Record<string, { password: string; nombre: string; rol: AuthUser['rol']; avatar: string }> = {
  'rauldiazespejo@gmail.com': { password: 'Lexara2024!', nombre: 'Raúl Díaz Espejo', rol: 'superadmin', avatar: 'RD' },
  'mgonzalez@lexara.cl': { password: 'Lexara2024!', nombre: 'María González R.', rol: 'admin', avatar: 'MG' },
  'amunoz@lexara.cl': { password: 'Lexara2024!', nombre: 'Andrés Muñoz', rol: 'abogado', avatar: 'AM' },
}

interface AuthContextType {
  user: AuthUser | null
  isSuperAdmin: boolean
  canDelete: boolean
  canCreate: boolean
  canEditFramework: boolean
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('lexara_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const isSuperAdmin = user?.rol === 'superadmin' || (user ? SUPER_ADMINS.includes(user.email) : false)
  const canDelete = isSuperAdmin || user?.rol === 'admin'
  const canCreate = !!user
  const canEditFramework = isSuperAdmin

  useEffect(() => {
    if (user) localStorage.setItem('lexara_user', JSON.stringify(user))
    else localStorage.removeItem('lexara_user')
  }, [user])

  const login = (email: string, password: string) => {
    const found = USERS_DB[email.toLowerCase().trim()]
    if (!found) return { ok: false, error: 'Correo no registrado en el sistema' }
    if (found.password !== password) return { ok: false, error: 'Contraseña incorrecta' }
    setUser({ email: email.toLowerCase().trim(), nombre: found.nombre, rol: found.rol, avatar: found.avatar })
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isSuperAdmin, canDelete, canCreate, canEditFramework, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
