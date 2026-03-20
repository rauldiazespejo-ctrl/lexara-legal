import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Cliente, Caso, Honorario, EventoAgenda, Plazo } from '../types'
import type { Abogado } from '../pages/Abogados'

export interface CustomNorma {
  id: string
  article: string
  law: string
  description: string
  relevance: string
  custom: boolean
}

export interface TimeEntry {
  id: string
  caseName: string
  description: string
  category: string
  durationSeconds: number
  startTime: string
  date: string
  billable: boolean
}

interface AppDataContextType {
  clientes: Cliente[]
  addCliente: (c: Cliente) => void
  updateCliente: (c: Cliente) => void
  deleteCliente: (id: string) => void

  casos: Caso[]
  addCaso: (c: Caso) => void
  updateCaso: (c: Caso) => void
  deleteCaso: (id: string) => void

  honorarios: Honorario[]
  addHonorario: (h: Honorario) => void
  updateHonorario: (h: Honorario) => void
  deleteHonorario: (id: string) => void

  eventos: EventoAgenda[]
  addEvento: (e: EventoAgenda) => void
  updateEvento: (e: EventoAgenda) => void
  deleteEvento: (id: string) => void

  plazos: Plazo[]
  addPlazo: (p: Plazo) => void
  updatePlazo: (p: Plazo) => void
  deletePlazo: (id: string) => void

  abogados: Abogado[]
  addAbogado: (a: Abogado) => void
  updateAbogado: (a: Abogado) => void
  deleteAbogado: (id: string) => void

  customNormas: CustomNorma[]
  addNorma: (n: CustomNorma) => void
  deleteNorma: (id: string) => void

  timeEntries: TimeEntry[]
  addTimeEntry: (e: TimeEntry) => void
  deleteTimeEntry: (id: string) => void
}

function usePersisted<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`lexara_data_${key}`)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(`lexara_data_${key}`, JSON.stringify(state))
  }, [key, state])
  return [state, setState] as const
}

const Ctx = createContext<AppDataContextType | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = usePersisted<Cliente[]>('clientes', [])
  const [casos, setCasos] = usePersisted<Caso[]>('casos', [])
  const [honorarios, setHonorarios] = usePersisted<Honorario[]>('honorarios', [])
  const [eventos, setEventos] = usePersisted<EventoAgenda[]>('eventos', [])
  const [plazos, setPlazos] = usePersisted<Plazo[]>('plazos', [])
  const [abogados, setAbogados] = usePersisted<Abogado[]>('abogados', [])
  const [customNormas, setCustomNormas] = usePersisted<CustomNorma[]>('customNormas', [])
  const [timeEntries, setTimeEntries] = usePersisted<TimeEntry[]>('timeEntries', [])

  const crud = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) => ({
    add: (item: T) => setter(p => [item, ...p]),
    update: (item: T) => setter(p => p.map(x => x.id === item.id ? item : x)),
    remove: (id: string) => setter(p => p.filter(x => x.id !== id)),
  })

  const C = crud(setClientes)
  const Ca = crud(setCasos)
  const H = crud(setHonorarios)
  const E = crud(setEventos)
  const Pl = crud(setPlazos)
  const Ab = crud(setAbogados)

  return (
    <Ctx.Provider value={{
      clientes,
      addCliente: C.add, updateCliente: C.update, deleteCliente: C.remove,
      casos,
      addCaso: Ca.add, updateCaso: Ca.update, deleteCaso: Ca.remove,
      honorarios,
      addHonorario: H.add, updateHonorario: H.update, deleteHonorario: H.remove,
      eventos,
      addEvento: E.add, updateEvento: E.update, deleteEvento: E.remove,
      plazos,
      addPlazo: Pl.add, updatePlazo: Pl.update, deletePlazo: Pl.remove,
      abogados,
      addAbogado: Ab.add, updateAbogado: Ab.update, deleteAbogado: Ab.remove,
      customNormas,
      addNorma: (n) => setCustomNormas(p => [n, ...p]),
      deleteNorma: (id) => setCustomNormas(p => p.filter(x => x.id !== id)),
      timeEntries,
      addTimeEntry: (e) => setTimeEntries(p => [e, ...p]),
      deleteTimeEntry: (id) => setTimeEntries(p => p.filter(x => x.id !== id)),
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
