import type {
  Cliente, Caso, Plazo, EventoAgenda, Honorario, DashboardMaestro
} from '../types'

// ── Valor UF simulado ────────────────────────────────────────────────────────
export const UF_VALOR_CLP = 38_012

// ── Clientes ─────────────────────────────────────────────────────────────────
export const CLIENTES: Cliente[] = [
  { id: 'cl1', rut: '12.345.678-9', nombre: 'Constructora Pacífico SpA', tipo: 'empresa', email: 'contacto@pacifico.cl', telefono: '+56 2 2345 6789', direccion: 'Av. Apoquindo 3000, Las Condes', fechaIngreso: '2023-03-15', abogadoAsignado: 'María González', estado: 'activo', especialidades: ['civil', 'comercial'], casosActivos: 3, deudaHonorarios: 12.5, conflictoInteres: false, notas: 'Cliente premium. Constructora con proyectos en RM y V Región.', documentos: 24 },
  { id: 'cl2', rut: '9.876.543-2', nombre: 'Juan Andrés Martínez Rojas', tipo: 'persona', email: 'jmartinez@gmail.com', telefono: '+56 9 8765 4321', direccion: 'Los Aromos 445, Providencia', fechaIngreso: '2024-01-08', abogadoAsignado: 'Carlos Vidal', estado: 'activo', especialidades: ['laboral'], casosActivos: 1, deudaHonorarios: 4.2, conflictoInteres: false, notas: 'Despido injustificado. Ex trabajador TechCorp.', documentos: 8 },
  { id: 'cl3', rut: '76.543.210-K', nombre: 'Importadora Los Andes Ltda.', tipo: 'empresa', email: 'legal@losandes.cl', telefono: '+56 2 2456 7890', direccion: 'Ruta 68 Km 12, Pudahuel', fechaIngreso: '2023-08-20', abogadoAsignado: 'María González', estado: 'activo', especialidades: ['comercial', 'tributario'], casosActivos: 2, deudaHonorarios: 28.0, conflictoInteres: false, notas: 'Importadora con litigios contractuales y revisión tributaria.', documentos: 41 },
  { id: 'cl4', rut: '14.567.890-3', nombre: 'Sofía Valenzuela Pérez', tipo: 'persona', email: 'svalenzuela@outlook.com', telefono: '+56 9 3456 7890', direccion: 'Villa Alemana, Valparaíso', fechaIngreso: '2024-02-14', abogadoAsignado: 'Andrés Muñoz', estado: 'activo', especialidades: ['familia'], casosActivos: 1, deudaHonorarios: 2.0, conflictoInteres: false, notas: 'Divorcio con regulación de bienes y tuición compartida.', documentos: 12 },
  { id: 'cl5', rut: '20.123.456-7', nombre: 'Ricardo Fuentes Navarrete', tipo: 'persona', email: 'rfuentes@mail.cl', telefono: '+56 9 1234 5678', direccion: 'Gran Avenida 2300, San Miguel', fechaIngreso: '2023-11-01', abogadoAsignado: 'Carlos Vidal', estado: 'activo', especialidades: ['penal'], casosActivos: 1, deudaHonorarios: 8.5, conflictoInteres: false, notas: 'Imputado por delito económico. Proceso en etapa de investigación.', documentos: 31 },
  { id: 'cl6', rut: '88.234.567-1', nombre: 'Restaurant Sabores del Sur SA', tipo: 'empresa', email: 'admin@saboresdelsur.cl', telefono: '+56 2 2789 0123', direccion: 'Barrio Italia 567, Santiago', fechaIngreso: '2024-03-01', abogadoAsignado: 'María González', estado: 'prospecto', especialidades: ['laboral', 'comercial'], casosActivos: 0, deudaHonorarios: 0, conflictoInteres: false, notas: 'Consulta inicial para regularización laboral y contratos de franquicia.', documentos: 2 },
]

// ── Plazos ────────────────────────────────────────────────────────────────────
export const PLAZOS: Plazo[] = [
  { id: 'p1', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', especialidad: 'civil', descripcion: 'Contestación demanda — Juicio Ordinario', tipo: 'fatal_civil', fechaInicio: '2024-02-15', fechaVencimiento: '2024-03-10', diasRestantes: 3, fatal: true, estado: 'pendiente', articulo: 'Art. 258 CPC', ley: 'Código de Procedimiento Civil', alerta: 'critical', accionRequerida: 'Presentar escrito de contestación antes del vencimiento', responsable: 'María González' },
  { id: 'p2', casoId: 'c2', casoTitulo: 'Martínez c/ TechCorp Chile', especialidad: 'laboral', descripcion: 'Audiencia Preparatoria — NLPT', tipo: 'fatal_laboral', fechaInicio: '2024-02-20', fechaVencimiento: '2024-03-15', diasRestantes: 8, fatal: true, estado: 'pendiente', articulo: 'Art. 453 Código del Trabajo', ley: 'Código del Trabajo', alerta: 'high', accionRequerida: 'Preparar prueba testimonial y documental para audiencia preparatoria', responsable: 'Carlos Vidal' },
  { id: 'p3', casoId: 'c3', casoTitulo: 'Importadora Los Andes — Querella SII', especialidad: 'tributario', descripcion: 'Reclamación tributaria — plazo fatal', tipo: 'fatal_civil', fechaInicio: '2024-01-25', fechaVencimiento: '2024-03-25', diasRestantes: 18, fatal: true, estado: 'pendiente', articulo: 'Art. 124 Código Tributario', ley: 'Código Tributario', alerta: 'medium', accionRequerida: 'Presentar reclamación formal ante TTA', responsable: 'María González' },
  { id: 'p4', casoId: 'c4', casoTitulo: 'Valenzuela — Divorcio', especialidad: 'familia', descripcion: 'Mediación previa obligatoria', tipo: 'fatal_familia', fechaInicio: '2024-02-01', fechaVencimiento: '2024-04-01', diasRestantes: 25, fatal: true, estado: 'pendiente', articulo: 'Art. 106 Ley 19.968', ley: 'Ley de Tribunales de Familia', alerta: 'medium', accionRequerida: 'Acreditar mediación frustrada o solicitar exención', responsable: 'Andrés Muñoz' },
  { id: 'p5', casoId: 'c5', casoTitulo: 'Fuentes — Investigación Penal', especialidad: 'penal', descripcion: 'Cierre de investigación — plazo judicial', tipo: 'fatal_penal', fechaInicio: '2023-11-15', fechaVencimiento: '2024-05-15', diasRestantes: 69, fatal: true, estado: 'pendiente', articulo: 'Art. 247 CPP', ley: 'Código Procesal Penal', alerta: 'low', accionRequerida: 'Solicitar ampliación del plazo de investigación si es necesario', responsable: 'Carlos Vidal' },
  { id: 'p6', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', especialidad: 'civil', descripcion: 'ALERTA: Riesgo abandono del procedimiento (Art. 152 CPC)', tipo: 'abandono', fechaInicio: '2023-09-01', fechaVencimiento: '2024-03-08', diasRestantes: 1, fatal: true, estado: 'pendiente', articulo: 'Art. 152 CPC', ley: 'Código de Procedimiento Civil', alerta: 'critical', accionRequerida: 'URGENTE: Realizar gestión útil para interrumpir abandono del procedimiento', responsable: 'María González' },
]

// ── Casos ─────────────────────────────────────────────────────────────────────
export const CASOS: Caso[] = [
  {
    id: 'c1', rol: 'C-4521-2023', titulo: 'Constructora Pacífico c/ Municipalidad de Santiago', tipo: 'Juicio Ordinario de Mayor Cuantía', especialidad: 'civil', tribunal: '20° Juzgado Civil de Santiago', clienteId: 'cl1', clienteNombre: 'Constructora Pacífico SpA', contraparte: 'Municipalidad de Santiago', abogado: 'María González', estado: 'active', etapa: 'Fase de Discusión', fechaIngreso: '2023-09-15', fechaUltimoMovimiento: '2024-02-28', probabilidadExito: 72, valorCausa: 450, honorarios: { modalidad: 'mixto', montoUF: 80, pagado: 52, pendiente: 28, porcentajeCuotaLitis: 5 }, plazos: [], teoriaDelCaso: { hechos: [{ id: 'h1', descripcion: 'Contrato de obra pública suscrito el 15/03/2022', estado: 'fuerte', evidencia: 'Contrato firmado + acta de inicio' }, { id: 'h2', descripcion: 'Municipalidad no efectuó pago de UF 450 en plazo pactado', estado: 'fuerte', evidencia: 'Comprobantes bancarios + correos' }], derecho: [{ id: 'd1', descripcion: 'Art. 1489 CC — condición resolutoria y acción resolutoria con indemnización', estado: 'fuerte' }, { id: 'd2', descripcion: 'Ley 19.886 de Compras Públicas — responsabilidad contractual del organismo', estado: 'debil', evidencia: 'Contraargumento: inmunidad soberana parcial' }], prueba: [{ id: 'pr1', descripcion: 'Contrato de concesión de obra pública', estado: 'fuerte', evidencia: 'Original notariado' }, { id: 'pr2', descripcion: 'Testigo experto en valoración de obras', estado: 'pendiente', evidencia: 'Perito en proceso de designación' }], estrategia: 'Acción resolutoria con indemnización de perjuicios. Énfasis en prueba documental del incumplimiento y peritaje de daños. Solicitar medida precautoria de retención de fondos municipales.', fortalezas: ['Contrato claro con obligaciones específicas', 'Documentación del incumplimiento completa', 'Jurisprudencia favorable en contratos públicos'], debilidades: ['Municipalidad puede alegar caso fortuito por pandemia', 'Perito aún no designado'], argumentosContrarios: ['Fuerza mayor por reducción presupuestaria Covid-19', 'Inexistencia de perjuicios cuantificables'], completitud: 78 }, historial: [{ id: 'mv1', fecha: '2023-09-15', tipo: 'escrito', descripcion: 'Presentación demanda', autor: 'María González' }, { id: 'mv2', fecha: '2023-11-02', tipo: 'notificacion', descripcion: 'Notificación personal demandada', autor: 'Receptor Judicial' }, { id: 'mv3', fecha: '2024-02-28', tipo: 'resolucion', descripcion: 'Tribunal ordena contestación en 15 días hábiles', autor: 'Juez Titular' }], documentos: [{ id: 'doc1', nombre: 'Demanda principal.pdf', tipo: 'escrito', fecha: '2023-09-15' }, { id: 'doc2', nombre: 'Contrato obra pública.pdf', tipo: 'prueba', fecha: '2023-09-15' }], audiencias: [], notas: 'Caso estratégico. Municipalidad con historial de incumplimientos.', alerta: 'critical'
  },
  {
    id: 'c2', rol: 'RIT O-234-2024', titulo: 'Martínez Rojas c/ TechCorp Chile SpA', tipo: 'Tutela Laboral + Despido Injustificado', especialidad: 'laboral', tribunal: '2° Juzgado de Letras del Trabajo de Santiago', clienteId: 'cl2', clienteNombre: 'Juan Andrés Martínez Rojas', contraparte: 'TechCorp Chile SpA', abogado: 'Carlos Vidal', estado: 'active', etapa: 'Audiencia Preparatoria', fechaIngreso: '2024-01-08', fechaUltimoMovimiento: '2024-02-25', probabilidadExito: 85, valorCausa: 120, honorarios: { modalidad: 'cuota_litis', montoUF: 0, pagado: 4.2, pendiente: 0, porcentajeCuotaLitis: 20 }, plazos: [], teoriaDelCaso: { hechos: [{ id: 'h1', descripcion: 'Despido verbal el 15/12/2023 sin carta de aviso previo', estado: 'fuerte', evidencia: 'Testigos + WhatsApp jefe directo' }], derecho: [{ id: 'd1', descripcion: 'Art. 162 CT — obligación carta aviso 30 días o pago en sustitución', estado: 'fuerte' }, { id: 'd2', descripcion: 'Art. 489 CT — tutela de derechos fundamentales (no discriminación)', estado: 'fuerte' }], prueba: [{ id: 'pr1', descripcion: 'Conversaciones WhatsApp con gerente de RRHH', estado: 'fuerte' }, { id: 'pr2', descripcion: 'Liquidaciones de sueldo últimos 12 meses', estado: 'fuerte' }], estrategia: 'Acción de tutela laboral por vulneración de garantías + indemnizaciones completas. Presentar en audiencia preparatoria lista de testigos e impugnar lista de la demandada.', fortalezas: ['Prueba documental sólida (WhatsApp)', 'Sin carta de aviso previo acreditable', 'Jurisprudencia uniforme favorable'], debilidades: ['Empleado con menos de 1 año — menor indemnización base'], argumentosContrarios: ['Empresa puede alegar necesidades de empresa'], completitud: 90 }, historial: [], documentos: [], audiencias: [{ id: 'a1', tipo: 'Audiencia Preparatoria', fecha: '2024-03-15', hora: '10:00', sala: 'Sala 3', estado: 'programada' }], notas: '', alerta: 'high'
  },
  {
    id: 'c3', rol: 'RIT F-891-2024', titulo: 'Valenzuela Pérez — Divorcio y Alimentos', tipo: 'Divorcio Unilateral + Alimentos Menores', especialidad: 'familia', tribunal: '4° Juzgado de Familia de Valparaíso', clienteId: 'cl4', clienteNombre: 'Sofía Valenzuela Pérez', contraparte: 'Marco Herrera Soto', abogado: 'Andrés Muñoz', estado: 'active', etapa: 'Mediación Obligatoria', fechaIngreso: '2024-02-14', fechaUltimoMovimiento: '2024-02-28', probabilidadExito: 80, valorCausa: 45, honorarios: { modalidad: 'fijo', montoUF: 15, pagado: 8, pendiente: 7 }, plazos: [], teoriaDelCaso: { hechos: [{ id: 'h1', descripcion: 'Cese de convivencia acreditado desde enero 2021 (más de 3 años)', estado: 'fuerte' }], derecho: [{ id: 'd1', descripcion: 'Art. 55 Ley 19.947 — divorcio unilateral por cese convivencia 3 años', estado: 'fuerte' }], prueba: [{ id: 'pr1', descripcion: 'Declaración jurada ante notario del cese de convivencia', estado: 'pendiente' }], estrategia: 'Mediación familiar para acuerdo sobre alimentos y tuición compartida. Si fracasa, acción de divorcio unilateral con regulación completa.', fortalezas: ['Plazo de 3 años cumplido con creces', 'Acuerdo parcial sobre tuición'], debilidades: ['Disputa por bien raíz en común'], argumentosContrarios: ['Cónyuge puede solicitar compensación económica'], completitud: 55 }, historial: [], documentos: [], audiencias: [], notas: '2 hijos menores. Solicitar alimentos provisorios urgentes.', alerta: 'medium'
  },
]

// ── Honorarios ────────────────────────────────────────────────────────────────
export const HONORARIOS: Honorario[] = [
  { id: 'h1', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', clienteNombre: 'Constructora Pacífico SpA', concepto: 'Honorarios etapa demanda + gestiones prejudiciales', montoUF: 30, montoCLP: 30 * UF_VALOR_CLP, estado: 'pagado', fechaEmision: '2023-09-20', fechaVencimiento: '2023-10-05', fechaPago: '2023-10-03', tipo: 'fijo' },
  { id: 'h2', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', clienteNombre: 'Constructora Pacífico SpA', concepto: 'Segunda cuota — fase de discusión', montoUF: 22, montoCLP: 22 * UF_VALOR_CLP, estado: 'pagado', fechaEmision: '2024-01-10', fechaVencimiento: '2024-01-25', fechaPago: '2024-01-22', tipo: 'fijo' },
  { id: 'h3', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', clienteNombre: 'Constructora Pacífico SpA', concepto: 'Tercera cuota — pendiente', montoUF: 28, montoCLP: 28 * UF_VALOR_CLP, estado: 'vencido', fechaEmision: '2024-02-01', fechaVencimiento: '2024-02-20', tipo: 'fijo' },
  { id: 'h4', casoId: 'c2', casoTitulo: 'Martínez c/ TechCorp Chile', clienteNombre: 'Juan Andrés Martínez Rojas', concepto: 'Anticipo gastos procesales', montoUF: 4.2, montoCLP: 4.2 * UF_VALOR_CLP, estado: 'pagado', fechaEmision: '2024-01-10', fechaVencimiento: '2024-01-15', fechaPago: '2024-01-14', tipo: 'fijo' },
  { id: 'h5', casoId: 'c3', casoTitulo: 'Valenzuela — Divorcio', clienteNombre: 'Sofía Valenzuela Pérez', concepto: 'Primera cuota honorarios divorcio', montoUF: 8, montoCLP: 8 * UF_VALOR_CLP, estado: 'pagado', fechaEmision: '2024-02-15', fechaVencimiento: '2024-02-28', fechaPago: '2024-02-27', tipo: 'fijo' },
  { id: 'h6', casoId: 'c3', casoTitulo: 'Valenzuela — Divorcio', clienteNombre: 'Sofía Valenzuela Pérez', concepto: 'Segunda cuota honorarios divorcio', montoUF: 7, montoCLP: 7 * UF_VALOR_CLP, estado: 'pendiente', fechaEmision: '2024-03-01', fechaVencimiento: '2024-03-31', tipo: 'fijo' },
]

// ── Agenda ────────────────────────────────────────────────────────────────────
export const EVENTOS_AGENDA: EventoAgenda[] = [
  { id: 'e1', titulo: '⚠️ ABANDONO: Gestión urgente Caso Pacífico', tipo: 'plazo', fecha: '2024-03-07', hora: '09:00', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', tribunal: '20° Juzgado Civil', descripcion: 'Realizar gestión útil para evitar declaración de abandono (Art. 152 CPC)', prioridad: 'critical', completado: false },
  { id: 'e2', titulo: 'Audiencia Preparatoria — Martínez c/ TechCorp', tipo: 'audiencia', fecha: '2024-03-15', hora: '10:00', casoId: 'c2', casoTitulo: 'Martínez c/ TechCorp Chile', tribunal: '2° Juzgado Letras del Trabajo', descripcion: 'Audiencia preparatoria NLPT. Llevar: liquidaciones, WhatsApps impresos, lista testigos.', prioridad: 'high', completado: false },
  { id: 'e3', titulo: 'Contestación demanda — Caso Pacífico', tipo: 'plazo', fecha: '2024-03-10', hora: '18:00', casoId: 'c1', casoTitulo: 'Constructora Pacífico c/ Municipalidad', descripcion: 'Vencimiento plazo contestación (Art. 258 CPC). FATAL.', prioridad: 'critical', completado: false },
  { id: 'e4', titulo: 'Reunión cliente — Importadora Los Andes', tipo: 'reunion', fecha: '2024-03-08', hora: '11:30', casoId: 'c3', descripcion: 'Revisión estrategia reclamación tributaria y documentos SII', prioridad: 'medium', completado: false },
  { id: 'e5', titulo: 'Sesión mediación familiar — Valenzuela', tipo: 'diligencia', fecha: '2024-03-12', hora: '15:00', casoId: 'c3', casoTitulo: 'Valenzuela — Divorcio', tribunal: 'Centro de Mediación Valparaíso', descripcion: 'Segunda sesión de mediación. Acuerdo parcial sobre alimentos provisorios.', prioridad: 'medium', completado: false },
]

// ── Dashboard ────────────────────────────────────────────────────────────────
export const DASHBOARD_DATA: DashboardMaestro = {
  kpis: {
    casosActivos: 12,
    casosNuevosMes: 3,
    clientesActivos: 18,
    plazosProximos: 5,
    plazosVencidos: 1,
    honorariosPendientesUF: 46.7,
    audienciasHoy: 1,
    probabilidadPromedioExito: 76,
  },
  plazosUrgentes: PLAZOS.filter(p => p.alerta === 'critical' || p.alerta === 'high'),
  audienciasHoy: EVENTOS_AGENDA.filter(e => e.tipo === 'audiencia').slice(0, 2),
  casosRecientes: CASOS,
  distribucionEspecialidades: [
    { name: 'Civil', value: 4, color: '#3b82f6' },
    { name: 'Laboral', value: 3, color: '#22c55e' },
    { name: 'Comercial', value: 3, color: '#8b5cf6' },
    { name: 'Familia', value: 2, color: '#ec4899' },
    { name: 'Penal', value: 2, color: '#ef4444' },
    { name: 'Tributario', value: 1, color: '#f97316' },
  ],
  tendenciaIngresos: [
    { mes: 'Oct', uf: 42, clp: 42 * UF_VALOR_CLP },
    { mes: 'Nov', uf: 68, clp: 68 * UF_VALOR_CLP },
    { mes: 'Dic', uf: 35, clp: 35 * UF_VALOR_CLP },
    { mes: 'Ene', uf: 91, clp: 91 * UF_VALOR_CLP },
    { mes: 'Feb', uf: 74, clp: 74 * UF_VALOR_CLP },
    { mes: 'Mar', uf: 58, clp: 58 * UF_VALOR_CLP },
  ],
  estadoCasos: [
    { name: 'Activos', value: 12, color: '#3b82f6' },
    { name: 'En mediación', value: 2, color: '#eab308' },
    { name: 'Sentencia', value: 3, color: '#8b5cf6' },
    { name: 'Cerrados', value: 8, color: '#22c55e' },
  ],
}

// ── Plazos legales chilenos (calculadora) ─────────────────────────────────────
export const PLAZOS_LEGALES = {
  civil: [
    { acto: 'Contestación demanda (ordinario)', articulo: 'Art. 258 CPC', dias: 15, tipo: 'hábiles', fatal: true },
    { acto: 'Contestación demanda (sumario)', articulo: 'Art. 681 CPC', dias: 5, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de apelación sentencia definitiva', articulo: 'Art. 189 CPC', dias: 10, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de casación en la forma', articulo: 'Art. 770 CPC', dias: 15, tipo: 'hábiles', fatal: true },
    { acto: 'Abandono del procedimiento', articulo: 'Art. 152 CPC', dias: 180, tipo: 'corridos', fatal: false },
    { acto: 'Prescripción acción ordinaria', articulo: 'Art. 2515 CC', dias: 1825, tipo: 'corridos', fatal: false },
  ],
  laboral: [
    { acto: 'Demanda por despido injustificado', articulo: 'Art. 168 CT', dias: 60, tipo: 'hábiles', fatal: true },
    { acto: 'Denuncia tutela laboral', articulo: 'Art. 489 CT', dias: 60, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de nulidad laboral', articulo: 'Art. 478 CT', dias: 10, tipo: 'hábiles', fatal: true },
    { acto: 'Apelación (procedimiento monitorio)', articulo: 'Art. 500 CT', dias: 10, tipo: 'hábiles', fatal: true },
  ],
  penal: [
    { acto: 'Formalización de cargos', articulo: 'Art. 230 CPP', dias: 0, tipo: 'a petición', fatal: false },
    { acto: 'Plazo de investigación', articulo: 'Art. 247 CPP', dias: 730, tipo: 'corridos', fatal: true },
    { acto: 'Recurso de apelación auto de apertura', articulo: 'Art. 277 CPP', dias: 10, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de nulidad penal', articulo: 'Art. 372 CPP', dias: 10, tipo: 'hábiles', fatal: true },
  ],
  familia: [
    { acto: 'Mediación previa obligatoria', articulo: 'Art. 106 Ley 19.968', dias: 0, tipo: 'previa', fatal: true },
    { acto: 'Recurso de apelación', articulo: 'Art. 67 Ley 19.968', dias: 5, tipo: 'hábiles', fatal: true },
    { acto: 'Alimentos provisorios', articulo: 'Art. 55 Ley 14.908', dias: 15, tipo: 'hábiles', fatal: false },
  ],
  tributario: [
    { acto: 'Reclamación tributaria ante TTA', articulo: 'Art. 124 CT', dias: 90, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de apelación TTA', articulo: 'Art. 140 CT', dias: 15, tipo: 'hábiles', fatal: true },
    { acto: 'Prescripción ordinaria SII', articulo: 'Art. 200 CT', dias: 1095, tipo: 'corridos', fatal: false },
  ],
}
