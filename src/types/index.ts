// ────────────────────────────────────────────────────────────────────────────
// LEXARA PLATFORM — Master Types
// ────────────────────────────────────────────────────────────────────────────

// ── Shared ──────────────────────────────────────────────────────────────────
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'ok'
export type Status = 'active' | 'pending' | 'closed' | 'suspended' | 'archived'
export type Specialty =
  | 'civil' | 'comercial' | 'laboral' | 'penal'
  | 'familia' | 'tributario' | 'administrativo' | 'procesal'

// ── Clientes ─────────────────────────────────────────────────────────────────
export interface Cliente {
  id: string
  rut: string
  nombre: string
  tipo: 'persona' | 'empresa'
  email: string
  telefono: string
  direccion: string
  fechaIngreso: string
  abogadoAsignado: string
  estado: 'activo' | 'inactivo' | 'prospecto'
  especialidades: Specialty[]
  casosActivos: number
  deudaHonorarios: number // en UF
  conflictoInteres: boolean
  notas: string
  documentos: number
}

// ── Casos ────────────────────────────────────────────────────────────────────
export interface Caso {
  id: string
  rol: string           // Ej: C-1234-2024 / RIT O-100-2024
  titulo: string
  tipo: string
  especialidad: Specialty
  tribunal: string
  clienteId: string
  clienteNombre: string
  contraparte: string
  abogado: string
  estado: Status
  etapa: string
  fechaIngreso: string
  fechaUltimoMovimiento: string
  probabilidadExito: number // 0-100
  valorCausa: number // en UF
  honorarios: HonorariosCaso
  plazos: Plazo[]
  teoriaDelCaso: TeoriaDelCaso
  historial: MovimientoCaso[]
  documentos: DocumentoCaso[]
  audiencias: Audiencia[]
  notas: string
  alerta: RiskLevel
}

export interface HonorariosCaso {
  modalidad: 'fijo' | 'porcentaje' | 'cuota_litis' | 'mixto'
  montoUF: number
  pagado: number
  pendiente: number
  porcentajeCuotaLitis?: number
}

export interface MovimientoCaso {
  id: string
  fecha: string
  tipo: 'resolucion' | 'escrito' | 'audiencia' | 'notificacion' | 'gestión'
  descripcion: string
  autor: string
  adjunto?: string
}

export interface DocumentoCaso {
  id: string
  nombre: string
  tipo: string
  fecha: string
  url?: string
}

export interface Audiencia {
  id: string
  tipo: string
  fecha: string
  hora: string
  sala: string
  estado: 'programada' | 'realizada' | 'suspendida'
  resultado?: string
}

// ── Teoría del Caso ──────────────────────────────────────────────────────────
export interface TeoriaDelCaso {
  hechos: PillarTeoria[]
  derecho: PillarTeoria[]
  prueba: PillarTeoria[]
  estrategia: string
  fortalezas: string[]
  debilidades: string[]
  argumentosContrarios: string[]
  completitud: number // 0-100
}

export interface PillarTeoria {
  id: string
  descripcion: string
  estado: 'fuerte' | 'debil' | 'pendiente'
  evidencia?: string
}

// ── Plazos ───────────────────────────────────────────────────────────────────
export type TipoPlazo =
  | 'fatal_civil' | 'fatal_penal' | 'fatal_laboral' | 'fatal_familia'
  | 'no_fatal' | 'prescripcion' | 'caducidad' | 'abandono'

export interface Plazo {
  id: string
  casoId: string
  casoTitulo: string
  especialidad: Specialty
  descripcion: string
  tipo: TipoPlazo
  fechaInicio: string
  fechaVencimiento: string
  diasRestantes: number
  fatal: boolean
  estado: 'pendiente' | 'completado' | 'vencido' | 'suspendido'
  articulo?: string    // Ej: "Art. 64 CPC"
  ley?: string
  alerta: RiskLevel
  accionRequerida: string
  responsable: string
}

// ── Honorarios ───────────────────────────────────────────────────────────────
export interface Honorario {
  id: string
  casoId: string
  casoTitulo: string
  clienteNombre: string
  concepto: string
  montoUF: number
  montoCLP: number
  estado: 'pagado' | 'pendiente' | 'vencido' | 'anulado'
  fechaEmision: string
  fechaVencimiento: string
  fechaPago?: string
  tipo: 'fijo' | 'cuota_litis' | 'hora' | 'gasto'
}

// ── Agenda ───────────────────────────────────────────────────────────────────
export interface EventoAgenda {
  id: string
  titulo: string
  tipo: 'audiencia' | 'plazo' | 'reunion' | 'diligencia' | 'vencimiento' | 'otro'
  fecha: string
  hora?: string
  casoId?: string
  casoTitulo?: string
  tribunal?: string
  descripcion: string
  prioridad: RiskLevel
  completado: boolean
}

// ── Especialidades ───────────────────────────────────────────────────────────
// Civil
export interface CasoCivil extends Caso {
  tipoProcedimiento: 'ordinario' | 'sumario' | 'ejecutivo' | 'cautelar'
  materiaEspecifica: string
  cbr?: string       // Conservador de Bienes Raíces
  notaria?: string
}

// Laboral
export interface CasoLaboral extends Caso {
  rit: string
  tipoAccion: 'tutela' | 'despido' | 'cobro_prestaciones' | 'negociacion' | 'multa'
  rutEmpleador: string
  montoReclamado: number // en UF
  inspeccionTrabajo?: string
}

// Penal
export interface CasoPenal extends Caso {
  ruc: string
  imputado: string
  delito: string
  fiscal: string
  defensor: string
  etapaProceso: 'formalizacion' | 'investigacion' | 'preparatoria' | 'oral' | 'recursos'
  medidaCautelar: string
  garantias: boolean
}

// Familia
export interface CasoFamilia extends Caso {
  rit: string
  materiaFamilia: 'alimentos' | 'tuicion' | 'divorcio' | 'adopcion' | 'vif' | 'filiacion'
  menoresInvolucrados: boolean
  mediacionPrevia: boolean
}

// Tributario
export interface CasoTributario extends Caso {
  rut: string
  tipoImpuesto: 'IVA' | 'renta' | 'herencia' | 'bienes_raices' | 'otro'
  monto: number
  sii: boolean
  taa: boolean  // Tribunal de Aduanas y Aduana
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardMaestro {
  kpis: {
    casosActivos: number
    casosNuevosMes: number
    clientesActivos: number
    plazosProximos: number  // próximos 7 días
    plazosVencidos: number
    honorariosPendientesUF: number
    audienciasHoy: number
    probabilidadPromedioExito: number
  }
  plazosUrgentes: Plazo[]
  audienciasHoy: EventoAgenda[]
  casosRecientes: Caso[]
  distribucionEspecialidades: { name: string; value: number; color: string }[]
  tendenciaIngresos: { mes: string; uf: number; clp: number }[]
  estadoCasos: { name: string; value: number; color: string }[]
}

// ── Legacy Contract Analysis (LEXARA Comercial module) ───────────────────────
export interface Clause {
  id: string
  text: string
  type: string
  riskLevel: RiskLevel
  issues: string[]
  recommendations: string[]
  legalReferences: string[]
  isAbusive: boolean
  isIllegal: boolean
}

export interface ContractAnalysis {
  id: string
  fileName: string
  contractType: string
  analysisDate: string
  overallRisk: RiskLevel
  clauses: Clause[]
  summary: string
  recommendations: string[]
}

export interface LegalReference {
  id: string
  title: string
  description: string
  source: string
  relevance: string
}

export interface ContractType {
  id: string
  name: string
  description: string
}

export interface DashboardStats {
  totalContracts: number
  highRiskClauses: number
  resolvedIssues: number
  pendingReview: number
}
