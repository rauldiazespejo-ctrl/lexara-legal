import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ContractUploader from '../components/ContractUploader'
import AnalysisResults from '../components/AnalysisResults'
import { DEMO_ANALYSIS } from '../data/sampleData'

export default function Analysis() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}>
        <Routes>
          <Route index element={<ContractUploader onAnalysisComplete={() => {}} />} />
          <Route path="resultado" element={<AnalysisResults analysis={DEMO_ANALYSIS} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
