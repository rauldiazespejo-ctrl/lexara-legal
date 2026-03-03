// @ts-nocheck
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, ChevronDown, ChevronUp, BookOpen,
  Wrench, Shield, ExternalLink, Scale, CheckCircle
} from 'lucide-react'
import { RiskBadge, RiskMeter } from './ui'
import type { Clause, ContractAnalysis } from '../types'
import { ISSUE_TYPE_LABELS } from '../data/legalDatabase'

interface ClauseCardProps {
  clause: Clause
  index: number
}

function ClauseCard({ clause, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'issues' | 'remediation' | 'refs'>('issues')

  const hasIssues = clause.issues.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${hasIssues ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.12)'}`, background: 'rgba(15,23,42,0.8)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <RiskBadge level={clause.riskLevel} size="sm" />
            <span className="text-sm font-semibold text-white">{clause.title}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate pr-4">{clause.content.substring(0, 100)}...</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {clause.issues.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle size={11} />
              {clause.issues.length} {clause.issues.length === 1 ? 'problema' : 'problemas'}
            </span>
          )}
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5">
              <div className="p-4 rounded-xl mx-4 my-3 text-xs text-slate-400 leading-relaxed italic"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                "{clause.content}"
              </div>

              {hasIssues && (
                <>
                  <div className="flex gap-1 px-4 mb-4">
                    {[
                      { key: 'issues', label: 'Problemas', icon: AlertTriangle },
                      { key: 'remediation', label: 'Subsanación', icon: Wrench },
                      { key: 'refs', label: 'Referencias', icon: BookOpen },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key as typeof activeTab)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeTab === key
                            ? 'text-white'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        style={activeTab === key ? { background: 'linear-gradient(135deg, rgba(29,78,216,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(99,102,241,0.3)' } : {}}
                      >
                        <Icon size={12} />
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pb-4">
                    {activeTab === 'issues' && (
                      <div className="space-y-3">
                        {clause.issues.map((issue) => (
                          <div key={issue.id} className="p-3 rounded-xl"
                            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-xs font-semibold text-red-400">{ISSUE_TYPE_LABELS[issue.type] || issue.type}</span>
                                  <RiskBadge level={issue.severity} size="sm" />
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>
                                {issue.articleViolated && (
                                  <p className="text-xs text-orange-400 mt-1.5 font-medium">
                                    Artículo infringido: {issue.articleViolated}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'remediation' && clause.remediation && (
                      <div className="p-4 rounded-xl"
                        style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench size={13} className="text-green-400" />
                          <span className="text-xs font-semibold text-green-400">Recomendación de Subsanación</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{clause.remediation}</p>
                      </div>
                    )}

                    {activeTab === 'refs' && (
                      <div className="space-y-2">
                        {clause.legalReferences.map((ref) => (
                          <div key={ref.id} className="p-3 rounded-xl flex items-start gap-3"
                            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                            <Scale size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-blue-400">{ref.article}</span>
                                <span className="text-xs text-slate-500">{ref.law}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{ref.description}</p>
                            </div>
                            <ExternalLink size={12} className="text-slate-600 flex-shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {!hasIssues && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl text-xs text-green-400"
                    style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <CheckCircle size={13} />
                    Cláusula conforme con la normativa chilena vigente
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface AnalysisResultsProps {
  analysis: ContractAnalysis
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const criticalCount = analysis.clauses.filter(c => c.riskLevel === 'critical').length
  const highCount = analysis.clauses.filter(c => c.riskLevel === 'high').length
  const okCount = analysis.clauses.filter(c => c.riskLevel === 'ok' || c.riskLevel === 'low').length

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <RiskMeter score={analysis.overallRisk} />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-lg font-black text-white">{analysis.fileName}</h2>
              <RiskBadge level={analysis.riskLevel} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{analysis.summary}</p>
            <div className="flex gap-4 flex-wrap text-xs">
              {[
                { label: 'Cláusulas críticas', value: criticalCount, color: '#ef4444' },
                { label: 'Riesgo alto', value: highCount, color: '#f97316' },
                { label: 'Conformes', value: okCount, color: '#22c55e' },
                { label: 'Total cláusulas', value: analysis.clauses.length, color: '#3b82f6' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-lg font-black" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <p className="text-xs font-semibold text-slate-400 mb-1">Cumplimiento Legal</p>
            {analysis.chileanLawCompliance.laws.slice(0, 4).map((law) => (
              <div key={law.name} className="flex items-center gap-2 text-xs">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${law.compliant ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-400 truncate">{law.name.split(' – ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {!analysis.arbitrationCompliance.compliantWithCAC && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4"
          style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.25)' }}>
          <div className="flex items-start gap-3">
            <Scale size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-400 mb-1">Cláusula Arbitral Incompleta</p>
              <p className="text-xs text-slate-400 mb-2">La cláusula arbitral no cumple con los requisitos del Reglamento CAC/CEAC ni del COT Art. 222.</p>
              <div className="p-3 rounded-xl text-xs text-slate-300 leading-relaxed italic"
                style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.15)' }}>
                <strong className="text-yellow-400 not-italic">Cláusula modelo sugerida: </strong>
                {analysis.arbitrationCompliance.recommendation}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Análisis de Cláusulas ({analysis.clauses.length})</h3>
          <div className="flex gap-2 text-xs">
            {[
              { label: 'Crítico', color: '#ef4444', count: criticalCount },
              { label: 'Alto', color: '#f97316', count: highCount },
            ].map(item => item.count > 0 && (
              <span key={item.label} className="px-2 py-0.5 rounded-full" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
                {item.count} {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {analysis.clauses.map((clause, i) => (
            <ClauseCard key={clause.id} clause={clause} index={i} />
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={15} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white">Recomendaciones Generales</h3>
        </div>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}>
                {i + 1}
              </span>
              {rec}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

