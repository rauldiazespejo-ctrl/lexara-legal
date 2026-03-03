// @ts-nocheck
import type { LegalReference, ContractType } from '../types'

export const CHILEAN_LEGAL_REFERENCES: LegalReference[] = [
  // ── CÓDIGO CIVIL ─────────────────────────────────────────────────────────
  {
    id: 'cc-1545',
    law: 'Código Civil',
    article: 'Art. 1545',
    description: 'Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o por causas legales.',
  },
  {
    id: 'cc-1546',
    law: 'Código Civil',
    article: 'Art. 1546',
    description: 'Los contratos deben ejecutarse de buena fe, y por consiguiente obligan no sólo a lo que en ellos se expresa, sino a todas las cosas que emanan precisamente de la naturaleza de la obligación, o que por la ley o la costumbre pertenecen a ella.',
  },
  {
    id: 'cc-1547',
    law: 'Código Civil',
    article: 'Art. 1547',
    description: 'El deudor no es responsable sino de la culpa lata en los contratos que por su naturaleza sólo son útiles al acreedor; es responsable de la leve en los contratos que se hacen para beneficio recíproco de las partes; y de la levísima, en los contratos en que el deudor es el único que reporta beneficio. La prueba de la diligencia o cuidado incumbe al que ha debido emplearlo.',
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
    id: 'cc-1563',
    law: 'Código Civil',
    article: 'Art. 1563',
    description: 'En aquellos casos en que no apareciere voluntad contraria, deberá estarse a la interpretación que mejor cuadre con la naturaleza del contrato. Las cláusulas de uso común se presumen aunque no se expresen.',
  },
  {
    id: 'cc-1564',
    law: 'Código Civil',
    article: 'Art. 1564',
    description: 'Las cláusulas de un contrato se interpretarán unas por otras, dándose a cada una el sentido que mejor convenga al contrato en su totalidad. Podrán también interpretarse por las de otro contrato entre las mismas partes y sobre la misma materia.',
  },
  {
    id: 'cc-1566',
    law: 'Código Civil',
    article: 'Art. 1566',
    description: 'Las cláusulas ambiguas que hayan sido extendidas o dictadas por una de las partes se interpretarán contra ella (principio contra proferentem), siempre que la ambigüedad provenga de la falta de una explicación que haya debido darse por ella.',
  },
  {
    id: 'cc-1489',
    law: 'Código Civil',
    article: 'Art. 1489',
    description: 'En contratos bilaterales va envuelta la condición resolutoria tácita de no cumplirse por uno de los contratantes lo pactado. La parte incumplidora no puede imponer condiciones abusivas de terminación.',
  },
  {
    id: 'cc-1535-1544',
    law: 'Código Civil',
    article: 'Arts. 1535–1544 (Cláusula Penal)',
    description: 'La cláusula penal es aquella en que una persona, para asegurar el cumplimiento de una obligación, se sujeta a una pena. La pena no puede exceder el duplo de la obligación principal (pena enorme). En contratos de mutuo, no puede exceder el máximo de interés permitido.',
  },
  {
    id: 'cc-1465',
    law: 'Código Civil',
    article: 'Art. 1465',
    description: 'La condonación del dolo futuro no vale. Las cláusulas que excluyen la responsabilidad por dolo o culpa grave son nulas de pleno derecho.',
  },
  {
    id: 'cc-1441',
    law: 'Código Civil',
    article: 'Art. 1441 (Contrato oneroso — conmutativo vs aleatorio)',
    description: 'El contrato oneroso es conmutativo cuando cada una de las partes se obliga a dar o hacer una cosa que se mira como equivalente a lo que la otra parte debe dar o hacer. Si el equivalente consiste en una contingencia incierta de ganancia o pérdida, se llama aleatorio.',
  },
  {
    id: 'cc-1461',
    law: 'Código Civil',
    article: 'Art. 1461 (Objeto del contrato)',
    description: 'No sólo las cosas que existen pueden ser objetos de una declaración de voluntad, sino las que se espera que existan; pero es menester que las unas y las otras sean comerciables, y que estén determinadas, a lo menos, en cuanto a su género.',
  },
  {
    id: 'cc-1681',
    law: 'Código Civil',
    article: 'Art. 1681–1683 (Nulidad absoluta)',
    description: 'Es nulo todo acto o contrato a que falta alguno de los requisitos que la ley prescribe para su valor. La nulidad absoluta puede ser declarada de oficio por el juez, puede ser alegada por todo el que tenga interés y no puede sanearse por ratificación.',
  },
  {
    id: 'cc-1684',
    law: 'Código Civil',
    article: 'Art. 1684–1697 (Nulidad relativa)',
    description: 'La nulidad relativa es la que sólo compete a ciertas personas. Puede rescindirse el acto o contrato a que falta algún requisito que la ley exige en consideración al estado o calidad de las personas. Puede sanearse por el transcurso del tiempo (4 años).',
  },
  // ── PROTECCIÓN AL CONSUMIDOR ──────────────────────────────────────────────
  {
    id: 'lpdc-1',
    law: 'Ley 19.496 – Protección al Consumidor',
    article: 'Art. 1 N°6 (Contrato de adhesión)',
    description: 'Aquel cuyas cláusulas han sido propuestas unilateralmente por el proveedor sin que el consumidor, para celebrarlo, pueda alterar su contenido. Se aplica la regla de interpretación pro-consumidor.',
  },
  {
    id: 'lpdc-16',
    law: 'Ley 19.496 – Protección al Consumidor',
    article: 'Art. 16',
    description: 'No producirán efecto las cláusulas que: (a) otorguen a una parte facultad de modificar/terminar a su solo arbitrio; (b) establezcan incrementos de precio sin contraprestación; (c) pongan de cargo del consumidor errores administrativos del proveedor; (d) inviertan la carga de la prueba; (e) contengan limitaciones absolutas de responsabilidad.',
  },
  {
    id: 'lpdc-16a',
    law: 'Ley 19.496 – Protección al Consumidor',
    article: 'Art. 16 A',
    description: 'Declarada la nulidad de cláusulas abusivas, el contrato subsistirá con las restantes, salvo que por la naturaleza del contrato ello no fuere posible. Nulidad de pleno derecho, no requiere declaración judicial previa.',
  },
  {
    id: 'lpdc-3',
    law: 'Ley 19.496 – Protección al Consumidor',
    article: 'Art. 3 (Derechos del consumidor)',
    description: 'Son derechos básicos del consumidor: (a) libre elección; (b) información veraz y oportuna; (c) no ser discriminado; (d) seguridad en el consumo; (e) derecho a la educación; (f) derecho a ser oído; (g) derecho a la reparación e indemnización.',
  },
  {
    id: 'lpdc-3bis',
    law: 'Ley 19.496 – Protección al Consumidor',
    article: 'Art. 3 bis (Derecho a retracto)',
    description: 'En contratos celebrados por medios electrónicos o a distancia, el consumidor tendrá el derecho de retractarse en el plazo de 10 días contados desde la recepción del producto o desde la contratación del servicio.',
  },
  {
    id: 'lpdc-50b',
    law: 'Ley 19.496 – Protección al Consumidor',
    article: 'Art. 50 B (Acciones colectivas)',
    description: 'Cuando la infracción afecte a un número determinado o determinable de consumidores, las asociaciones de consumidores, el SERNAC o el Ministerio Público pueden interponer acciones colectivas de interés difuso.',
  },
  // ── CÓDIGO DE COMERCIO ────────────────────────────────────────────────────
  {
    id: 'ccio-1',
    law: 'Código de Comercio',
    article: 'Art. 1 (Actos de comercio)',
    description: 'Son actos de comercio los que la ley designa como tales. Si un acto es comercial para una parte y civil para la otra, se rige por la ley comercial. Las controversias entre comerciantes sobre sus negocios se sujetan a los tribunales competentes.',
  },
  {
    id: 'ccio-96-105',
    law: 'Código de Comercio',
    article: 'Arts. 96–105 (Formación del consentimiento)',
    description: 'La propuesta y aceptación forman el consentimiento. La aceptación tardía o con modificaciones equivale a una nueva propuesta. El silencio no constituye aceptación, salvo que las partes lo hubiesen pactado expresamente.',
  },
  {
    id: 'ccio-131',
    law: 'Código de Comercio',
    article: 'Art. 131',
    description: 'Las palabras de doble sentido en contratos comerciales se entienden en el sentido más conforme a la naturaleza del contrato. Las cláusulas ambiguas se interpretan contra quien las redactó.',
  },
  {
    id: 'ccio-160',
    law: 'Código de Comercio',
    article: 'Art. 160 (Mora)',
    description: 'En los contratos bilaterales el deudor no está en mora si el acreedor no cumple lo que a él corresponde, o no se allana a cumplir en el modo y tiempo convenidos. La excepción de contrato no cumplido es oponible.',
  },
  {
    id: 'ccio-785',
    law: 'Código de Comercio',
    article: 'Arts. 785–788 (Sociedad de responsabilidad limitada)',
    description: 'En la sociedad de responsabilidad limitada los socios solo responden hasta el monto de sus aportes. El estatuto social puede establecer responsabilidad adicional, pero nunca superior al doble del aporte.',
  },
  // ── ARBITRAJE ──────────────────────────────────────────────────────────────
  {
    id: 'cot-222',
    law: 'COT – Código Orgánico de Tribunales',
    article: 'Art. 222 (Arbitraje)',
    description: 'Se llaman árbitros los jueces nombrados por las partes, o por la autoridad judicial en subsidio, para la resolución de un asunto litigioso. Pueden someterse a arbitraje los negocios entre partes capaces de transigir.',
  },
  {
    id: 'cot-229',
    law: 'COT – Código Orgánico de Tribunales',
    article: 'Art. 229 (Materias no arbitrables)',
    description: 'No pueden ser sometidos a arbitraje los asuntos que afecten a menores de edad, materias penales, estado civil de las personas, ni los que de otra manera sean de orden público.',
  },
  {
    id: 'cot-234',
    law: 'COT – Código Orgánico de Tribunales',
    article: 'Art. 234 (Tipos de árbitros)',
    description: 'Los árbitros son de tres clases: árbitros de derecho (tramitan y fallan con arreglo a la ley), árbitros arbitradores o amigables componedores (fallan en conciencia) y árbitros mixtos (tramitan conforme a la ley pero fallan en conciencia).',
  },
  {
    id: 'cac-reglamento',
    law: 'Reglamento CAM Santiago (Centro de Arbitraje y Mediación)',
    article: 'Arts. 1–8 (Cláusula arbitral modelo)',
    description: 'Cláusula arbitral modelo CAM Santiago: "Toda controversia o reclamación que surja de o se relacione con este contrato será resuelta mediante arbitraje de derecho administrado por el Centro de Arbitraje y Mediación de Santiago, en conformidad con su Reglamento Procesal de Arbitraje." Incluir: número de árbitros, sede, idioma, ley aplicable.',
  },
  // ── ESTATUTO PYME ─────────────────────────────────────────────────────────
  {
    id: 'pyme-4',
    law: 'Ley 20.416 – Estatuto PYME',
    article: 'Art. 4 (Cláusulas abusivas en contratos con PYME)',
    description: 'En los contratos de adhesión suscritos entre proveedores y empresas de menor tamaño, se entenderán como no escritas las cláusulas abusivas. Se entiende por tal cláusula toda estipulación que cause un desequilibrio importante en los derechos y obligaciones en perjuicio de la empresa de menor tamaño.',
  },
  {
    id: 'pyme-4bis',
    law: 'Ley 20.416 – Estatuto PYME',
    article: 'Art. 4 bis (Pago oportuno)',
    description: 'Los contratos entre empresas deben establecer un plazo de pago no superior a 60 días corridos desde la emisión de la factura. Si no se pacta plazo, se entiende que es de 30 días. El incumplimiento genera derecho a intereses moratorios del 1,5% mensual.',
  },
  // ── DERECHO LABORAL ───────────────────────────────────────────────────────
  {
    id: 'ct-7',
    law: 'Código del Trabajo',
    article: 'Art. 7 (Contrato de trabajo)',
    description: 'Contrato individual de trabajo es una convención por la cual el empleador y el trabajador se obligan recíprocamente, éste a prestar servicios personales bajo dependencia y subordinación del primero, y aquél a pagar por estos servicios una remuneración determinada.',
  },
  {
    id: 'ct-10',
    law: 'Código del Trabajo',
    article: 'Art. 10 (Cláusulas mínimas)',
    description: 'El contrato de trabajo debe contener, a lo menos: (1) lugar y fecha del contrato; (2) individualización de las partes; (3) función o servicio; (4) monto, forma y período de pago de la remuneración; (5) duración y distribución de la jornada; (6) plazo del contrato; (7) otros pactos.',
  },
  {
    id: 'ct-160',
    law: 'Código del Trabajo',
    article: 'Art. 160 (Despido sin indemnización)',
    description: 'El contrato de trabajo termina sin derecho a indemnización alguna cuando el empleador le ponga término invocando causales de: conductas indebidas de carácter grave, negociaciones incompatibles, abandono de trabajo, actos contra la empresa, acoso laboral o sexual.',
  },
  {
    id: 'ct-163',
    law: 'Código del Trabajo',
    article: 'Art. 163 (Indemnización por años de servicio)',
    description: 'Si el contrato hubiere estado vigente un año o más y el empleador le pusiere término, el trabajador tendrá derecho a una indemnización equivalente a 30 días de la última remuneración mensual devengada por cada año de servicio y fracción superior a seis meses (máximo 11 años).',
  },
  {
    id: 'ct-171',
    law: 'Código del Trabajo',
    article: 'Art. 171 (Autodespido)',
    description: 'Si quien incurriere en las causales del Art. 160 fuere el empleador, el trabajador podrá poner término al contrato y recurrir a la Inspección o al tribunal correspondiente, para que éste ordene el pago de las indemnizaciones establecidas en los artículos 162, 163 y 164, aumentadas en 20 a 50%.',
  },
  // ── DERECHO PENAL ─────────────────────────────────────────────────────────
  {
    id: 'cp-1',
    law: 'Código Penal',
    article: 'Art. 1 (Principio de legalidad)',
    description: 'Es delito toda acción u omisión voluntaria penada por la ley. Las acciones u omisiones penadas por la ley se reputan siempre voluntarias, a no ser que conste lo contrario. El que cometiere delito será responsable de él.',
  },
  {
    id: 'cp-470',
    law: 'Código Penal',
    article: 'Arts. 467–470 (Estafas y defraudaciones)',
    description: 'El que defraudare a otro en la sustancia, calidad o cantidad de las cosas que le entregare en virtud de un título oneroso será castigado con presidio. Se considera estafa la celebración de contratos con ánimo de no cumplir, para obtener una contraprestación.',
  },
  {
    id: 'cp-197',
    law: 'Código Penal',
    article: 'Arts. 193–198 (Falsificación de instrumentos)',
    description: 'El empleado público que, abusando de su oficio, cometiere falsedad en documentos públicos será castigado. El particular que falsificare documentos privados en perjuicio de tercero incurre en presidio menor en su grado mínimo a medio.',
  },
  // ── DERECHO PROCESAL ──────────────────────────────────────────────────────
  {
    id: 'cpc-254',
    law: 'Código de Procedimiento Civil',
    article: 'Art. 254 (Requisitos de la demanda)',
    description: 'La demanda debe expresar: (1) designación del tribunal; (2) nombre, domicilio y profesión del demandante; (3) nombre, domicilio y profesión del demandado; (4) exposición clara de los hechos; (5) consideraciones de derecho; (6) enunciación precisa de los pedimentos.',
  },
  {
    id: 'cpc-258',
    law: 'Código de Procedimiento Civil',
    article: 'Art. 258–259 (Tabla de emplazamiento)',
    description: 'El término de emplazamiento para contestar la demanda ordinaria es de 15 días hábiles dentro del territorio jurisdiccional del tribunal. Si el demandado se encuentra en otro territorio, se aumenta según la tabla de emplazamiento (Art. 259 CPC). Si está fuera del país, el plazo se fija según distancia.',
  },
  {
    id: 'cpc-310',
    law: 'Código de Procedimiento Civil',
    article: 'Art. 310 (Excepciones anómalas)',
    description: 'Las excepciones de prescripción, cosa juzgada, transacción y pago efectivo de la deuda pueden oponerse en cualquier estado de la causa (excepciones anómalas), pero si se deducen después de la contestación, se tramitan como incidentes.',
  },
  {
    id: 'cpc-434',
    law: 'Código de Procedimiento Civil',
    article: 'Art. 434 (Título ejecutivo)',
    description: 'La ejecución puede pederse con título ejecutivo: (1) sentencia firme; (2) copia autorizada de escritura pública; (3) acta de avenimiento; (4) instrumento privado reconocido; (5) letra de cambio, pagaré, cheque; (6) confesión judicial; (7) cualquier título ejecutivo de creación legal.',
  },
  // ── DERECHO CIVIL ARRENDAMIENTO ───────────────────────────────────────────
  {
    id: 'la-1',
    law: 'Ley 18.101 – Arrendamiento de predios urbanos',
    article: 'Arts. 1–3 (Ámbito de aplicación)',
    description: 'La Ley 18.101 se aplica al arrendamiento de inmuebles urbanos, incluyendo viviendas, establecimientos comerciales y otros inmuebles situados en zonas urbanas. Se excluyen los inmuebles agrícolas y los predios rústicos.',
  },
  {
    id: 'la-10',
    law: 'Ley 18.101 – Arrendamiento de predios urbanos',
    article: 'Art. 10 (Desahucio)',
    description: 'En los contratos de arrendamiento de vivienda, el arrendador puede desahuciar al arrendatario con aviso de 2 meses (viviendas con renta hasta 4 UTM) o un mes por cada año del contrato, con un mínimo de 2 meses (rentas superiores). El arrendatario siempre puede desahuciar con 2 meses.',
  },
  {
    id: 'la-21',
    law: 'Ley 18.101 – Arrendamiento de predios urbanos',
    article: 'Art. 21 (Procedimiento sumario)',
    description: 'Las cuestiones suscitadas entre arrendadores y arrendatarios se someten al procedimiento sumario. El juez puede decretar la restitución inmediata si el arrendatario no paga la renta o incumple obligaciones esenciales.',
  },
  // ── DERECHO TRIBUTARIO ────────────────────────────────────────────────────
  {
    id: 'ct-10-trib',
    law: 'Código Tributario',
    article: 'Art. 10 (Plazos tributarios)',
    description: 'Los plazos de días que establece el Código Tributario son de días hábiles, salvo que expresamente se diga que son de días corridos. El Servicio de Impuestos Internos puede prorrogar los plazos legales para la presentación de declaraciones.',
  },
  {
    id: 'lir-20',
    law: 'Ley de Impuesto a la Renta (DL 824)',
    article: 'Art. 20 (Impuesto de Primera Categoría)',
    description: 'Se aplica impuesto de primera categoría (27% para grandes empresas; 25% con tasa 14% integrado para PYME) sobre las rentas provenientes del capital y de las empresas comerciales, industriales, mineras y otras.',
  },
  {
    id: 'liva-1',
    law: 'Ley de IVA (DL 825)',
    article: 'Art. 1 (Impuesto al Valor Agregado)',
    description: 'Se aplica un impuesto al valor agregado del 19% sobre las ventas y servicios. Son sujetos del impuesto las personas que realicen ventas o presten servicios de manera habitual y onerosa. La base imponible es el precio o valor de la operación.',
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

// ── Normativa organizada por especialidad (para módulos de especialidad) ────
export const NORMATIVA_POR_ESPECIALIDAD = {
  civil: {
    label: 'Derecho Civil',
    color: '#3b82f6',
    normas: [
      { titulo: 'Código Civil — Contratos', arts: ['Art. 1438 (Definición de contrato)', 'Art. 1440-1441 (Clasificación)', 'Art. 1445 (Requisitos de validez)', 'Art. 1461 (Objeto)', 'Art. 1462 (Causa)'], texto: 'El Código Civil regula la teoría general del contrato desde el Art. 1438. Son requisitos del contrato: (1) consentimiento libre de vicios; (2) capacidad de las partes; (3) objeto lícito y determinado; (4) causa lícita. La nulidad absoluta afecta los actos contrarios a la ley, al orden público o a las buenas costumbres.' },
      { titulo: 'Obligaciones — Cumplimiento e Incumplimiento', arts: ['Art. 1546 (Buena fe)', 'Art. 1551 (Mora)', 'Art. 1556 (Indemnización)', 'Art. 1557 (Lucro cesante)'], texto: 'La indemnización de perjuicios comprende el daño emergente y el lucro cesante. El deudor se constituye en mora mediante requerimiento judicial o extrajudicial. En contratos a plazo, la mora se produce por el vencimiento del plazo. La buena fe es un estándar objetivo de conducta que rige toda la ejecución contractual.' },
      { titulo: 'Responsabilidad Extracontractual', arts: ['Art. 2314 (Delito o cuasidelito)', 'Art. 2316 (Responsabilidad por terceros)', 'Art. 2320 (Responsabilidad de empleador)', 'Art. 2330 (Culpa de la víctima)'], texto: 'El que ha cometido un delito o cuasidelito que ha inferido daño a otro, es obligado a la indemnización (Art. 2314 CC). El empleador responde solidariamente por los daños causados por sus dependientes en el ejercicio de sus funciones. La culpa de la víctima puede reducir o eliminar la indemnización (Art. 2330).' },
    ],
  },
  comercial: {
    label: 'Derecho Comercial',
    color: '#8b5cf6',
    normas: [
      { titulo: 'Código de Comercio — Contratos Mercantiles', arts: ['Art. 1 (Actos de comercio)', 'Art. 96-105 (Formación del consentimiento)', 'Art. 131 (Interpretación)', 'Art. 160 (Mora comercial)'], texto: 'Son actos de comercio los que la ley designa como tales. La propuesta de contrato es irrevocable por 24 horas si el destinatario reside en la misma plaza. La aceptación con modificaciones equivale a una nueva propuesta. Los contratos comerciales deben ejecutarse con la diligencia de un buen hombre de negocios.' },
      { titulo: 'Ley 19.496 — Cláusulas Abusivas', arts: ['Art. 16 (Prohibición)', 'Art. 16A (Subsistencia del contrato)', 'Art. 3 bis (Retracto)'], texto: 'No producen efecto las cláusulas que: (a) otorguen a una parte facultad de terminar/modificar a su solo arbitrio; (b) impongan al consumidor responsabilidades por errores del proveedor; (c) inviertan la carga de la prueba; (d) excluyan totalmente la responsabilidad. Declarada la nulidad de cláusulas abusivas, el contrato subsiste.' },
      { titulo: 'Reglamento CAC/CAM — Arbitraje Comercial', arts: ['COT Art. 222-243', 'Reglamento CAM Santiago', 'Ley 19.971 (Arbitraje Comercial Internacional)'], texto: 'Los árbitros pueden ser de derecho, arbitradores o mixtos. La cláusula arbitral debe indicar: centro arbitral, número de árbitros, sede, idioma y ley aplicable. El laudo arbitral firme es equivalente a una sentencia judicial y se ejecuta ante los tribunales ordinarios. Para arbitrajes internacionales aplica la Ley 19.971 (UNCITRAL).' },
      { titulo: 'Ley 20.416 — Estatuto PYME', arts: ['Art. 4 (Cláusulas abusivas)', 'Art. 4 bis (Pago oportuno 60 días)'], texto: 'Las cláusulas abusivas en contratos con PYME se tienen por no escritas. Los pagos entre empresas no pueden exceder 60 días desde la factura. El incumplimiento genera interés del 1,5% mensual. El SERNAC puede fiscalizar y demandar colectivamente.' },
    ],
  },
  laboral: {
    label: 'Derecho Laboral',
    color: '#22c55e',
    normas: [
      { titulo: 'Código del Trabajo — Contrato Individual', arts: ['Art. 7 (Definición)', 'Art. 10 (Cláusulas mínimas)', 'Art. 22 (Jornada)', 'Art. 41 (Remuneración)'], texto: 'El contrato de trabajo se perfecciona con la sola prestación de servicios bajo dependencia, aunque no exista contrato escrito. El empleador tiene 15 días para escriturar. Las cláusulas mínimas son: individualización, función, remuneración, jornada, plazo, lugar. La jornada ordinaria máxima es 45 horas semanales (reduciéndose progresivamente a 40h).' },
      { titulo: 'Término del Contrato — Causales e Indemnizaciones', arts: ['Art. 159 (Causales objetivas)', 'Art. 160 (Falta sin indemnización)', 'Art. 161 (Necesidades de la empresa)', 'Art. 163 (Indemnización)'], texto: 'Art. 163: 30 días por año de servicio (máx. 11 años). Art. 161 (necesidades empresa/desahucio): aviso con 30 días o 1 mes de remuneración. Fuero: sindical, maternidad, pre y post natal, licencia médica. Nulidad del despido durante licencia médica. Despido injustificado: recargo del 30-80%.' },
      { titulo: 'Ley 21.220 — Teletrabajo', arts: ['Arts. 152 quáter G - O'], texto: 'El teletrabajo y trabajo a distancia es voluntario y reversible. Debe pactarse por escrito indicando lugar de prestación, distribución de la jornada (si aplica), y debe el empleador proporcionar equipos o pagar compensación. Los teletrabajadores tienen los mismos derechos que los trabajadores presenciales.' },
    ],
  },
  penal: {
    label: 'Derecho Penal',
    color: '#ef4444',
    normas: [
      { titulo: 'Principios Fundamentales', arts: ['Art. 1 CP (Legalidad)', 'Art. 11 CP (Atenuantes)', 'Art. 12 CP (Agravantes)', 'Art. 18 CP (Ley más favorable)'], texto: 'Nullum crimen nulla poena sine lege: sólo constituye delito la acción u omisión penada por la ley vigente al momento de su comisión. La ley más favorable al imputado se aplica con efecto retroactivo (Art. 18 CP). El principio de culpabilidad exige dolo o culpa para imputar responsabilidad penal.' },
      { titulo: 'Delitos Económicos y Societarios', arts: ['Art. 467-470 CP (Estafas)', 'Art. 193 CP (Falsificación)', 'Ley 20.393 (Responsabilidad penal empresas)'], texto: 'La Ley 20.393 establece responsabilidad penal de las personas jurídicas por delitos de lavado de activos, financiamiento del terrorismo, cohecho y delitos de la Ley 21.595 (delitos económicos). Para eximirse, la empresa debe implementar un modelo de prevención de delitos (compliance). Las multas pueden alcanzar 200.000 UTM.' },
      { titulo: 'Código Procesal Penal', arts: ['Art. 7 (Imputado)', 'Art. 93 (Derechos del imputado)', 'Art. 150 (Prisión preventiva)', 'Art. 237 (Suspensión condicional)'], texto: 'Derechos del imputado: guardar silencio, ser asistido por abogado de su elección o de oficio, conocer los cargos, no ser sometido a apremios ilegítimos. La prisión preventiva es excepcional y requiere necesidad cautelar. La suspensión condicional permite evitar el juicio si se cumplen condiciones por 1-3 años.' },
    ],
  },
  familia: {
    label: 'Derecho de Familia',
    color: '#ec4899',
    normas: [
      { titulo: 'Matrimonio y Régimen Patrimonial', arts: ['Art. 102 CC (Matrimonio)', 'Art. 135 CC (Sociedad conyugal)', 'Art. 1723 CC (Cambio de régimen)'], texto: 'El matrimonio genera sociedad conyugal (régimen legal supletorio). Puede pactarse separación total de bienes o participación en los gananciales antes del matrimonio o durante por escritura pública ante notario. La liquidación de la sociedad conyugal requiere inventario, tasación y partición.' },
      { titulo: 'Ley 19.947 — Matrimonio Civil (Divorcio)', arts: ['Art. 54 (Divorcio culpable)', 'Art. 55 (Divorcio de común acuerdo)', 'Art. 55 inc. 3 (Divorcio unilateral)'], texto: 'Divorcio culpable: causales graves (Art. 54). Divorcio de común acuerdo: 1 año de cese de convivencia + acuerdo completo y suficiente. Divorcio unilateral: 3 años de cese de convivencia. El acuerdo completo y suficiente debe regular: alimentos, régimen de bienes, cuidado personal, relación directa y regular.' },
      { titulo: 'Ley 14.908 — Alimentos y Pensiones', arts: ['Art. 1 (Obligados)', 'Art. 19 (Arresto)', 'Art. 3 (Mínimo legal 40% ingreso mínimo)'], texto: 'Los alimentos se deben con arreglo al título que los funda (ley, testamento, donación). Para hijos menores el mínimo legal es el 40% del ingreso mínimo por cada hijo. El incumplimiento puede generar arresto nocturno hasta 15 días por periodo (reiterado: hasta 30 días). Retencion en empleador.' },
    ],
  },
  tributario: {
    label: 'Derecho Tributario',
    color: '#f97316',
    normas: [
      { titulo: 'Código Tributario — Procedimientos', arts: ['Art. 10 (Plazos)', 'Art. 59 (Auditoría SII)', 'Art. 124 (Reclamación)', 'Art. 139 (Recurso de apelación)'], texto: 'El SII puede examinar y revisar declaraciones dentro del plazo de prescripción (3 años general; 6 años con malicia). La reclamación tributaria debe interponerse ante el Tribunal Tributario y Aduanero dentro de 90 días desde la notificación de la liquidación. La apelación ante la CA de Santiago procede en 15 días.' },
      { titulo: 'Ley de Impuesto a la Renta (DL 824)', arts: ['Art. 20 (Primera Categoría)', 'Art. 42 (Segunda Categoría)', 'Art. 59 (IA remesas al exterior)', 'Art. 104 (Instrumentos de deuda)'], texto: 'Impuesto de Primera Categoría: 27% para grandes contribuyentes; 25% régimen pro-PYME (Art. 14D). Impuesto Global Complementario: escala de tasas hasta el 40% para personas naturales. Impuesto Adicional: 35% sobre remesas al exterior, con retención. Reforma tributaria 2024 en implementación gradual.' },
      { titulo: 'IVA y Facturación Electrónica', arts: ['DL 825 Art. 1 (19%)', 'Art. 23 (Crédito fiscal)', 'Resolución SII 45/2003 (Factura electrónica)'], texto: 'La tasa general de IVA es 19%. El crédito fiscal IVA procede por compras destinadas a actividades gravadas. La factura electrónica es obligatoria para todos los contribuyentes. El DTE debe emitirse en el mismo período en que se produce el hecho gravado. Las boletas de honorarios electrónicas generan retención del 13.75%.' },
    ],
  },
}
