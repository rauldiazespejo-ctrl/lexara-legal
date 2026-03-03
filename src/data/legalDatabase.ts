// @ts-nocheck
import type { LegalReference, ContractType } from '../types'

export const CHILEAN_LEGAL_REFERENCES: LegalReference[] = [
  {
    id: 'cc-1545',
    law: 'Código Civil',
    article: 'Art. 1545',
    description: 'Todo contrato legalmente celebrado es una ley para los contratantes. Solo puede ser invalidado por su consentimiento mutuo o causas legales.',
  },
  {
    id: 'cc-1546',
    law: 'Código Civil',
    article: 'Art. 1546',
    description: 'Los contratos deben ejecutarse de buena fe y obligan no solo a lo que expresa sino a todo lo que la ley, la costumbre o la equidad añaden.',
  },
  {
    id: 'cc-1560',
    law: 'Código Civil',
    article: 'Art. 1560',
    description: 'Regla de interpretación: prevalece la intención de los contratantes sobre lo literal de las palabras.',
  },
  {
    id: 'cc-1562',
    law: 'Código Civil',
    article: 'Art. 1562',
    description: 'El sentido en que una cláusula produzca algún efecto debe preferirse al que no produzca ninguno.',
  },
  {
    id: 'cc-1566',
    law: 'Código Civil',
    article: 'Art. 1566',
    description: 'Las cláusulas ambiguas se interpretan contra quien las redactó (principio contra proferentem).',
  },
  {
    id: 'lpdc-16',
    law: 'Ley 19.496 - Protección al Consumidor',
    article: 'Art. 16',
    description: 'No producirán efecto las cláusulas que otorguen a una sola parte facultad de dejar sin efecto o modificar a su solo arbitrio el contrato.',
  },
  {
    id: 'lpdc-16a',
    law: 'Ley 19.496 - Protección al Consumidor',
    article: 'Art. 16 A',
    description: 'Prohíbe cláusulas que limiten la responsabilidad del proveedor por daños o que impongan cargas excesivas al consumidor.',
  },
  {
    id: 'ccio-131',
    law: 'Código de Comercio',
    article: 'Art. 131',
    description: 'Las palabras de doble sentido en contratos comerciales se entienden en el sentido más conforme a la naturaleza del contrato.',
  },
  {
    id: 'cac-1',
    law: 'Reglamento CAC - Centro de Arbitraje Comercial',
    article: 'Art. 1-5',
    description: 'El acuerdo de arbitraje debe designar el centro arbitral, número de árbitros, sede y normas procedimentales aplicables.',
  },
  {
    id: 'ceac-1',
    law: 'Reglamento CEAC',
    article: 'Art. 1-8',
    description: 'La cláusula arbitral debe indicar el reglamento aplicable, idioma del procedimiento y ley de fondo del contrato.',
  },
  {
    id: 'laj-1',
    law: 'Ley de Arbitraje (COT Art. 222-243)',
    article: 'Art. 222',
    description: 'Las partes pueden someter sus controversias presentes o futuras a decisión arbitral, designando árbitros de derecho, arbitradores o mixtos.',
  },
  {
    id: 'cc-1547',
    law: 'Código Civil',
    article: 'Art. 1547',
    description: 'La responsabilidad por culpa grave equivale al dolo. Las cláusulas que exoneran de culpa grave o dolo son nulas.',
  },
  {
    id: 'cc-1489',
    law: 'Código Civil',
    article: 'Art. 1489',
    description: 'En contratos bilaterales va envuelta la condición resolutoria tácita. La parte incumplidora no puede imponer condiciones abusivas de terminación.',
  },
  {
    id: 'cc-1535',
    law: 'Código Civil',
    article: 'Art. 1535-1544',
    description: 'La cláusula penal no puede exceder el beneficio que el acreedor reportaría del cumplimiento íntegro del contrato (pena enorme).',
  },
  {
    id: 'lsc-4',
    law: 'Ley 20.416 - Estatuto PYME',
    article: 'Art. 4',
    description: 'En contratos de adhesión con PYME se prohíben cláusulas abusivas. El SERNAC y los tribunales pueden declararlas nulas.',
  },
]

export const CONTRACT_TYPES: Record<ContractType, string> = {
  commercial_supply: 'Contrato de Suministro Comercial',
  services: 'Contrato de Prestación de Servicios',
  lease: 'Contrato de Arrendamiento',
  employment: 'Contrato de Trabajo',
  franchise: 'Contrato de Franquicia',
  distribution: 'Contrato de Distribución',
  partnership: 'Contrato de Asociación',
  loan: 'Contrato de Mutuo / Crédito',
  construction: 'Contrato de Construcción',
  technology: 'Contrato de Tecnología / Software',
  general: 'Contrato General',
}

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  abusive_clause: 'Cláusula Abusiva',
  illegal_clause: 'Cláusula Ilegal',
  ambiguous_language: 'Lenguaje Ambiguo',
  missing_mandatory: 'Elemento Obligatorio Faltante',
  disproportionate_penalty: 'Pena Desproporcionada',
  unilateral_modification: 'Modificación Unilateral',
  unfair_termination: 'Terminación Injusta',
  excessive_liability_exclusion: 'Exclusión Excesiva de Responsabilidad',
  arbitration_violation: 'Infracción Reglamento Arbitraje',
}

export const RISK_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  ok: '#3b82f6',
}

export const RISK_LABELS = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
  ok: 'Conforme',
}

