import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Clock, BookOpen, Calculator, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { CASOS, PLAZOS_LEGALES } from '../../data/appData'

const IMPUESTOS_CLAVE = [
  { nombre: 'Impuesto a la Renta (1ra Cat.)', tasa: '27%', base: 'Renta neta empresas', art: 'Art. 20 LIR', tipo: 'anual' },
  { nombre: 'Impuesto Global Complementario', tasa: '0–40%', base: 'Renta global personas', art: 'Art. 52 LIR', tipo: 'anual' },
  { nombre: 'IVA (Tasa General)', tasa: '19%', base: 'Ventas y servicios', art: 'Art. 14 DL 825', tipo: 'mensual' },
  { nombre: 'Impuesto de Timbres y Estampillas', tasa: '0.8%', base: 'Documentos de crédito', art: 'Art. 1 DL 3475', tipo: 'por acto' },
  { nombre: 'Impuesto Adicional', tasa: '35%', base: 'Retiros a no domiciliados', art: 'Art. 58 LIR', tipo: 'retención' },
]

const INFRACCIONES = [
  { infraccion: 'Declaración maliciosamente falsa', norma: 'Art. 97 N°4 CT', sancion: 'Multa 50%–300% impuesto + presidio menor', grave: true },
  { infraccion: 'No emisión de boleta/factura', norma: 'Art. 97 N°10 CT', sancion: 'Multa hasta 50 UTM · Clausura', grave: true },
  { infraccion: 'Atraso en declaración', norma: 'Art. 97 N°2 CT', sancion: '10% impuesto + 1.5% por mes', grave: false },
  { infraccion: 'No llevar contabilidad', norma: 'Art. 97 N°7 CT', sancion: 'Multa 1 UTM – 1 UTA', grave: false },
  { infraccion: 'Evasión tributaria', norma: 'Art. 97 N°4 inc.3 CT', sancion: 'Presidio menor en su grado máximo', grave: true },
]

function CalculadoraIVA() {
  const [neto, setNeto] = useState('')
  const [modo, setModo] = useState<'agregar' | 'desagregar'>('agregar')

  const calcular = () => {
    const n = parseFloat(neto) || 0
    if (modo === 'agregar') {
      const iva = Math.round(n * 0.19)
      return { neto: n, iva, bruto: n + iva }
    } else {
      const netoReal = Math.round(n / 1.19)
      const iva = n - netoReal
      return { neto: netoReal, iva, bruto: n }
    }
  }

  const res = neto ? calcular() : null

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
      <div className="flex items-center gap-2">
        <Calculator size={13} className="text-orange-400" />
        <span className="text-xs font-bold text-orange-300">Calculadora IVA (19%)</span>
      </div>
      <div className="flex gap-2">
        {(['agregar', 'desagregar'] as const).map(m => (
          <button key={m} onClick={() => setModo(m)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${modo === m ? 'text-white' : 'text-slate-500'}`}
            style={modo === m ? { background: 'linear-gradient(135deg,#ea580c,#f97316)' } : { background: 'rgba(255,255,255,0.04)' }}>
            {m === 'agregar' ? 'Agregar IVA' : 'Desagregar IVA'}
          </button>
        ))}
      </div>
      <div>
        <p className="text-[10px] text-slate-500 mb-1">{modo === 'agregar' ? 'Valor neto ($)' : 'Valor bruto con IVA ($)'}</p>
        <input type="number" value={neto} onChange={e => setNeto(e.target.value)} placeholder="Ej: 1000000"
          className="w-full px-2.5 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>
      {res && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)' }}>
          {[
            { label: 'Valor neto', val: res.neto },
            { label: 'IVA (19%)', val: res.iva },
            { label: 'Total bruto', val: res.bruto, highlight: true },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-xs">
              <span className="text-slate-400">{r.label}</span>
              <span className={`font-semibold ${r.highlight ? 'text-orange-400' : 'text-slate-300'}`}>${r.val.toLocaleString('es-CL')}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function Tributario() {
  const casosTributarios = CASOS.filter(c => c.especialidad === 'tributario')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)' }}>
            <TrendingUp size={14} className="text-orange-400" />
          </div>
          <h1 className="text-xl font-black text-white">Derecho Tributario</h1>
        </div>
        <p className="text-xs text-slate-500">Código Tributario · LIR · DL 825 IVA · SII · TTA</p>
      </motion.div>

      {casosTributarios.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Causas Tributarias Activas</span>
            <Link to="/casos" className="text-[10px] text-orange-400">Ver todas</Link>
          </div>
          {casosTributarios.map((c, i) => (
            <Link to={`/casos/${c.id}`} key={c.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < casosTributarios.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.titulo}</p>
                <p className="text-[10px] text-slate-500">{c.rol} · {c.etapa}</p>
              </div>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      <CalculadoraIVA />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-orange-400" />Impuestos Principales (Chile)</p>
        <div className="space-y-2">
          {IMPUESTOS_CLAVE.map(imp => (
            <div key={imp.nombre} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-200 truncate">{imp.nombre}</span>
                  <span className="text-[9px] text-slate-600 flex-shrink-0">{imp.art}</span>
                </div>
                <p className="text-[10px] text-slate-600">{imp.base}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black text-orange-400">{imp.tasa}</p>
                <p className="text-[9px] text-slate-600">{imp.tipo}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><AlertTriangle size={13} className="text-orange-400" />Infracciones Art. 97 Código Tributario</p>
        <div className="space-y-2">
          {INFRACCIONES.map(inf => (
            <div key={inf.infraccion} className="p-3 rounded-xl" style={{ background: inf.grave ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${inf.grave ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)'}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-200">{inf.infraccion}</span>
                {inf.grave && <span className="text-[9px] font-black text-red-400 px-1.5 py-0.5 rounded-full bg-red-500/10">GRAVE</span>}
              </div>
              <p className="text-[10px] text-orange-400 font-semibold">{inf.norma}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{inf.sancion}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Clock size={13} className="text-orange-400" />Plazos Tributarios Clave</p>
        <div className="space-y-1.5">
          {PLAZOS_LEGALES.tributario.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 pr-3 min-w-0">
                <p className="text-xs text-slate-300 truncate">{p.acto}</p>
                <p className="text-[10px] text-slate-600">{p.articulo}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-white">{p.dias >= 365 ? `${Math.round(p.dias/365)}a` : `${p.dias}d`}</span>
                <span className="text-[9px] text-slate-500">{p.tipo}</span>
                {p.fatal && <AlertTriangle size={10} className="text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
