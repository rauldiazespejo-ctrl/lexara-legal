import { useId } from 'react'
import { motion } from 'framer-motion'

/** Fondo sutil "Pulso" — malla, anillos y resplandor; pointer-events: none. */
export function PulsoBackgroundLayer({ intensity = 1 }: { intensity?: number }) {
  const gridId = useId().replace(/:/g, '')
  const o = (n: number) => n * intensity
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <motion.div
        className="absolute left-1/2 top-[20%] w-[min(120vmax,900px)] h-[min(120vmax,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%,rgba(14,165,233,0.25),transparent 30%,rgba(99,102,241,0.2) 55%,rgba(6,182,212,0.2) 75%,transparent)',
          opacity: o(0.35),
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: o(0.45),
          background: `
            radial-gradient(ellipse 100% 50% at 0% 0%, rgba(29,78,216,${0.1 * intensity}), transparent 50%),
            radial-gradient(ellipse 80% 40% at 100% 30%, rgba(124,58,237,${0.08 * intensity}), transparent 45%),
            radial-gradient(ellipse 60% 35% at 50% 100%, rgba(6,182,212,${0.12 * intensity}), transparent 50%)
          `,
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={gridId} width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgb(100, 180, 255)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
      <motion.div
        className="absolute left-1/2 top-1/2 w-[40vmax] h-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          border: `1px solid rgba(6,182,212,${0.12 * intensity})`,
          boxShadow: `inset 0 0 60px rgba(14,165,233,${0.05 * intensity})`,
        }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 w-[min(60vmax,700px)] h-[min(60vmax,700px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ border: `1px solid rgba(99,102,241,${0.08 * intensity})` }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
