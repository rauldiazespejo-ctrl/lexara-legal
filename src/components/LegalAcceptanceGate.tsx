import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, FileCheck, Scale, Lock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

export const LEGAL_ACCEPT_STORAGE_KEY = 'lexara_legal_accept'
export const LEGAL_ACCEPT_VERSION = '2026-1'

const SECTIONS: { t: string; c: string }[] = [
  {
    t: 'Marco legal aplicable',
    c:
      'El tratamiento de sus datos y el uso de la plataforma se rigen por el ordenamiento jurídico chileno, en particular la Ley N° 19.628 sobre Protección de la Vida Privada, la Ley N° 19.880 que establece normas sobre protección de los derechos de los consumidores, y el artículo 19 N°4 de la Constitución Política de la República en lo que respecta al respeto y protección a la vida privada y a la honra, sin perjuicio de otras normas sectoriales que resulten aplicables a su actividad profesional.',
  },
  {
    t: 'Naturaleza del servicio',
    c:
      'LEXARA PRO es un instrumento de apoyo al ejercicio profesional (herramientas de análisis, generación de borradores y gestión). No constituye asesoría legal sustitutiva ni opinión vinculante. El/la abogado(a) usuario(a) mantiene la responsabilidad profesional sobre las decisiones, escritos y actuaciones que adopte, incluida la verificación de resultados asistidos por inteligencia artificial frente a la ley, jurisprudencia y hechos concretos.',
  },
  {
    t: 'Datos personales y de la actividad profesional',
    c:
      'Los datos personales, identificativos y, en su caso, de mandantes o terceros introducidos en el sistema, se tratarán con finalidades legítimas, proporcionales y vinculadas a la contratación y uso de la plataforma (prestación del servicio, seguridad, mejora del producto y, cuando corresponda, cumplimiento de obligaciones legales). Puede solicitar el ejercicio de acceso, rectificación, cancelación, bloqueo u oposición, conforme a la ley, ante el responsable del sitio, sin perjuicio de canales que la normativa ponga a su disposición (p. ej. reclamos ante SERNAC en su ámbito y las vías de derecho a la protección de la vida privada y habeas data). Se recomienda no cargar en la plataforma categorías de datos cuya base legal no tenga asegurada, sin perjuicio de que el usuario sea responsable del cumplimiento de secreto y deberes propios de su título (Ley 15.175 y normativa concordante, según corresponda al caso concreto).',
  },
  {
    t: 'Inteligencia artificial (PulsoAI)',
    c:
      'Las funciones de IA son desarrolladas en el ecosistema de su agencia de inteligencia artificial asociada (PulsoAI). Los resultados pueden contener inexactitudes o reflejar el estado del conocimiento y modelos a una fecha dada. Debe validar criterio, cita y estrategia antes de usarlos en trámites, audiencias o ante terceros.',
  },
  {
    t: 'Confidencialidad y seguridad',
    c:
      'Usted deberá mantener la confidencialidad de sus credenciales y utilizar el servicio con diligencia, adoptando en su estudio o empresa las medidas técnicas y organizativas razonables. La plataforma aplica mecanismos técnicos habituales de la industria, sin que ello implique garantía absoluta frente a riesgos inherentes a servicios en línea. El secreto y la ética de la abogacía continúan vinculando a la persona usuaria con independencia de este acuerdo.',
  },
  {
    t: 'Aceptación',
    c:
      'Al marcar la casilla inferior y continuar, declara haber leído lo anterior, ser mayor de edad o actuar con representación válida, y acepta estas condiciones en su versión publicada. Si no está de acuerdo, deberá abstenerse de utilizar LEXARA PRO.',
  },
]

type Props = { onAccept: () => void }

export function LegalAcceptanceGate({ onAccept }: Props) {
  const [open, setOpen] = useState(false)
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const ok = a && b

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'radial-gradient(ellipse at 30% 20%,#0b1228 0%,#02050c 50%)' }}
    >
      <PulsoBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl rounded-2xl border relative z-10"
        style={{
          background: 'rgba(8,12,30,0.95)',
          borderColor: 'rgba(99,102,241,0.25)',
          boxShadow: '0 0 0 1px rgba(14,116,199,0.1), 0 40px 100px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="h-1.5 w-full"
          style={{ background: 'linear-gradient(90deg,#0ea5e9,#4f46e5,#7c3aed)' }}
        />
        <div className="p-6 md:p-8 space-y-5 max-h-[min(90vh,820px)] overflow-y-auto">
          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.25)' }}
            >
              <Scale size={22} className="text-sky-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-sky-500/90 uppercase tracking-[0.2em]">Condiciones de inicio</p>
              <h1 className="text-xl md:text-2xl font-black text-white mt-1 leading-tight">
                Aceptación legal y datos personales
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Antes de ingresar a <span className="text-slate-300 font-semibold">LEXARA PRO</span>, lea y acepte lo siguiente, alineado con ley chilena
                vigente (en especial Ley N° 19.628 y disposiciones conexas) y buenas prácticas para el manejo de la información
                en entornos profesionales.
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed space-y-2"
            style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {SECTIONS.map((s, i) => (
              <p key={i}>
                <span className="text-slate-300 font-bold">{s.t}. </span>
                {s.c}
              </p>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)' }}
          >
            <span className="flex items-center gap-2 font-semibold text-slate-500">
              <FileCheck size={14} className="text-indigo-400" />
              Resumen de obligaciones
            </span>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-[10px] text-slate-500 space-y-1.5 pl-1 overflow-hidden"
              >
                {[
                  'Cumplir con la ley y la deontología aplicable a su título y mandatos.',
                  'Solo cargar o tratar datos con base legal adecuada a la relación con sus clientes y terceros.',
                  'No atribuir a la plataforma criterio reemplazante de su deber de diligencia y secreto.',
                ].map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-sky-500/80">·</span>
                    {line}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <div
            className="rounded-xl p-3 flex items-start gap-2"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}
          >
            <Lock size={14} className="text-emerald-400/90 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <span className="text-slate-400 font-semibold">Ley 19.628. </span>
              El tratamiento de datos personales debe respetar los principios de licitud, proporcionalidad y no discriminación, con
              medidas de confidencialidad. Las políticas y procedimientos internos de su estudio o empresa complementan y no sustituyen
              esta aceptación.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={a}
                onChange={e => setA(e.target.checked)}
                className="mt-1 w-3.5 h-3.5 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/40"
              />
              <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-relaxed">
                <Shield size={12} className="inline text-indigo-400 mb-0.5 mr-1" />
                He leído y acepto las condiciones de uso, el tratamiento de mis datos y las limitaciones de responsabilidad descritas.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={b}
                onChange={e => setB(e.target.checked)}
                className="mt-1 w-3.5 h-3.5 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/40"
              />
              <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-relaxed">
                <Sparkles size={12} className="inline text-amber-400/90 mb-0.5 mr-1" />
                Reconozco que las salidas de IA requieren revisión profesional y entiendo el rol de PulsoAI como proveedor de tecnología.
              </span>
            </label>
          </div>

          <motion.button
            type="button"
            disabled={!ok}
            onClick={onAccept}
            whileHover={ok ? { scale: 1.01 } : {}}
            whileTap={ok ? { scale: 0.99 } : {}}
            className="w-full py-3.5 rounded-2xl text-sm font-black text-white disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              background: ok
                ? 'linear-gradient(135deg,#0e7490,#1d4ed8,#4f46e5)'
                : 'rgba(51,65,85,0.5)',
              boxShadow: ok ? '0 8px 32px rgba(14,116,199,0.35)' : 'none',
            }}
          >
            {ok ? 'Acepto y continuar a LEXARA PRO' : 'Marque las dos casillas para continuar'}
          </motion.button>

          <p className="text-[9px] text-center text-slate-600 leading-relaxed">
            Motor de inteligencia artificial: <span className="text-slate-500 font-semibold">PulsoAI</span>
            <span className="mx-1.5">·</span>
            Cumplimiento y evolución normativa sujetos a versión (ref. {LEGAL_ACCEPT_VERSION}).
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function PulsoBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <motion.div
        className="absolute left-1/2 top-1/3 w-[min(100vw,900px)] h-[min(100vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: 'conic-gradient(from 180deg at 50% 50%,#0ea5e9,transparent 40%,#4f46e5 60%,#22d3ee)' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%,rgba(14,165,233,0.15),transparent 70%)',
        }}
      />
    </div>
  )
}

export function isLegalAcceptanceValid(): boolean {
  try {
    return localStorage.getItem(LEGAL_ACCEPT_STORAGE_KEY) === LEGAL_ACCEPT_VERSION
  } catch {
    return false
  }
}

export function setLegalAcceptance() {
  try {
    localStorage.setItem(LEGAL_ACCEPT_STORAGE_KEY, LEGAL_ACCEPT_VERSION)
  } catch {
    /* ignore */
  }
}
