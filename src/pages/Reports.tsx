import { motion } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts'
import { Download, FileText, TrendingDown, AlertTriangle } from 'lucide-react'

const complianceData = [
  { subject: 'Cód. Civil', A: 60, fullMark: 100 },
  { subject: 'LPDC', A: 40, fullMark: 100 },
  { subject: 'Cód. Comercio', A: 85, fullMark: 100 },
  { subject: 'Arbitraje', A: 55, fullMark: 100 },
  { subject: 'Ley 18.010', A: 50, fullMark: 100 },
  { subject: 'PYME', A: 90, fullMark: 100 },
]

const issueFrequency = [
  { name: 'Terminación\nUnilateral', count: 8, color: '#ef4444' },
  { name: 'Excl.\nResponsab.', count: 6, color: '#f97316' },
  { name: 'Pena\nEnorme', count: 5, color: '#eab308' },
  { name: 'Arbitraje\nIncompl.', count: 7, color: '#8b5cf6' },
  { name: 'Modif.\nUnilateral', count: 9, color: '#ec4899' },
  { name: 'Lenguaje\nAmbiguo', count: 12, color: '#06b6d4' },
]

const recentContracts = [
  { name: 'Contrato_Suministro_TechCorp.pdf', risk: 78, level: 'critical', issues: 5, date: '01/03/2024' },
  { name: 'Servicios_IT_DataSolutions.docx', risk: 52, level: 'high', issues: 3, date: '28/02/2024' },
  { name: 'Arrendamiento_Oficinas_2024.pdf', risk: 35, level: 'medium', issues: 2, date: '25/02/2024' },
  { name: 'Distribución_Alimentos_Sur.pdf', risk: 68, level: 'high', issues: 4, date: '22/02/2024' },
  { name: 'Franquicia_RestaurantChain.docx', risk: 82, level: 'critical', issues: 6, date: '20/02/2024' },
]

const LEVEL_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', label: 'Crítico' },
  high: { bg: 'rgba(249,115,22,0.12)', text: '#f97316', label: 'Alto' },
  medium: { bg: 'rgba(234,179,8,0.12)', text: '#eab308', label: 'Medio' },
  low: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', label: 'Bajo' },
}

export default function Reports() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Reportes y Análisis</h1>
          <p className="text-sm text-slate-400 mt-1">Visión consolidada del portafolio de contratos</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>
          <Download size={15} />
          Exportar Reporte
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Radar de Cumplimiento Legal</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={complianceData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar name="Cumplimiento" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 text-center">Promedio del portafolio vs. normativa chilena</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Frecuencia de Infracciones</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={issueFrequency} margin={{ top: 0, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', fontSize: 11 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Ocurrencias">
                {issueFrequency.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-300">Contratos Recientes</h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <TrendingDown size={12} className="text-red-400" />
            <span>Ordenados por nivel de riesgo</span>
          </div>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {recentContracts.map((contract, i) => {
            const config = LEVEL_CONFIG[contract.level]
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: config.bg, border: `1px solid ${config.text}25` }}>
                  <FileText size={16} style={{ color: config.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{contract.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{contract.date} · {contract.issues} problemas detectados</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black mb-0.5" style={{ color: config.text }}>{contract.risk}</div>
                  <div className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: config.bg, color: config.text, border: `1px solid ${config.text}30` }}>
                    {config.label}
                  </div>
                </div>
                <AlertTriangle size={14} style={{ color: config.text }} className="flex-shrink-0" />
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
