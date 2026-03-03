import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, DollarSign, Calendar, Scale, TrendingUp, Clock, RotateCcw, Info } from 'lucide-react'

const UF_VALOR = 38200

function fmtCLP(n: number) {
  return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}
function fmtUF(n: number) {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' UF'
}
function fmtPct(n: number) {
  return n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
}

const inputCls =
  'w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500 transition'
const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
}
const labelCls = 'block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide'
const cardCls = 'rounded-2xl p-5 space-y-5'
const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4 space-y-2.5"
      style={{
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.25)',
      }}
    >
      {children}
    </div>
  )
}

function ResultRow({ label, value, big, red }: { label: string; value: string; big?: boolean; red?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-slate-400 ${big ? 'text-sm font-semibold' : 'text-xs'}`}>{label}</span>
      {big ? (
        <span
          className={`text-lg font-black ${red ? 'text-red-400' : ''}`}
          style={!red ? { background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}
        >
          {value}
        </span>
      ) : (
        <span className={`text-sm font-semibold ${red ? 'text-red-400' : 'text-white'}`}>{value}</span>
      )}
    </div>
  )
}

function InfoBox({ text }: { text: string }) {
  return (
    <div
      className="flex gap-2.5 rounded-xl p-3.5"
      style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
    >
      <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />
      <p className="text-xs text-blue-300 leading-relaxed">{text}</p>
    </div>
  )
}

function CalcButton({ onClick, onReset }: { onClick: () => void; onReset: () => void }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onClick}
        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
        style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}
      >
        Calcular
      </button>
      <button
        onClick={onReset}
        className="px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white transition"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        title="Limpiar"
      >
        <RotateCcw size={15} />
      </button>
    </div>
  )
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={inputCls + ' appearance-none pr-8 cursor-pointer'}
        style={inputStyle}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#1e293b' }}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 4l4 4 4-4"/></svg>
      </span>
    </div>
  )
}

function Toggle({ value, onChange, labels }: { value: boolean; onChange: (v: boolean) => void; labels: [string, string] }) {
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
      {([false, true] as boolean[]).map((v, i) => (
        <button
          key={i}
          onClick={() => onChange(v)}
          className="flex-1 py-2 text-xs font-semibold transition"
          style={value === v
            ? { background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff' }
            : { color: '#94a3b8' }}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  )
}

function Calc1() {
  const [rem, setRem] = useState('')
  const [anos, setAnos] = useState('')
  const [tipo, setTipo] = useState('necesidades')
  const [result, setResult] = useState<null | { base: number; aviso: number; total: number; totalUF: number }>(null)

  const reset = () => { setRem(''); setAnos(''); setTipo('necesidades'); setResult(null) }

  const calc = () => {
    const r = parseFloat(rem.replace(/\./g, '').replace(',', '.'))
    const a = parseInt(anos)
    if (!r || !a || r <= 0 || a <= 0) return
    const anosEfectivos = Math.min(a, 11)
    const base = r * anosEfectivos
    const baseConRecargo = tipo === 'injustificado' ? base * 1.3 : base
    const aviso = tipo === 'necesidades' ? r : 0
    const total = baseConRecargo + aviso
    setResult({ base: baseConRecargo, aviso, total, totalUF: total / UF_VALOR })
  }

  return (
    <div style={cardStyle} className={cardCls}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Remuneración mensual (CLP)</label>
          <input type="number" min="0" placeholder="Ej: 1500000" value={rem} onChange={e => setRem(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls}>Años de servicio</label>
          <input type="number" min="1" step="1" placeholder="Ej: 5" value={anos} onChange={e => setAnos(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Tipo de despido</label>
        <SelectInput value={tipo} onChange={setTipo} options={[
          { value: 'necesidades', label: 'Necesidades empresa Art.161' },
          { value: 'desahucio', label: 'Desahucio empleador Art.161' },
          { value: 'sin_causa', label: 'Sin expresión de causa' },
          { value: 'injustificado', label: 'Injustificado Art.168' },
        ]} />
      </div>
      <CalcButton onClick={calc} onReset={reset} />
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <ResultBox>
              <ResultRow label="Base indemnización" value={fmtCLP(result.base)} />
              {result.aviso > 0 && <ResultRow label="+ Aviso previo (sustitutivo)" value={fmtCLP(result.aviso)} />}
              <div style={{ borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: 8 }} />
              <ResultRow label="Total indemnización" value={fmtCLP(result.total)} big />
              <ResultRow label="Equivalente en UF" value={fmtUF(result.totalUF)} />
            </ResultBox>
          </motion.div>
        )}
      </AnimatePresence>
      <InfoBox text="Art. 163 Código del Trabajo: 30 días por año de servicio, máximo 11 años. Art. 168: recargo mínimo 30% por despido injustificado." />
    </div>
  )
}

function Calc2() {
  const [capital, setCapital] = useState('1000000')
  const [tasa, setTasa] = useState('1.5')
  const [meses, setMeses] = useState('12')
  const [tipo, setTipo] = useState('simple')
  const [result, setResult] = useState<null | { capitalNum: number; intereses: number; total: number; tasaAnual: number }>(null)

  const reset = () => { setCapital('1000000'); setTasa('1.5'); setMeses('12'); setTipo('simple'); setResult(null) }

  const calc = () => {
    const c = parseFloat(capital.replace(/\./g, '').replace(',', '.'))
    const t = parseFloat(tasa.replace(',', '.'))
    const m = parseInt(meses)
    if (!c || !t || !m || c <= 0 || t <= 0 || m <= 0) return
    const total = tipo === 'simple'
      ? c * (1 + (t / 100) * m)
      : c * Math.pow(1 + t / 100, m)
    const intereses = total - c
    const tasaAnual = tipo === 'simple'
      ? t * 12
      : (Math.pow(1 + t / 100, 12) - 1) * 100
    setResult({ capitalNum: c, intereses, total, tasaAnual })
  }

  return (
    <div style={cardStyle} className={cardCls}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Capital (CLP)</label>
          <input type="number" min="0" placeholder="1000000" value={capital} onChange={e => setCapital(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls}>Tasa mensual (%)</label>
          <input type="number" min="0" step="0.01" placeholder="1.5" value={tasa} onChange={e => setTasa(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls}>Período (meses)</label>
          <input type="number" min="1" step="1" placeholder="12" value={meses} onChange={e => setMeses(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls}>Tipo de interés</label>
          <SelectInput value={tipo} onChange={setTipo} options={[
            { value: 'simple', label: 'Interés simple' },
            { value: 'compuesto', label: 'Interés compuesto' },
          ]} />
        </div>
      </div>
      <CalcButton onClick={calc} onReset={reset} />
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <ResultBox>
              <ResultRow label="Capital original" value={fmtCLP(result.capitalNum)} />
              <ResultRow label="Total intereses" value={fmtCLP(result.intereses)} />
              <div style={{ borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: 8 }} />
              <ResultRow label="Monto total" value={fmtCLP(result.total)} big />
              <ResultRow label="Tasa anual equivalente" value={fmtPct(result.tasaAnual)} />
            </ResultBox>
          </motion.div>
        )}
      </AnimatePresence>
      <InfoBox text="Art. 1559 Código Civil. Interés moratorio: 1,5% mensual (Art. 4 bis Ley 20.416). El interés máximo convencional no puede exceder en más de un 50% al interés corriente." />
    </div>
  )
}

function diffMonths(d1: Date, d2: Date) {
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
}

function Calc3() {
  const today = new Date().toISOString().slice(0, 10)
  const [monto, setMonto] = useState('')
  const [enUF, setEnUF] = useState(false)
  const [fechaOrigen, setFechaOrigen] = useState('')
  const [fechaDestino, setFechaDestino] = useState(today)
  const [result, setResult] = useState<null | { original: number; factor: number; actualizado: number; diferencia: number; enUF: boolean }>(null)

  const reset = () => { setMonto(''); setEnUF(false); setFechaOrigen(''); setFechaDestino(today); setResult(null) }

  const calc = () => {
    const m = parseFloat(monto.replace(/\./g, '').replace(',', '.'))
    if (!m || !fechaOrigen || !fechaDestino) return
    const d1 = new Date(fechaOrigen)
    const d2 = new Date(fechaDestino)
    const months = diffMonths(d1, d2)
    if (months < 0) return
    const factor = 1 + months * 0.003
    const actualizado = m * factor
    setResult({ original: m, factor, actualizado, diferencia: actualizado - m, enUF })
  }

  return (
    <div style={cardStyle} className={cardCls}>
      <div>
        <label className={labelCls}>Tipo de monto</label>
        <Toggle value={enUF} onChange={setEnUF} labels={['Monto en CLP', 'Monto en UF']} />
      </div>
      <div>
        <label className={labelCls}>Monto ({enUF ? 'UF' : 'CLP'})</label>
        <input type="number" min="0" placeholder={enUF ? 'Ej: 100' : 'Ej: 3820000'} value={monto} onChange={e => setMonto(e.target.value)} className={inputCls} style={inputStyle} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Fecha origen</label>
          <input type="date" value={fechaOrigen} onChange={e => setFechaOrigen(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls}>Fecha destino</label>
          <input type="date" value={fechaDestino} onChange={e => setFechaDestino(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
      </div>
      <CalcButton onClick={calc} onReset={reset} />
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <ResultBox>
              <ResultRow label="Valor original" value={result.enUF ? fmtUF(result.original) : fmtCLP(result.original)} />
              <ResultRow label="Factor de reajuste" value={result.factor.toFixed(4) + 'x'} />
              <ResultRow label="+ Diferencia" value={result.enUF ? fmtUF(result.diferencia) : fmtCLP(result.diferencia)} />
              <div style={{ borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: 8 }} />
              <ResultRow label="Valor actualizado" value={result.enUF ? fmtUF(result.actualizado) : fmtCLP(result.actualizado)} big />
              {result.enUF && <ResultRow label="Equivalente CLP hoy" value={fmtCLP(result.actualizado * UF_VALOR)} />}
            </ResultBox>
          </motion.div>
        )}
      </AnimatePresence>
      <InfoBox text={`Fuente: Comisión para el Mercado Financiero (CMF). Valor UF hoy: $${UF_VALOR.toLocaleString('es-CL')} CLP. El valor exacto debe verificarse en cmfchile.cl. Factor estimado: 0,3% mensual.`} />
    </div>
  )
}

function Calc4() {
  const [monto, setMonto] = useState('')
  const [gano, setGano] = useState(true)
  const [procedimiento, setProcedimiento] = useState('ordinario')
  const [result, setResult] = useState<null | { personales: number; procesales: number; total: number }>(null)

  const reset = () => { setMonto(''); setGano(true); setProcedimiento('ordinario'); setResult(null) }

  const calc = () => {
    const m = parseFloat(monto.replace(/\./g, '').replace(',', '.'))
    if (!m || m <= 0) return
    if (!gano) { setResult({ personales: 0, procesales: 0, total: 0 }); return }
    const mult: Record<string, number> = { ordinario: 1.0, sumario: 0.75, ejecutivo: 0.5 }
    const base = m * 0.05 * (mult[procedimiento] ?? 1)
    const personales = base * 0.6
    const procesales = base * 0.4
    setResult({ personales, procesales, total: base })
  }

  return (
    <div style={cardStyle} className={cardCls}>
      <div>
        <label className={labelCls}>Monto demandado (CLP)</label>
        <input type="number" min="0" placeholder="Ej: 50000000" value={monto} onChange={e => setMonto(e.target.value)} className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className={labelCls}>Resultado del juicio</label>
        <Toggle value={gano} onChange={setGano} labels={['Perdió el juicio', 'Ganó el juicio']} />
      </div>
      <div>
        <label className={labelCls}>Tipo de procedimiento</label>
        <SelectInput value={procedimiento} onChange={setProcedimiento} options={[
          { value: 'ordinario', label: 'Ordinario' },
          { value: 'sumario', label: 'Sumario' },
          { value: 'ejecutivo', label: 'Ejecutivo' },
        ]} />
      </div>
      <CalcButton onClick={calc} onReset={reset} />
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <ResultBox>
              {result.total === 0 ? (
                <div className="text-center py-2">
                  <p className="text-sm text-slate-300 font-semibold">Sin derecho a costas</p>
                  <p className="text-xs text-slate-500 mt-1">La parte que pierde el juicio no tiene derecho a solicitar costas.</p>
                </div>
              ) : (
                <>
                  <ResultRow label="Costas personales estimadas" value={fmtCLP(result.personales)} />
                  <ResultRow label="Costas procesales estimadas" value={fmtCLP(result.procesales)} />
                  <div style={{ borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: 8 }} />
                  <ResultRow label="Total costas estimadas" value={fmtCLP(result.total)} big />
                  <p className="text-xs text-slate-500 pt-1">Monto referencial. El tribunal fija las costas a su prudente arbitrio.</p>
                </>
              )}
            </ResultBox>
          </motion.div>
        )}
      </AnimatePresence>
      <InfoBox text="Art. 144 CPC: El tribunal condena en costas a la parte que ha perdido totalmente el juicio. Las costas son reguladas por el tribunal a su prudente arbitrio. Porcentaje estimado: 5% del monto demandado." />
    </div>
  )
}

const PLAZOS_OPTIONS = [
  { label: 'Contestación demanda ordinaria (15 días)', dias: 15 },
  { label: 'Contestación demanda ordinaria con patrocinio (30 días)', dias: 30 },
  { label: 'Apelación sentencia definitiva (10 días)', dias: 10 },
  { label: 'Apelación sentencia interlocutoria (5 días)', dias: 5 },
  { label: 'Recurso de casación en la forma (15 días)', dias: 15 },
  { label: 'Recurso de casación en el fondo (15 días)', dias: 15 },
  { label: 'Recurso de reposición (5 días)', dias: 5 },
  { label: 'Demanda laboral - respuesta (5 días)', dias: 5 },
  { label: 'Recurso de nulidad laboral (10 días)', dias: 10 },
  { label: 'Notificación personal - plazo actuación (3 días)', dias: 3 },
]

function addDaysHabiles(start: Date, dias: number) {
  let current = new Date(start)
  let added = 0
  while (added < dias) {
    current.setDate(current.getDate() + 1)
    const day = current.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return current
}

function addDaysCorreidos(start: Date, dias: number) {
  const d = new Date(start)
  d.setDate(d.getDate() + dias)
  return d
}

function Calc5() {
  const today = new Date().toISOString().slice(0, 10)
  const [fechaInicio, setFechaInicio] = useState(today)
  const [plazoIdx, setPlazoIdx] = useState(0)
  const [habiles, setHabiles] = useState(true)
  const [result, setResult] = useState<null | { inicio: string; dias: number; vencimiento: Date; restantes: number }>(null)

  const reset = () => { setFechaInicio(today); setPlazoIdx(0); setHabiles(true); setResult(null) }

  const calc = () => {
    if (!fechaInicio) return
    const start = new Date(fechaInicio + 'T12:00:00')
    const { dias } = PLAZOS_OPTIONS[plazoIdx]
    const vencimiento = habiles ? addDaysHabiles(start, dias) : addDaysCorreidos(start, dias)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const restantes = Math.ceil((vencimiento.getTime() - now.getTime()) / 86400000)
    setResult({ inicio: fechaInicio, dias, vencimiento, restantes })
  }

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={cardStyle} className={cardCls}>
      <div>
        <label className={labelCls}>Fecha de inicio del plazo</label>
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className={inputCls} style={inputStyle} />
      </div>
      <div>
        <label className={labelCls}>Tipo de plazo</label>
        <SelectInput
          value={String(plazoIdx)}
          onChange={v => setPlazoIdx(parseInt(v))}
          options={PLAZOS_OPTIONS.map((o, i) => ({ value: String(i), label: o.label }))}
        />
      </div>
      <div>
        <label className={labelCls}>Tipo de días</label>
        <Toggle value={habiles} onChange={setHabiles} labels={['Días corridos', 'Días hábiles']} />
      </div>
      <CalcButton onClick={calc} onReset={reset} />
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <ResultBox>
              <ResultRow label="Fecha de inicio" value={new Date(result.inicio + 'T12:00:00').toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <ResultRow label="Plazo" value={`${result.dias} días ${habiles ? 'hábiles' : 'corridos'}`} />
              <div style={{ borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: 8 }} />
              <ResultRow
                label="Fecha de vencimiento"
                value={fmtDate(result.vencimiento)}
                big
                red={result.restantes < 0}
              />
              <ResultRow
                label={result.restantes < 0 ? 'Plazo vencido hace' : result.restantes === 0 ? 'Vence hoy' : 'Días restantes'}
                value={result.restantes < 0 ? `${Math.abs(result.restantes)} días` : result.restantes === 0 ? 'Hoy' : `${result.restantes} días`}
                red={result.restantes <= 0}
              />
            </ResultBox>
          </motion.div>
        )}
      </AnimatePresence>
      <InfoBox text="Art. 48 CPC: Los plazos de días se entienden suspendidos durante los feriados. Días hábiles: lunes a viernes, excluidos feriados. Verifique feriados judiciales vigentes." />
    </div>
  )
}

const TABS = [
  { id: 'laboral', label: 'Indemnización Laboral', short: 'Laboral', icon: Scale },
  { id: 'intereses', label: 'Intereses Legales', short: 'Intereses', icon: TrendingUp },
  { id: 'uf', label: 'Actualización UF/IPC', short: 'UF/IPC', icon: DollarSign },
  { id: 'costas', label: 'Costas Procesales', short: 'Costas', icon: Clock },
  { id: 'plazos', label: 'Plazos Procesales', short: 'Plazos', icon: Calendar },
]

export default function Calculadoras() {
  const [activeTab, setActiveTab] = useState('laboral')

  return (
    <div className="space-y-5" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div
          className="p-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}
        >
          <Calculator size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Calculadoras Legales</h1>
          <p className="text-xs text-slate-500 mt-0.5">Herramientas de cálculo para el ejercicio jurídico chileno</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap gap-2"
      >
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
              style={active
                ? { background: 'linear-gradient(135deg,#6366f1,#7c3aed)', color: '#fff', boxShadow: '0 0 16px rgba(99,102,241,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'laboral' && <Calc1 />}
          {activeTab === 'intereses' && <Calc2 />}
          {activeTab === 'uf' && <Calc3 />}
          {activeTab === 'costas' && <Calc4 />}
          {activeTab === 'plazos' && <Calc5 />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
