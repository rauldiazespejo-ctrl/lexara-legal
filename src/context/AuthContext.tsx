import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { hashAuthPassword } from '../utils/passwordHash'

export interface AuthUser {
  email: string
  nombre: string
  rol: 'superadmin' | 'admin' | 'abogado'
  avatar: string
}

/** SHA-256 hex of `lexara-v1|<email>|<password>` — auth demo en cliente; reemplazar por backend en producción. */
const USERS_DB: Record<
  string,
  { passwordHash: string; nombre: string; rol: AuthUser['rol']; avatar: string }
> = {
  'rauldiazespejo@gmail.com': {
    passwordHash: '68e80266f701373c44bd2e0be5edc1bc1d43a34c755a56fd3921cd55b36b3fa8',
    nombre: 'Raúl Díaz Espejo',
    rol: 'superadmin',
    avatar: 'RD',
  },
  'mgonzalez@lexara.cl': {
    passwordHash: '36732965d206318ec6825cc2babee262a1a77371e3dd9c99792bf18d11b1b31e',
    nombre: 'María González R.',
    rol: 'admin',
    avatar: 'MG',
  },
  'amunoz@lexara.cl': {
    passwordHash: '0adf9d6ff28731a6614268c3f774ecfd242eaaec840a49501c942277e841438f',
    nombre: 'Andrés Muñoz',
    rol: 'abogado',
    avatar: 'AM',
  },
}

function parseSuperadminEmails(): Set<string> {
  const raw = import.meta.env.VITE_SUPERADMIN_EMAILS as string | undefined
  if (!raw?.trim()) return new Set()
  return new Set(
    raw
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean),
  )
}

interface AuthContextType {
  user: AuthUser | null
  isSuperAdmin: boolean
  canDelete: boolean
  canCreate: boolean
  canEditFramework: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('lexara_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const superadminEmails = parseSuperadminEmails()
  const isSuperAdmin =
    user?.rol === 'superadmin' || (user ? superadminEmails.has(user.email.toLowerCase()) : false)
  const canDelete = isSuperAdmin || user?.rol === 'admin'
  const canCreate = !!user
  const canEditFramework = isSuperAdmin

  useEffect(() => {
    if (user) localStorage.setItem('lexara_user', JSON.stringify(user))
    else localStorage.removeItem('lexara_user')
  }, [user])

  const login = async (email: string, password: string) => {
    const emailNorm = email.toLowerCase().trim()
    const found = USERS_DB[emailNorm]
    if (!found) return { ok: false, error: 'Correo no registrado en el sistema' }
    const hash = await hashAuthPassword(emailNorm, password)
    if (hash !== found.passwordHash) return { ok: false, error: 'Contraseña incorrecta' }
    setUser({ email: emailNorm, nombre: found.nombre, rol: found.rol, avatar: found.avatar })
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
