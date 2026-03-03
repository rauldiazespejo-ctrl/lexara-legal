import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, File, X, AlertTriangle, Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
  'application/rtf': ['.rtf'],
}

const STEPS = [
  'Parseando documento...',
  'Identificando cláusulas...',
  'Verificando legislación chilena...',
  'Analizando riesgos...',
  'Generando recomendaciones...',
  'Finalizando reporte...',
]

interface ContractUploaderProps {
  onAnalysisComplete: () => void
}

export default function ContractUploader({ onAnalysisComplete }: ContractUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onDrop = useCallback((accepted: File[]) => {
    setError(null)
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDropRejected: () => setError('Archivo no válido. Use PDF, DOCX, DOC o TXT (máx. 20MB).'),
  })

  const runAnalysis = async () => {
    if (!file) return
    setAnalyzing(true)
    setProgress(0)
    setCurrentStep(0)

    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700 + Math.random() * 400))
      setCurrentStep(i)
      setProgress(Math.round(((i + 1) / STEPS.length) * 100))
    }

    await new Promise(r => setTimeout(r, 500))
    setAnalyzing(false)
    onAnalysisComplete()
    navigate('/analisis/resultado')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Analizar Contrato</h1>
        <p className="text-sm text-slate-400 mt-1">
          Detecta cláusulas abusivas, riesgos e infracciones a la normativa chilena vigente
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!analyzing ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div
              {...getRootProps()}
              className={`rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'scale-[1.01]' : ''
              }`}
              style={{
                background: isDragActive
                  ? 'rgba(29,78,216,0.15)'
                  : 'rgba(15,23,42,0.8)',
                border: isDragActive
                  ? '2px dashed rgba(99,102,241,0.7)'
                  : '2px dashed rgba(59,130,246,0.2)',
              }}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.3), rgba(124,58,237,0.3))', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  <Upload size={28} className="text-blue-400" />
                </motion.div>
                <div>
                  <p className="text-base font-semibold text-slate-200">
                    {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra tu contrato aquí'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">o haz clic para seleccionar</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {['PDF', 'DOCX', 'DOC', 'TXT', 'RTF'].map(f => (
                    <span key={f} className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-600">Tamaño máximo: 20 MB</p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 p-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertTriangle size={14} />
                {error}
              </motion.div>
            )}

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-4 rounded-2xl p-4 flex items-center gap-4"
                  style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                    {file.name.endsWith('.pdf') ? <FileText size={20} className="text-red-400" /> : <File size={20} className="text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatSize(file.size)} · {file.type || 'Documento'}</p>
                  </div>
                  <button onClick={() => setFile(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: '⚖️', title: 'Derecho Civil', desc: 'Código Civil · Art. 1545-1566' },
                { icon: '🛡️', title: 'LPDC', desc: 'Ley 19.496 · Cláusulas abusivas' },
                { icon: '🏛️', title: 'Arbitraje', desc: 'CAC · CEAC · COT Art. 222' },
              ].map(item => (
                <div key={item.title} className="p-3 rounded-xl text-center"
                  style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-slate-300">{item.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>

            <motion.button
              onClick={runAnalysis}
              disabled={!file}
              whileHover={file ? { scale: 1.02 } : {}}
              whileTap={file ? { scale: 0.98 } : {}}
              className="mt-6 w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: file ? 'linear-gradient(135deg, #1d4ed8, #7c3aed)' : 'rgba(255,255,255,0.05)',
                opacity: file ? 1 : 0.5,
                cursor: file ? 'pointer' : 'not-allowed',
              }}
            >
              <CheckCircle size={16} />
              Iniciar Análisis Legal
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-8 text-center"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <svg className="absolute inset-0 -rotate-90" width="80" height="80">
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="32" stroke="#6366f1" strokeWidth="6" fill="none"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - progress / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease', filter: 'drop-shadow(0 0 8px #6366f1)' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={24} className="text-purple-400 animate-spin" />
                </div>
              </div>
            </div>
            <p className="text-lg font-bold text-white mb-1">Analizando contrato...</p>
            <p className="text-sm text-blue-400 font-medium mb-4">{STEPS[currentStep]}</p>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', width: `${progress}%` }}
                transition={{ duration: 0.5 }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">{progress}% completado</p>
            <div className="mt-5 space-y-2">
              {STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs transition-all ${i <= currentStep ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    i < currentStep ? 'bg-green-500/20 text-green-400' :
                    i === currentStep ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-600'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
