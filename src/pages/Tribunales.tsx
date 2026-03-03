import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Phone, Clock, Mail, Building2, ChevronDown, ChevronUp, Copy, ExternalLink, Scale } from 'lucide-react'

type TipoTribunal = 'civil' | 'laboral' | 'penal' | 'familia' | 'tributario' | 'cobranza' | 'garantia' | 'cao' | 'ca' | 'cs'

interface Tribunal {
  id: string
  nombre: string
  tipo: TipoTribunal
  region: string
  ciudad: string
  direccion: string
  telefono: string
  horario: string
  competencia: string[]
  email?: string
}

const TIPO_CONFIG: Record<TipoTribunal, { label: string; color: string; bg: string }> = {
  cs:         { label: 'Corte Suprema',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  ca:         { label: 'Corte de Apelaciones', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  civil:      { label: 'Civil',           color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  laboral:    { label: 'Laboral',         color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  penal:      { label: 'Penal',           color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  garantia:   { label: 'Garantía',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  familia:    { label: 'Familia',         color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  tributario: { label: 'Tributario',      color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  cobranza:   { label: 'Cobranza',        color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  cao:        { label: 'Arbitraje / CAM', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
}

const TRIBUNALES: Tribunal[] = [
  {
    id: 't01',
    nombre: 'Corte Suprema de Chile',
    tipo: 'cs',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Compañía de Jesús 1140, Santiago Centro',
    telefono: '+56 2 2873 5000',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Casación en el fondo y en la forma', 'Revisión de sentencias definitivas', 'Inaplicabilidad por inconstitucionalidad', 'Jurisdicción disciplinaria sobre tribunales', 'Recursos de protección de relevancia nacional'],
    email: 'info@pjud.cl',
  },
  {
    id: 't02',
    nombre: 'Corte de Apelaciones de Santiago',
    tipo: 'ca',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Compañía de Jesús 1140, Santiago Centro',
    telefono: '+56 2 2873 5100',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación civil y penal', 'Recursos de protección y amparo', 'Segunda instancia laboral y familia', 'Contiendas de competencia', 'Recursos de hecho'],
    email: 'casantiago@pjud.cl',
  },
  {
    id: 't03',
    nombre: 'Corte de Apelaciones de San Miguel',
    tipo: 'ca',
    region: 'Metropolitana',
    ciudad: 'San Miguel',
    direccion: 'Av. General Velásquez 2520, San Miguel',
    telefono: '+56 2 2590 6800',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación civil y penal', 'Recursos de protección zona sur RM', 'Segunda instancia laboral y familia', 'Contiendas de competencia'],
    email: 'casanmiguel@pjud.cl',
  },
  {
    id: 't04',
    nombre: 'Corte de Apelaciones de Valparaíso',
    tipo: 'ca',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Condell 1490, Valparaíso',
    telefono: '+56 32 2237 800',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación región de Valparaíso', 'Recursos de protección y amparo', 'Segunda instancia civil y penal', 'Recursos de queja disciplinaria'],
    email: 'cavalparaiso@pjud.cl',
  },
  {
    id: 't05',
    nombre: 'Corte de Apelaciones de Concepción',
    tipo: 'ca',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Aníbal Pinto 492, Concepción',
    telefono: '+56 41 2246 100',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación región del Biobío', 'Recursos de protección y amparo', 'Segunda instancia laboral y familia', 'Recursos de nulidad penal'],
    email: 'caconcepcion@pjud.cl',
  },
  {
    id: 't06',
    nombre: 'Corte de Apelaciones de Temuco',
    tipo: 'ca',
    region: 'La Araucanía',
    ciudad: 'Temuco',
    direccion: 'Manuel Montt 980, Temuco',
    telefono: '+56 45 2966 900',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación La Araucanía', 'Recursos de protección y amparo', 'Segunda instancia civil, laboral y familia', 'Recursos de nulidad penal'],
    email: 'catemuco@pjud.cl',
  },
  {
    id: 't07',
    nombre: 'Corte de Apelaciones de Valdivia',
    tipo: 'ca',
    region: 'Los Ríos',
    ciudad: 'Valdivia',
    direccion: 'Chacabuco 609, Valdivia',
    telefono: '+56 63 2210 400',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación Los Ríos', 'Recursos de protección y amparo', 'Segunda instancia civil y familia', 'Recursos de nulidad penal'],
    email: 'cavaldivia@pjud.cl',
  },
  {
    id: 't08',
    nombre: 'Corte de Apelaciones de Puerto Montt',
    tipo: 'ca',
    region: 'Los Lagos',
    ciudad: 'Puerto Montt',
    direccion: 'San Martín 232, Puerto Montt',
    telefono: '+56 65 2482 800',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación Los Lagos', 'Recursos de protección y amparo', 'Segunda instancia civil, laboral y familia', 'Recursos de queja'],
    email: 'capuertomontt@pjud.cl',
  },
  {
    id: 't09',
    nombre: 'Corte de Apelaciones de Antofagasta',
    tipo: 'ca',
    region: 'Antofagasta',
    ciudad: 'Antofagasta',
    direccion: 'Sucre 260, Antofagasta',
    telefono: '+56 55 2268 900',
    horario: '08:30–17:00 Lun-Vie',
    competencia: ['Recursos de apelación región de Antofagasta', 'Recursos de protección y amparo', 'Segunda instancia civil, laboral y penal', 'Recursos de nulidad penal'],
    email: 'caantofagasta@pjud.cl',
  },
  {
    id: 't10',
    nombre: '1° Juzgado Civil de Santiago',
    tipo: 'civil',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Huérfanos 1409, Santiago Centro',
    telefono: '+56 2 2873 5200',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Juicios ordinarios de mayor cuantía', 'Procedimientos ejecutivos', 'Juicios posesorios y reivindicatorios', 'Gestiones preparatorias de la vía ejecutiva'],
    email: '1jcivil.santiago@pjud.cl',
  },
  {
    id: 't11',
    nombre: '8° Juzgado Civil de Santiago',
    tipo: 'civil',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Huérfanos 1409, Santiago Centro',
    telefono: '+56 2 2873 5280',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Juicios ordinarios de mayor y menor cuantía', 'Acciones reales y personales', 'Procedimientos ejecutivos de obligaciones de dar', 'Medidas cautelares civiles'],
    email: '8jcivil.santiago@pjud.cl',
  },
  {
    id: 't12',
    nombre: 'Juzgado Civil de Valparaíso',
    tipo: 'civil',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Condell 1490, Valparaíso',
    telefono: '+56 32 2268 000',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Juicios civiles de mayor cuantía', 'Causas de arrendamiento urbano', 'Procedimientos ejecutivos', 'Medidas precautorias'],
    email: 'jcivil.valparaiso@pjud.cl',
  },
  {
    id: 't13',
    nombre: 'Juzgado Civil de Concepción',
    tipo: 'civil',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Aníbal Pinto 492, Concepción',
    telefono: '+56 41 2286 600',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Juicios civiles ordinarios', 'Procedimientos ejecutivos y precautorios', 'Causas de quiebra y reorganización', 'Acciones reivindicatorias y posesorias'],
    email: 'jcivil.concepcion@pjud.cl',
  },
  {
    id: 't14',
    nombre: 'Juzgado Civil de Antofagasta',
    tipo: 'civil',
    region: 'Antofagasta',
    ciudad: 'Antofagasta',
    direccion: 'Sucre 260, Antofagasta',
    telefono: '+56 55 2449 200',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Juicios civiles y mercantiles', 'Procedimientos ejecutivos', 'Cauciones y medidas precautorias', 'Causas concursales'],
    email: 'jcivil.antofagasta@pjud.cl',
  },
  {
    id: 't15',
    nombre: 'Juzgado de Letras de Temuco',
    tipo: 'civil',
    region: 'La Araucanía',
    ciudad: 'Temuco',
    direccion: 'Manuel Montt 980, Temuco',
    telefono: '+56 45 2296 400',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Causas civiles de mayor cuantía', 'Juicios de arrendamiento', 'Procedimientos ejecutivos', 'Acciones posesorias'],
    email: 'jletras.temuco@pjud.cl',
  },
  {
    id: 't16',
    nombre: 'Juzgado Civil de La Serena',
    tipo: 'civil',
    region: 'Coquimbo',
    ciudad: 'La Serena',
    direccion: 'Balmaceda 986, La Serena',
    telefono: '+56 51 2614 200',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Juicios civiles ordinarios y sumarios', 'Procedimientos ejecutivos', 'Acciones reivindicatorias', 'Medidas precautorias y cautelares'],
    email: 'jcivil.laserena@pjud.cl',
  },
  {
    id: 't17',
    nombre: 'Juzgado Civil de Rancagua',
    tipo: 'civil',
    region: "O'Higgins",
    ciudad: 'Rancagua',
    direccion: 'Astorga 630, Rancagua',
    telefono: '+56 72 2237 800',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ["Causas civiles región O'Higgins", 'Juicios ejecutivos y posesorios', 'Acciones de cobro y arrendamiento', 'Procedimientos ordinarios de mayor cuantía'],
    email: 'jcivil.rancagua@pjud.cl',
  },
  {
    id: 't18',
    nombre: '1° Juzgado de Letras del Trabajo de Santiago',
    tipo: 'laboral',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Teatinos 40, piso 8, Santiago Centro',
    telefono: '+56 2 2460 7200',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Tutela laboral y despidos injustificados', 'Cobro de prestaciones e indemnizaciones', 'Acción de nulidad del despido', 'Procedimiento monitorio laboral', 'Aplicación del Código del Trabajo'],
    email: '1jtrabajo.santiago@pjud.cl',
  },
  {
    id: 't19',
    nombre: '2° Juzgado de Letras del Trabajo de Santiago',
    tipo: 'laboral',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Teatinos 40, piso 9, Santiago Centro',
    telefono: '+56 2 2460 7300',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Acciones de tutela de derechos fundamentales', 'Procedimiento de aplicación general', 'Cobro de prestaciones laborales', 'Fuero sindical y prácticas antisindicales'],
    email: '2jtrabajo.santiago@pjud.cl',
  },
  {
    id: 't20',
    nombre: 'Juzgado de Letras del Trabajo de Valparaíso',
    tipo: 'laboral',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Condell 1490, Valparaíso',
    telefono: '+56 32 2268 100',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Aplicación del Código del Trabajo', 'Cobro de indemnizaciones y prestaciones', 'Tutela laboral y despidos', 'Procedimiento monitorio laboral'],
    email: 'jtrabajo.valparaiso@pjud.cl',
  },
  {
    id: 't21',
    nombre: 'Juzgado de Letras del Trabajo de Concepción',
    tipo: 'laboral',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Aníbal Pinto 492, Concepción',
    telefono: '+56 41 2246 300',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Procedimientos ordinario y monitorio laboral', 'Tutela laboral', 'Cobro de prestaciones e indemnizaciones', 'Prácticas antisindicales y desleales'],
    email: 'jtrabajo.concepcion@pjud.cl',
  },
  {
    id: 't22',
    nombre: 'Juzgado de Letras del Trabajo de Antofagasta',
    tipo: 'laboral',
    region: 'Antofagasta',
    ciudad: 'Antofagasta',
    direccion: 'Sucre 260, Antofagasta',
    telefono: '+56 55 2449 300',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Cobro de prestaciones e indemnizaciones', 'Tutela laboral y derechos fundamentales', 'Procedimiento monitorio', 'Acciones sindicales'],
    email: 'jtrabajo.antofagasta@pjud.cl',
  },
  {
    id: 't23',
    nombre: 'Juzgado de Letras del Trabajo de Temuco',
    tipo: 'laboral',
    region: 'La Araucanía',
    ciudad: 'Temuco',
    direccion: 'Manuel Montt 980, Temuco',
    telefono: '+56 45 2296 500',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Aplicación del Código del Trabajo', 'Tutela laboral y despidos', 'Cobro de prestaciones', 'Procedimiento monitorio laboral'],
    email: 'jtrabajo.temuco@pjud.cl',
  },
  {
    id: 't24',
    nombre: '1° Juzgado de Garantía de Santiago',
    tipo: 'garantia',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Agustinas 1419, Santiago Centro',
    telefono: '+56 2 2460 5100',
    horario: '08:30–18:00 Lun-Vie',
    competencia: ['Control de detenciones y formalización', 'Medidas cautelares personales', 'Procedimiento simplificado y monitorio penal', 'Salidas alternativas al juicio oral', 'Suspensión condicional del procedimiento'],
    email: '1jgarantia.santiago@pjud.cl',
  },
  {
    id: 't25',
    nombre: '7° Juzgado de Garantía de Santiago',
    tipo: 'garantia',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Agustinas 1419, Santiago Centro',
    telefono: '+56 2 2460 5170',
    horario: '08:30–18:00 Lun-Vie',
    competencia: ['Control de garantías procesales', 'Formalización de cargos', 'Procedimiento simplificado', 'Medidas cautelares reales y personales'],
    email: '7jgarantia.santiago@pjud.cl',
  },
  {
    id: 't26',
    nombre: 'Juzgado de Garantía de Valparaíso',
    tipo: 'garantia',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Condell 1490, Valparaíso',
    telefono: '+56 32 2268 200',
    horario: '08:30–18:00 Lun-Vie',
    competencia: ['Formalización e imputados en audiencia', 'Medidas cautelares personales', 'Suspensión condicional del procedimiento', 'Procedimiento abreviado y simplificado'],
    email: 'jgarantia.valparaiso@pjud.cl',
  },
  {
    id: 't27',
    nombre: 'Tribunal de Juicio Oral en lo Penal de Santiago',
    tipo: 'penal',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Huérfanos 1328, piso 12, Santiago Centro',
    telefono: '+56 2 2460 5400',
    horario: '09:00–18:00 Lun-Vie',
    competencia: ['Juicio oral en materia penal', 'Determinación de pena y condena', 'Conocimiento de crímenes y simples delitos', 'Recurso de nulidad (primer paso)', 'Registro de condenas penales'],
    email: 'top.santiago@pjud.cl',
  },
  {
    id: 't28',
    nombre: 'Tribunal de Juicio Oral en lo Penal de Concepción',
    tipo: 'penal',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: "O'Higgins 835, Concepción",
    telefono: '+56 41 2246 400',
    horario: '09:00–18:00 Lun-Vie',
    competencia: ['Juicio oral en lo penal', 'Crímenes y simples delitos región del Biobío', 'Determinación de responsabilidad penal', 'Acceso a juicio por hechos formalizados'],
    email: 'top.concepcion@pjud.cl',
  },
  {
    id: 't29',
    nombre: 'Juzgado de Garantía de Temuco',
    tipo: 'garantia',
    region: 'La Araucanía',
    ciudad: 'Temuco',
    direccion: 'Manuel Montt 980, Temuco',
    telefono: '+56 45 2296 600',
    horario: '08:30–18:00 Lun-Vie',
    competencia: ['Formalización de imputados', 'Medidas cautelares personales y reales', 'Suspensión condicional y acuerdos reparatorios', 'Procedimiento simplificado y monitorio'],
    email: 'jgarantia.temuco@pjud.cl',
  },
  {
    id: 't30',
    nombre: 'Tribunal de Juicio Oral en lo Penal de Antofagasta',
    tipo: 'penal',
    region: 'Antofagasta',
    ciudad: 'Antofagasta',
    direccion: 'Sucre 260, Antofagasta',
    telefono: '+56 55 2449 400',
    horario: '09:00–18:00 Lun-Vie',
    competencia: ['Juicio oral en lo penal', 'Crímenes y simples delitos región de Antofagasta', 'Determinación de responsabilidad penal', 'Condenas y absoluciones'],
    email: 'top.antofagasta@pjud.cl',
  },
  {
    id: 't31',
    nombre: '1° Juzgado de Familia de Santiago',
    tipo: 'familia',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Agustinas 1369, Santiago Centro',
    telefono: '+56 2 2460 6100',
    horario: '08:30–16:30 Lun-Vie',
    competencia: ['Causas de alimentos y cuidado personal', 'Divorcio y nulidad matrimonial', 'Relación directa y regular', 'Violencia intrafamiliar', 'Adopción y filiación'],
    email: '1jfamilia.santiago@pjud.cl',
  },
  {
    id: 't32',
    nombre: 'Juzgado de Familia de Valparaíso',
    tipo: 'familia',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Condell 1490, Valparaíso',
    telefono: '+56 32 2268 300',
    horario: '08:30–16:30 Lun-Vie',
    competencia: ['Alimentos y cuidado personal', 'Divorcios y separación judicial', 'Violencia intrafamiliar', 'Relación directa y regular'],
    email: 'jfamilia.valparaiso@pjud.cl',
  },
  {
    id: 't33',
    nombre: 'Juzgado de Familia de Concepción',
    tipo: 'familia',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Aníbal Pinto 492, Concepción',
    telefono: '+56 41 2246 500',
    horario: '08:30–16:30 Lun-Vie',
    competencia: ['Causas de familia y parentalidad', 'Divorcios y nulidades matrimoniales', 'Medidas de protección de menores', 'Alimentos y filiación'],
    email: 'jfamilia.concepcion@pjud.cl',
  },
  {
    id: 't34',
    nombre: 'Juzgado de Familia de Temuco',
    tipo: 'familia',
    region: 'La Araucanía',
    ciudad: 'Temuco',
    direccion: 'Manuel Montt 980, Temuco',
    telefono: '+56 45 2296 700',
    horario: '08:30–16:30 Lun-Vie',
    competencia: ['Alimentos, filiación y cuidado personal', 'Violencia intrafamiliar', 'Adopción y medidas de protección', 'Divorcios y separaciones'],
    email: 'jfamilia.temuco@pjud.cl',
  },
  {
    id: 't35',
    nombre: 'Juzgado de Familia de Antofagasta',
    tipo: 'familia',
    region: 'Antofagasta',
    ciudad: 'Antofagasta',
    direccion: 'Sucre 260, Antofagasta',
    telefono: '+56 55 2449 500',
    horario: '08:30–16:30 Lun-Vie',
    competencia: ['Causas de familia y menores', 'Alimentos y cuidado personal', 'Divorcios y nulidades', 'Violencia intrafamiliar'],
    email: 'jfamilia.antofagasta@pjud.cl',
  },
  {
    id: 't36',
    nombre: 'Juzgado de Familia de Puerto Montt',
    tipo: 'familia',
    region: 'Los Lagos',
    ciudad: 'Puerto Montt',
    direccion: 'San Martín 232, Puerto Montt',
    telefono: '+56 65 2482 900',
    horario: '08:30–16:30 Lun-Vie',
    competencia: ['Causas de alimentos y relación directa', 'Divorcios y nulidades matrimoniales', 'Medidas de protección de NNA', 'Violencia intrafamiliar'],
    email: 'jfamilia.puertomontt@pjud.cl',
  },
  {
    id: 't37',
    nombre: 'Tribunal Tributario y Aduanero Metropolitano',
    tipo: 'tributario',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Teatinos 120, piso 14, Santiago Centro',
    telefono: '+56 2 2530 4700',
    horario: '09:00–17:00 Lun-Vie',
    competencia: ['Reclamaciones tributarias ante el SII', 'Impugnación de liquidaciones y giros', 'Infracciones tributarias y multas', 'Recursos aduaneros ante el SNA', 'Restitución de impuestos pagados en exceso'],
    email: 'tta.metropolitano@tta.cl',
  },
  {
    id: 't38',
    nombre: 'Tribunal Tributario y Aduanero de Valparaíso',
    tipo: 'tributario',
    region: 'Valparaíso',
    ciudad: 'Valparaíso',
    direccion: 'Blanco 895, piso 4, Valparaíso',
    telefono: '+56 32 2280 700',
    horario: '09:00–17:00 Lun-Vie',
    competencia: ['Reclamaciones tributarias', 'Impugnación de resoluciones del SII', 'Infracciones tributarias regionales', 'Recursos aduaneros'],
    email: 'tta.valparaiso@tta.cl',
  },
  {
    id: 't39',
    nombre: 'Tribunal Tributario y Aduanero de Concepción',
    tipo: 'tributario',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Barros Arana 52, piso 6, Concepción',
    telefono: '+56 41 2940 400',
    horario: '09:00–17:00 Lun-Vie',
    competencia: ['Reclamaciones tributarias región del Biobío', 'Liquidaciones y giros del SII', 'Sanciones e infracciones tributarias', 'Recursos aduaneros'],
    email: 'tta.concepcion@tta.cl',
  },
  {
    id: 't40',
    nombre: 'Tribunal Tributario y Aduanero de Antofagasta',
    tipo: 'tributario',
    region: 'Antofagasta',
    ciudad: 'Antofagasta',
    direccion: 'Washington 2525, piso 3, Antofagasta',
    telefono: '+56 55 2595 800',
    horario: '09:00–17:00 Lun-Vie',
    competencia: ['Reclamaciones tributarias y mineras', 'Impugnación de actos del SII', 'Infracciones aduaneras', 'Restitución de tributos'],
    email: 'tta.antofagasta@tta.cl',
  },
  {
    id: 't41',
    nombre: 'Juzgado de Cobranza Laboral y Previsional de Santiago',
    tipo: 'cobranza',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Teatinos 40, piso 5, Santiago Centro',
    telefono: '+56 2 2460 7500',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Cobro ejecutivo de cotizaciones previsionales', 'Ejecución de sentencias laborales', 'Cobranza de multas del Trabajo', 'Cumplimiento de conciliaciones laborales'],
    email: 'jcobranza.santiago@pjud.cl',
  },
  {
    id: 't42',
    nombre: 'Juzgado de Cobranza Laboral y Previsional de Concepción',
    tipo: 'cobranza',
    region: 'Biobío',
    ciudad: 'Concepción',
    direccion: 'Aníbal Pinto 492, Concepción',
    telefono: '+56 41 2246 600',
    horario: '08:30–16:00 Lun-Vie',
    competencia: ['Cobro ejecutivo de cotizaciones previsionales', 'Ejecución de sentencias laborales', 'Cobranza de multas administrativas del Trabajo', 'Liquidaciones previsionales pendientes'],
    email: 'jcobranza.concepcion@pjud.cl',
  },
  {
    id: 't43',
    nombre: 'Centro de Arbitraje y Mediación de Santiago (CAM)',
    tipo: 'cao',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Monjitas 392, piso 14, Santiago Centro',
    telefono: '+56 2 2360 7400',
    horario: '09:00–18:00 Lun-Vie',
    competencia: ['Arbitraje comercial nacional e internacional', 'Mediación en conflictos empresariales', 'Procedimientos de arbitraje ad hoc', 'Nombramiento de árbitros mixtos y arbitradores', 'Mediación familiar y de negocios'],
    email: 'contacto@camsantiago.com',
  },
  {
    id: 't44',
    nombre: 'Centro de Arbitraje Comercial (CAC) — CChC',
    tipo: 'cao',
    region: 'Metropolitana',
    ciudad: 'Santiago',
    direccion: 'Marchant Pereira 10, piso 3, Providencia',
    telefono: '+56 2 2376 3300',
    horario: '09:00–18:00 Lun-Vie',
    competencia: ['Arbitraje en conflictos de construcción', 'Mediación en disputas inmobiliarias', 'Arbitraje de contratos comerciales y civiles', 'Peritajes técnicos especializados'],
    email: 'arbitraje@cchc.cl',
  },
]

const TIPOS_FILTER = [
  { key: 'all', label: 'Todos' },
  { key: 'cs', label: 'Corte Suprema' },
  { key: 'ca', label: 'C. Apelaciones' },
  { key: 'civil', label: 'Civil' },
  { key: 'laboral', label: 'Laboral' },
  { key: 'penal', label: 'Penal' },
  { key: 'garantia', label: 'Garantía' },
  { key: 'familia', label: 'Familia' },
  { key: 'tributario', label: 'Tributario' },
  { key: 'cobranza', label: 'Cobranza' },
  { key: 'cao', label: 'Arbitraje' },
]

const REGIONES = [
  'Todas las regiones',
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'La Araucanía',
  'Los Lagos',
  'Antofagasta',
  'Coquimbo',
  "O'Higgins",
  'Maule',
  'Los Ríos',
  'Arica y Parinacota',
  'Tarapacá',
  'Atacama',
  'Ñuble',
  'Magallanes',
  'Aysén',
]

export default function Tribunales() {
  const [search, setSearch] = useState('')
  const [tipoFilter, setTipoFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('Todas las regiones')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = TRIBUNALES.filter(t => {
    const q = search.toLowerCase()
    const matchSearch =
      !search ||
      t.nombre.toLowerCase().includes(q) ||
      t.ciudad.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q)
    const matchTipo = tipoFilter === 'all' || t.tipo === tipoFilter
    const matchRegion = regionFilter === 'Todas las regiones' || t.region === regionFilter
    return matchSearch && matchTipo && matchRegion
  })

  const copyPhone = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Directorio de Tribunales</h1>
          <p className="text-xs text-slate-400 mt-1">Chile · {TRIBUNALES.length} tribunales · Poder Judicial + organismos de arbitraje</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(245,158,11,0.15))', border: '1px solid rgba(139,92,246,0.3)' }}>
            <Scale size={16} className="text-purple-400" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-4 flex items-center justify-between gap-4"
        style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <MapPin size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Ver en Mapa</p>
            <p className="text-[10px] text-slate-500">Distribución geográfica de tribunales por región</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-purple-300 flex-shrink-0 transition-all hover:bg-purple-500/20"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <ExternalLink size={11} />Próximamente
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, ciudad o región..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}
          />
        </div>
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          className="py-2.5 px-3 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', minWidth: '175px' }}>
          {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap">
        {TIPOS_FILTER.map(f => {
          const cfg = f.key !== 'all' ? TIPO_CONFIG[f.key as TipoTribunal] : null
          const active = tipoFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setTipoFilter(f.key)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap"
              style={active
                ? { background: cfg ? `${cfg.bg}` : 'rgba(99,102,241,0.2)', color: cfg ? cfg.color : '#a5b4fc', border: `1px solid ${cfg ? cfg.color + '50' : 'rgba(99,102,241,0.4)'}` }
                : { background: 'rgba(15,23,42,0.6)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }
              }>
              {f.label}
            </button>
          )
        })}
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          Mostrando <span className="text-slate-300 font-semibold">{filtered.length}</span> de <span className="text-slate-300 font-semibold">{TRIBUNALES.length}</span> tribunales
        </p>
        {(search || tipoFilter !== 'all' || regionFilter !== 'Todas las regiones') && (
          <button onClick={() => { setSearch(''); setTipoFilter('all'); setRegionFilter('Todas las regiones') }}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
            Limpiar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-600 text-sm">
          <Scale size={32} className="mx-auto mb-3 opacity-30" />
          No se encontraron tribunales con los filtros aplicados
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((t, i) => {
          const cfg = TIPO_CONFIG[t.tipo]
          const isExpanded = expandedId === t.id
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${isExpanded ? cfg.color + '30' : 'rgba(255,255,255,0.07)'}` }}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : t.id)}
                className="w-full p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-all text-left">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                  <Building2 size={15} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-slate-500">{t.region}</span>
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">{t.nombre}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={9} style={{ color: cfg.color }} />{t.ciudad}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock size={9} />{t.horario}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Phone size={9} />{t.telefono}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {t.competencia.slice(0, 3).map((c, ci) => (
                      <span key={ci} className="text-[9px] px-2 py-0.5 rounded-full text-slate-400"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {c}
                      </span>
                    ))}
                    {t.competencia.length > 3 && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full text-slate-500"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        +{t.competencia.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {isExpanded
                    ? <ChevronUp size={14} className="text-slate-500" />
                    : <ChevronDown size={14} className="text-slate-500" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1 border-t border-white/[0.05] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl space-y-2" style={{ background: `${cfg.color}06`, border: `1px solid ${cfg.color}18` }}>
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>Ubicación</p>
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <MapPin size={11} className="text-slate-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-slate-300">{t.direccion}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={11} className="text-slate-500 flex-shrink-0" />
                              <p className="text-xs text-slate-300">{t.horario}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl space-y-2" style={{ background: `${cfg.color}06`, border: `1px solid ${cfg.color}18` }}>
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>Contacto</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Phone size={11} className="text-slate-500 flex-shrink-0" />
                              <p className="text-xs text-slate-300 flex-1">{t.telefono}</p>
                              <button
                                onClick={() => copyPhone(t.id, t.telefono)}
                                className="p-1 rounded-lg transition-all hover:bg-white/10"
                                title="Copiar teléfono">
                                <Copy size={10} className={copiedId === t.id ? 'text-green-400' : 'text-slate-500'} />
                              </button>
                            </div>
                            {t.email && (
                              <div className="flex items-center gap-2">
                                <Mail size={11} className="text-slate-500 flex-shrink-0" />
                                <p className="text-xs text-slate-300 truncate">{t.email}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Competencia</p>
                        <div className="flex flex-wrap gap-1.5">
                          {t.competencia.map((c, ci) => (
                            <span key={ci} className="text-[10px] px-2.5 py-1 rounded-xl text-slate-300"
                              style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}25` }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <a
                        href="https://www.pjud.cl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] transition-colors hover:opacity-80 w-fit"
                        style={{ color: cfg.color }}>
                        <ExternalLink size={11} />Ver en Poder Judicial
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
