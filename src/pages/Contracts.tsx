import { motion } from 'framer-motion'
import { FileText, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react'
import { RiskBadge } from '../components/ui'

const contracts = [
  { name: 'Contrato_Suministro_TechCorp.pdf', type: 'Suministro Comercial', risk: 'critical' as const, issues: 5, date: '01/03/2024', parties: 'TechCorp Chile · Importadora Los Andes' },
  { name: 'Servicios_IT_DataSolutions.docx', type: 'Prestación de Servicios', risk: 'high' as const, issues: 3, date: '28/02/2024', parties: 'DataSolutions · Retail Corp' },
  { name: 'Arrendamiento_Oficinas_2024.pdf', type: 'Arrendamiento', risk: 'medium' as const, issues: 2, date: '25/02/2024', parties: 'Inmobiliaria Norte · Oficinas Centro' },
  { name: 'Distribución_Alimentos_Sur.pdf', type: 'Distribución', risk: 'high' as const, issues: 4, date: '22/02/2024', parties: 'Alimentos Sur · Distribuidora XYZ' },
  { name: 'Franquicia_RestaurantChain.docx', type: 'Franquicia', risk: 'critical' as const, issues: 6, date: '20/02/2024', parties: 'FoodChain SA · Franquiciatario' },
  { name: 'Mutuo_Financiero_ABC.pdf', type: 'Mutuo / Crédito', risk: 'low' as const, issues: 1, date: '18/02/2024', parties: 'Banco Local · Empresa ABC' },
]

export default function Contracts() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Mis Contratos</h1>
          <p className="text-sm text-slate-400 mt-1">Historial de contratos analizados</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input placeholder="Buscar contrato..."
            className="pl-9 pr-4 py-2 rounded-xl text-sm text-slate-300 placeholder-slate-600 outline-none"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.15)', width: '220px' }} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-3">
        {contracts.map((contract, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <FileText size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white truncate">{contract.name}</span>
                <RiskBadge level={contract.risk} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{contract.type} · {contract.parties}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 text-right">
              <div>
                <div className="flex items-center gap-1 text-xs">
                  {contract.issues > 0 ? (
                    <><AlertTriangle size={11} className="text-orange-400" /><span className="text-slate-400">{contract.issues} problemas</span></>
                  ) : (
                    <><CheckCircle size={11} className="text-green-400" /><span className="text-slate-400">Sin problemas</span></>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-600">
                  <Clock size={10} />
                  {contract.date}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
