import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  color: string
  delay?: number
}

export function StatCard({ title, value, subtitle, icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl p-3.5 relative overflow-hidden"
      style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl"
        style={{ background: color, transform: 'translate(30%,-30%)' }}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">{title}</p>
          <p className="text-2xl font-black text-white leading-none">{value}</p>
          {subtitle && <p className="text-[10px] text-slate-500 mt-1 truncate">{subtitle}</p>}
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  )
}

interface RiskBadgeProps {
  level: 'critical' | 'high' | 'medium' | 'low' | 'ok'
  label?: string
  size?: 'sm' | 'md'
}

const RISK_CONFIG = {
  critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', text: '#ef4444', label: 'Crítico' },
  high:     { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)', text: '#f97316', label: 'Alto' },
  medium:   { bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.4)',  text: '#eab308', label: 'Medio' },
  low:      { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  text: '#22c55e', label: 'Bajo' },
  ok:       { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#3b82f6', label: 'Conforme' },
}

export function RiskBadge({ level, label, size = 'md' }: RiskBadgeProps) {
  const config = RISK_CONFIG[level]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
      style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.text }} />
      {label || config.label}
    </span>
  )
}

interface RiskMeterProps {
  score: number
}

export function RiskMeter({ score }: RiskMeterProps) {
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 25 ? '#eab308' : '#22c55e'
  const r = 36
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="none" />
        <circle
          cx="48" cy="48" r={r}
          stroke={color} strokeWidth="7" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <div className="text-center">
        <span className="text-xl font-black" style={{ color }}>{score}</span>
        <span className="block text-[10px] text-slate-500">Riesgo</span>
      </div>
    </div>
  )
}
