import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { UF_VALOR_CLP } from '../data/appData'

type UfContextType = {
  ufClp: number
  fecha: string | null
  fuente: string
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UfContext = createContext<UfContextType | null>(null)

const CACHE_KEY = 'lexara_uf_cache'
const CACHE_MS = 4 * 60 * 60 * 1000

type MindicadorUf = { serie?: { fecha: string; valor: number }[] }

function latestFromSerie(serie: { fecha: string; valor: number }[]): { valor: number; fecha: string } | null {
  if (!serie.length) return null
  const sorted = [...serie].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  const row = sorted[0]
  if (!row || typeof row.valor !== 'number' || !Number.isFinite(row.valor)) return null
  return { valor: Math.round(row.valor), fecha: row.fecha }
}

export function UfProvider({ children }: { children: ReactNode }) {
  const [ufClp, setUfClp] = useState(UF_VALOR_CLP)
  const [fecha, setFecha] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLatest = useCallback(async (opts?: { skipCache?: boolean }) => {
    if (opts?.skipCache) {
      try {
        sessionStorage.removeItem(CACHE_KEY)
      } catch {
        /* ignore */
      }
    }
    try {
      const res = await fetch('https://mindicador.cl/api/uf')
      if (!res.ok) throw new Error('HTTP')
      const data = (await res.json()) as MindicadorUf
      const latest = latestFromSerie(data.serie ?? [])
      if (!latest) throw new Error('empty')
      setUfClp(latest.valor)
      setFecha(latest.fecha)
      setError(null)
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ v: latest.valor, t: Date.now(), f: latest.fecha }))
      } catch {
        /* ignore */
      }
    } catch {
      setError('UF referencial')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { v: number; t: number; f: string }
        if (typeof parsed.v === 'number' && parsed.t && Date.now() - parsed.t < CACHE_MS) {
          setUfClp(parsed.v)
          setFecha(parsed.f || null)
          setLoading(false)
        }
      }
    } catch {
      /* ignore */
    }

    void (async () => {
      await fetchLatest()
      if (!cancelled) setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [fetchLatest])

  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchLatest({ skipCache: true })
    setLoading(false)
  }, [fetchLatest])

  return (
    <UfContext.Provider
      value={{
        ufClp,
        fecha,
        fuente: 'mindicador.cl',
        loading,
        error,
        refetch,
      }}>
      {children}
    </UfContext.Provider>
  )
}

export function useUf() {
  const ctx = useContext(UfContext)
  if (!ctx) throw new Error('useUf must be used inside UfProvider')
  return ctx
}
