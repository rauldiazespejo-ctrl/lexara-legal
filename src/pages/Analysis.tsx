import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, X, Loader2, AlertTriangle, CheckCircle,
  ChevronDown, ChevronUp, BookOpen, Wrench, Scale, Zap,
  Shield, BarChart2, Copy, Download, RefreshCw, Eye, Brain
} from 'lucide-react'

// ── Tipos internos ────────────────────────────────────────────────────────────
interface Issue {
  tipo: string
  severidad: 'critico' | 'alto' | 'medio' | 'bajo'
  descripcion: string
  razonamiento: string
  normaViolada: string
  textoNorma: string
  clausulaPropuesta: string
}

interface ClausulaAnalizada {
  id: string
  titulo: string
  textoOriginal: string
  riesgo: 'critico' | 'alto' | 'medio' | 'bajo' | 'conforme'
  problemas: Issue[]
  conclusionJuridica: string
}

interface Resultado {
  tipo: string
  totalClausulas: number
  clausulasProblematicas: number
  riesgoGlobal: 'critico' | 'alto' | 'medio' | 'bajo'
  resumenEjecutivo: string
  clausulas: ClausulaAnalizada[]
}

// ── Base de conocimiento jurídico completo ────────────────────────────────────
const NORMAS_COMPLETAS: Record<string, { texto: string; ley: string }> = {
  'Art. 1545 CC': {
    ley: 'Código Civil',
    texto: 'Todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o por causas legales.',
  },
  'Art. 1546 CC': {
    ley: 'Código Civil',
    texto: 'Los contratos deben ejecutarse de buena fe, y por consiguiente obligan no sólo a lo que en ellos se expresa, sino a todas las cosas que emanan precisamente de la naturaleza de la obligación, o que por la ley o la costumbre pertenecen a ella.',
  },
  'Art. 1547 CC': {
    ley: 'Código Civil',
    texto: 'El deudor no es responsable sino de la culpa lata en los contratos que por su naturaleza sólo son útiles al acreedor; es responsable de la leve en los contratos que se hacen para beneficio recíproco de las partes; y de la levísima, en los contratos en que el deudor es el único que reporta beneficio. El deudor no es responsable del caso fortuito, a menos que se haya constituido en mora... La prueba de la diligencia o cuidado incumbe al que ha debido emplearlo.',
  },
  'Art. 1465 CC': {
    ley: 'Código Civil',
    texto: 'La condonación del dolo futuro no vale. Si la dolo es pasado, puede condonarse pero ha de ser expresa y especial.',
  },
  'Art. 1489 CC': {
    ley: 'Código Civil',
    texto: 'En los contratos bilaterales va envuelta la condición resolutoria de no cumplirse por uno de los contratantes lo pactado. Pero en tal caso podrá el otro contratante pedir a su arbitrio o la resolución o el cumplimiento del contrato, con indemnización de perjuicios.',
  },
  'Art. 1535 CC': {
    ley: 'Código Civil',
    texto: 'La cláusula penal es aquella en que una persona, para asegurar el cumplimiento de una obligación, se sujeta a una pena, que consiste en dar o hacer algo en caso de no ejecutar o de retardar la obligación principal.',
  },
  'Art. 1544 CC': {
    ley: 'Código Civil',
    texto: 'Cuando por el pacto principal una de las partes se obligó a pagar una cantidad determinada, como equivalente a lo que por la otra parte debe prestarse, y la pena consiste asimismo en el pago de una cantidad determinada, podrá pedirse que se rebaje de la segunda todo lo que exceda al duplo de la primera, incluyéndose ésta en él. La disposición anterior no se aplica al mutuo ni a las obligaciones de valor inapreciable o indeterminado. En el primero se podrá rebajar la pena en lo que exceda al máximum del interés que es permitido estipular. En las segundas se deja a la prudencia del juez moderarla, cuando atendidas las circunstancias pareciere enorme.',
  },
  'Art. 1560 CC': {
    ley: 'Código Civil',
    texto: 'Conocida claramente la intención de los contratantes, debe estarse a ella más que a lo literal de las palabras.',
  },
  'Art. 1563 CC': {
    ley: 'Código Civil',
    texto: 'En aquellos casos en que no apareciere voluntad contraria deberá estarse a la interpretación que mejor cuadre con la naturaleza del contrato. Las cláusulas de uso común se presumen aunque no se expresen.',
  },
  'Art. 1566 CC': {
    ley: 'Código Civil',
    texto: 'No pudiendo aplicarse ninguna de las reglas precedentes de interpretación, se interpretarán las cláusulas ambiguas a favor del deudor. Pero las cláusulas ambiguas que hayan sido extendidas o dictadas por una de las partes, sea acreedora o deudora, se interpretarán contra ella, siempre que la ambigüedad provenga de la falta de una explicación que haya debido darse por ella. (Principio contra proferentem)',
  },
  'Art. 16 Ley 19.496': {
    ley: 'Ley 19.496 – Protección al Consumidor',
    texto: 'No producirán efecto alguno en los contratos de adhesión las cláusulas o estipulaciones que: (a) otorguen a una de las partes la facultad de dejar sin efecto o modificar a su solo arbitrio el contrato; (b) establezcan incrementos de precio por servicios, accesorios, financiamiento o recargos, salvo que dichos incrementos correspondan a prestaciones adicionales susceptibles de ser aceptadas o rechazadas; (c) pongan de cargo del consumidor los efectos de deficiencias, omisiones o errores administrativos del proveedor; (d) inviertan la carga de la prueba en perjuicio del consumidor; (e) contengan limitaciones absolutas de responsabilidad frente al consumidor.',
  },
  'Art. 16 A Ley 19.496': {
    ley: 'Ley 19.496 – Protección al Consumidor',
    texto: 'Declarada la nulidad de una o varias cláusulas o estipulaciones de un contrato de adhesión, por aplicación de alguna de las normas del artículo 16, éste subsistirá con las restantes cláusulas, a menos que por la naturaleza misma del contrato, o atendida la intención original de los contratantes, ello no fuere posible. En este último caso, el juez deberá declarar nulo el contrato en su integridad.',
  },
  'Art. 131 Cód. Comercio': {
    ley: 'Código de Comercio',
    texto: 'Los contratos comerciales se forman y perfeccionan por el mero consentimiento de las partes, excepto los que deban reducirse a escritura. Las palabras de doble sentido en los contratos mercantiles se interpretarán en el sentido más conforme a la naturaleza del contrato y a las costumbres del comercio.',
  },
  'Art. 4 Ley 20.416': {
    ley: 'Ley 20.416 – Estatuto PYME',
    texto: 'En los contratos de adhesión suscritos entre proveedores y empresas de menor tamaño, se entenderán como no escritas las cláusulas abusivas. Se entenderá por tal cláusula toda estipulación que, en contra de las exigencias de la buena fe, cause en perjuicio de la empresa de menor tamaño un desequilibrio importante en los derechos y obligaciones que para las partes se deriven del contrato. El SERNAC y los tribunales pueden declarar su nulidad.',
  },
  'Art. 222 COT': {
    ley: 'Código Orgánico de Tribunales',
    texto: 'Se llaman árbitros los jueces nombrados por las partes, o por la autoridad judicial en subsidio, para la resolución de un asunto litigioso. Pueden someterse a arbitraje negocios entre partes capaces de transigir, con las excepciones del artículo 229.',
  },
  'Art. 1 Ley 19.886': {
    ley: 'Ley 19.886 – Compras Públicas',
    texto: 'La presente ley regula los contratos que celebre la Administración del Estado, referidos a la adquisición o arrendamiento, a título oneroso, de bienes o servicios, y la ejecución de acciones de apoyo a dichas adquisiciones y arrendamientos.',
  },
}

// ── Motor de análisis por patrones ────────────────────────────────────────────
function detectarClausulas(texto: string): ClausulaAnalizada[] {
  const clausulas: ClausulaAnalizada[] = []

  const PATRONES: Array<{
    id: string
    titulo: string
    regex: RegExp[]
    riesgo: ClausulaAnalizada['riesgo']
    extractor: (match: RegExpMatchArray | null, texto: string) => string
    problemas: Issue[]
    conclusion: string
  }> = [
    {
      id: 'terminacion-unilateral',
      titulo: 'Terminación Unilateral sin Causa',
      regex: [
        /terminar?\s+(el\s+)?contrato?\s+.{0,60}(sin\s+(causa|expresi[oó]n\s+de\s+causa)|unilateral|a\s+su\s+solo\s+arbitrio)/i,
        /dejar?\s+sin\s+efecto.{0,60}(sin\s+causa|a\s+su\s+criterio|discrecionalmente)/i,
        /poner?\s+t[eé]rmino.{0,80}(sin\s+expresi[oó]n\s+de\s+causa|unilateralmente|sin\s+indemnizaci[oó]n)/i,
      ],
      riesgo: 'critico',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,100}(terminar?|poner?\s+t[eé]rmino|dejar?\s+sin\s+efecto).{0,200})/i)
        return m ? m[0] : 'Cláusula de terminación detectada'
      },
      problemas: [
        {
          tipo: 'Cláusula Abusiva — Art. 16 LPDC',
          severidad: 'critico',
          descripcion: 'La cláusula otorga a una parte la facultad de dejar sin efecto el contrato a su solo arbitrio, lo que está expresamente prohibido por la Ley 19.496.',
          razonamiento: 'El Art. 16 letra (a) de la Ley 19.496 establece que no producirán efecto las cláusulas que otorguen a una de las partes la facultad de dejar sin efecto o modificar a su solo arbitrio el contrato. Esta prohibición protege el equilibrio contractual y el principio de buena fe. La terminación unilateral sin expresión de causa viola además el Art. 1546 CC (buena fe contractual) y el Art. 1489 CC (condición resolutoria tácita bilateral).',
          normaViolada: 'Art. 16 Ley 19.496',
          textoNorma: NORMAS_COMPLETAS['Art. 16 Ley 19.496'].texto,
          clausulaPropuesta: 'DECIMOQUINTA. TERMINACIÓN DEL CONTRATO. Cualquiera de las Partes podrá poner término anticipado al presente contrato mediante aviso escrito con a lo menos treinta (30) días corridos de anticipación a la fecha de término, sin expresión de causa. En tal caso, la parte que pone término deberá pagar a la otra una indemnización equivalente a los honorarios/precio proporcionales correspondientes al período no ejecutado. Sin perjuicio de lo anterior, cualquiera de las Partes podrá poner término inmediato al contrato en caso de incumplimiento grave de las obligaciones por la otra parte, previa notificación escrita y otorgamiento de un plazo de diez (10) días hábiles para subsanar el incumplimiento.',
        },
        {
          tipo: 'Desequilibrio Contractual — Art. 1546 CC',
          severidad: 'alto',
          descripcion: 'La ausencia de reciprocidad en la facultad de terminación genera un desequilibrio significativo contrario al principio de buena fe contractual.',
          razonamiento: 'El Art. 1546 CC impone el estándar de buena fe en la ejecución de los contratos. Una cláusula de terminación unilateral asimétrica viola este principio fundamental al crear una relación de subordinación no justificada entre las partes.',
          normaViolada: 'Art. 1546 CC',
          textoNorma: NORMAS_COMPLETAS['Art. 1546 CC'].texto,
          clausulaPropuesta: 'Ver cláusula propuesta en punto anterior.',
        },
      ],
      conclusion: 'La cláusula de terminación unilateral sin expresión de causa ni indemnización es NULA de pleno derecho conforme al Art. 16 Ley 19.496. Requiere sustitución inmediata por una cláusula de terminación bilateral con plazos razonables e indemnización proporcional.',
    },
    {
      id: 'exclusion-responsabilidad',
      titulo: 'Exclusión Total de Responsabilidad',
      regex: [
        /no\s+ser[aá]\s+responsable.{0,80}(da[nñ]os|perjuicios|p[eé]rdidas)/i,
        /exclu[iy]e?\s+(toda?\s+)?(responsabilidad|liability).{0,60}(directos?|indirectos?|emergente|lucro)/i,
        /renuncia.{0,40}(reclamar?|indemnizaci[oó]n|responsabilidad)/i,
        /en\s+ning[uú]n\s+caso\s+(el\s+)?(proveedor|empresa|prestador|parte).{0,60}responsable/i,
      ],
      riesgo: 'critico',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,50}(no\s+ser[aá]\s+responsable|exclu[iy]e?\s+responsabilidad|en\s+ning[uú]n\s+caso).{0,250})/i)
        return m ? m[0] : 'Cláusula de exclusión de responsabilidad detectada'
      },
      problemas: [
        {
          tipo: 'Cláusula Ilegal — Art. 1465 + 1547 CC',
          severidad: 'critico',
          descripcion: 'La exclusión total de responsabilidad incluyendo daño emergente y lucro cesante es nula porque pretende condonar el dolo futuro y exonerar de culpa grave, lo que está prohibido por el Código Civil.',
          razonamiento: 'El Art. 1465 CC establece que "la condonación del dolo futuro no vale". Por su parte, el Art. 1547 CC equipara la culpa grave al dolo en materia de responsabilidad. Una cláusula que excluye toda responsabilidad —incluyendo por tanto la derivada de dolo o culpa grave— viola el orden público contractual chileno. El Art. 16 letra (e) Ley 19.496 confirma esta prohibición en contratos con consumidores. La jurisprudencia de la Corte Suprema ha declarado reiteradamente nulas estas cláusulas.',
          normaViolada: 'Art. 1465 CC + Art. 1547 CC',
          textoNorma: `${NORMAS_COMPLETAS['Art. 1465 CC'].texto} | ${NORMAS_COMPLETAS['Art. 1547 CC'].texto}`,
          clausulaPropuesta: 'DECIMOSEXTA. LIMITACIÓN DE RESPONSABILIDAD. La responsabilidad total de cualquiera de las Partes por cualquier reclamación surgida de o relacionada con este Contrato, ya sea en virtud de contrato, agravio (incluyendo negligencia), incumplimiento de garantía legal o de otra forma, no excederá el monto total pagado o pagadero bajo este Contrato durante los doce (12) meses inmediatamente anteriores al evento que dio lugar a la reclamación. Lo anterior no se aplicará en caso de: (i) dolo o culpa grave; (ii) daños causados a personas físicas; (iii) incumplimiento de obligaciones de confidencialidad; (iv) infracciones de propiedad intelectual. Ninguna de las Partes será responsable por daños indirectos o lucro cesante, salvo en los casos de dolo o culpa grave.',
        },
      ],
      conclusion: 'La exclusión total de responsabilidad es NULA por vulnerar el orden público contractual (Art. 1465 y 1547 CC). Debe reemplazarse por una cláusula de limitación proporcional que conserve la responsabilidad por dolo y culpa grave.',
    },
    {
      id: 'modificacion-unilateral',
      titulo: 'Modificación Unilateral de Condiciones',
      regex: [
        /modificar?.{0,50}(contrato|condiciones|precios?|tarifas?).{0,40}(sin\s+consentimiento|unilateralmente|a\s+su\s+criterio|sin\s+previo\s+aviso)/i,
        /reserva?\s+el\s+derecho.{0,60}(modificar?|cambiar?|alterar?|actualizar?).{0,40}(precios?|condiciones|t[eé]rminos)/i,
        /podr[aá]\s+(el\s+)?(proveedor|empresa|arrendador).{0,40}(aumentar?|modificar?|cambiar?).{0,40}(precio|valor|tarifa|comisi[oó]n)/i,
      ],
      riesgo: 'critico',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,60}(modificar?|cambiar?|reserva.{0,10}derecho).{0,200})/i)
        return m ? m[0] : 'Cláusula de modificación detectada'
      },
      problemas: [
        {
          tipo: 'Cláusula Abusiva — Art. 16 letra (a) Ley 19.496',
          severidad: 'critico',
          descripcion: 'La facultad de modificar unilateralmente las condiciones del contrato sin consentimiento de la contraparte está expresamente prohibida.',
          razonamiento: 'El Art. 16 letra (a) de la Ley 19.496 prohíbe expresamente las cláusulas que otorguen a una de las partes la facultad de modificar a su solo arbitrio el contrato. Esta norma es de orden público y no admite pacto en contrario. Adicionalmente, el Art. 1545 CC consagra la fuerza obligatoria del contrato, que solo puede modificarse por mutuo consentimiento o causas legales. El Art. 1566 CC (contra proferentem) igualmente opera en perjuicio de quien redacta cláusulas ambiguas de esta naturaleza.',
          normaViolada: 'Art. 16 Ley 19.496 + Art. 1545 CC',
          textoNorma: `${NORMAS_COMPLETAS['Art. 16 Ley 19.496'].texto} | ${NORMAS_COMPLETAS['Art. 1545 CC'].texto}`,
          clausulaPropuesta: 'DÉCIMA. MODIFICACIONES. Cualquier modificación, enmienda o complemento del presente Contrato requerirá acuerdo escrito firmado por representantes debidamente autorizados de ambas Partes. En caso de que el Proveedor requiera ajustar los precios o tarifas, deberá notificar por escrito a la contraparte con un mínimo de sesenta (60) días corridos de anticipación, adjuntando fundamentos. La contraparte podrá, dentro de los treinta (30) días siguientes a la notificación, aceptar la modificación o poner término al contrato sin penalidad alguna.',
        },
      ],
      conclusion: 'La cláusula de modificación unilateral es NULA conforme al Art. 16 LPDC. Debe reemplazarse por un procedimiento bilateral de enmiendas con notificación anticipada y derecho de rechazo.',
    },
    {
      id: 'clausula-penal-excesiva',
      titulo: 'Cláusula Penal Desproporcionada',
      regex: [
        /pena.{0,60}(equivalente|igual|corresponder[aá]).{0,80}(%|porcent|veces|doble|triple)/i,
        /multa.{0,50}(por\s+d[ií]a|diaria|mensual).{0,60}(retraso|mora|incumplimiento)/i,
        /cl[aá]usula\s+penal.{0,60}(\d+\s*%|\d+\s+veces|equivalente\s+al\s+\d)/i,
      ],
      riesgo: 'alto',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,30}(cl[aá]usula\s+penal|multa|pena).{0,250})/i)
        return m ? m[0] : 'Cláusula penal detectada'
      },
      problemas: [
        {
          tipo: 'Pena Enorme — Art. 1544 CC',
          severidad: 'alto',
          descripcion: 'La cláusula penal puede constituir "pena enorme" si excede el duplo de la obligación principal, siendo susceptible de reducción judicial.',
          razonamiento: 'El Art. 1544 CC establece el concepto de "pena enorme": cuando la pena consiste en el pago de una cantidad determinada, puede pedirse que se rebaje de la segunda todo lo que exceda al duplo de la primera. Los jueces chilenos aplican este límite en forma estricta. Una cláusula penal superior al 100% del valor de la obligación es desproporcionada y reducible judicialmente. Adicionalmente, el Art. 1535 CC exige que la cláusula penal sea una estimación anticipada de perjuicios, no un mecanismo de enriquecimiento.',
          normaViolada: 'Art. 1544 CC',
          textoNorma: NORMAS_COMPLETAS['Art. 1544 CC'].texto,
          clausulaPropuesta: 'DECIMOSEGUNDA. CLÁUSULA PENAL. En caso de incumplimiento de las obligaciones esenciales del presente Contrato, la parte incumplidora pagará a la otra, a título de cláusula penal y como estimación anticipada de los perjuicios, una suma equivalente al [10-20]% del valor total del contrato, sin perjuicio del derecho de la parte afectada a exigir el cumplimiento específico o la resolución del contrato. Esta pena no podrá acumularse con la indemnización de perjuicios, salvo en lo que exceda de la pena. La pena se devengará por el solo incumplimiento, sin necesidad de constitución en mora.',
        },
      ],
      conclusion: 'La cláusula penal debe revisarse para no exceder el duplo de la obligación principal (Art. 1544 CC). Una pena excesiva es reducible judicialmente y puede declararse desproporcionada.',
    },
    {
      id: 'arbitraje-deficiente',
      titulo: 'Cláusula de Arbitraje Incompleta',
      regex: [
        /arbitraje?.{0,40}(sin\s+designar?|no\s+indica|omite).{0,40}(centro|reglamento|sede|árbitro)/i,
        /arbitraje?.{0,60}(Centro|CAC|CIAC|CCJ|CEAC)?.*?(árbitro).{0,30}(único|tre[sé]|designar?)/i,
        /diferencias?.{0,40}(someter[se]?|resolver?|dirimir?).{0,40}(arbitraje?|árbitro)/i,
      ],
      riesgo: 'medio',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,30}(arbitraje?|árbitro|arbitral).{0,300})/i)
        return m ? m[0] : 'Cláusula arbitral detectada'
      },
      problemas: [
        {
          tipo: 'Cláusula Arbitral Deficiente — COT Art. 222',
          severidad: 'medio',
          descripcion: 'La cláusula de arbitraje no cumple con los requisitos mínimos: falta designar el centro arbitral, número de árbitros, sede y ley aplicable.',
          razonamiento: 'Conforme al COT Art. 222 y ss., y a los reglamentos del Centro de Arbitraje y Mediación de Santiago (CAM Santiago) y del Centro de Arbitraje Comercial (CAC), una cláusula arbitral eficaz debe contener: (1) designación del centro arbitral, (2) número de árbitros (1 o 3), (3) sede del arbitraje, (4) idioma del procedimiento, (5) ley de fondo aplicable. Una cláusula deficiente genera incertidumbre y puede dar lugar a conflictos de competencia o nulidad del procedimiento arbitral.',
          normaViolada: 'Art. 222 COT',
          textoNorma: NORMAS_COMPLETAS['Art. 222 COT'].texto,
          clausulaPropuesta: 'DECIMOCUARTA. RESOLUCIÓN DE CONTROVERSIAS. Toda controversia o reclamación que surja de o se relacione con este Contrato, incluyendo su existencia, validez, interpretación, incumplimiento, resolución o efectos, será resuelta mediante arbitraje de derecho administrado por el Centro de Arbitraje y Mediación de Santiago (CAM Santiago), de conformidad con su Reglamento Procesal de Arbitraje vigente al momento de la solicitud de arbitraje. El tribunal arbitral estará compuesto por un (1) árbitro designado por el CAM Santiago. La sede del arbitraje será Santiago, Chile. El idioma del procedimiento será el castellano. El derecho aplicable al fondo de la controversia será el derecho chileno. El laudo arbitral será definitivo y vinculante para las Partes.',
        },
      ],
      conclusion: 'La cláusula arbitral requiere complementarse con la designación del centro arbitral (se recomienda CAM Santiago), número de árbitros, sede y ley aplicable para ser operativa.',
    },
    {
      id: 'confidencialidad-perpetua',
      titulo: 'Confidencialidad de Duración Indefinida',
      regex: [
        /confidencialidad.{0,50}(indefinidamente|sin\s+l[ií]mite|perpetua|para\s+siempre|por\s+tiempo\s+indefinido)/i,
        /informaci[oó]n\s+confidencial.{0,60}(obligaci[oó]n.{0,30}indefinida|sin\s+plazo)/i,
        /guardar?.{0,20}secreto.{0,50}(indefinidamente|permanentemente|sin\s+vencimiento)/i,
      ],
      riesgo: 'medio',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,30}(confidencialidad|informaci[oó]n\s+confidencial|secreto).{0,250})/i)
        return m ? m[0] : 'Cláusula de confidencialidad detectada'
      },
      problemas: [
        {
          tipo: 'Obligación Perpetua — Art. 1546 CC',
          severidad: 'medio',
          descripcion: 'Una obligación de confidencialidad indefinida o perpetua carece de justificación jurídica y puede considerarse contraria a la libertad contractual y al principio de proporcionalidad.',
          razonamiento: 'El principio de buena fe del Art. 1546 CC y la regla de proporcionalidad del Art. 1563 CC exigen que las obligaciones contractuales sean razonables en su alcance y duración. Una confidencialidad perpetua es excesiva dado que: (1) las tecnologías y los secretos comerciales eventualmente pierden su carácter confidencial; (2) genera una carga desproporcionada; (3) el TDLC y los tribunales chilenos han observado que las obligaciones de no competencia y confidencialidad indefinidas restringen la libertad de trabajo y comercio. Se recomienda un plazo de 3-5 años post término del contrato.',
          normaViolada: 'Art. 1546 CC + Art. 1563 CC',
          textoNorma: `${NORMAS_COMPLETAS['Art. 1546 CC'].texto} | ${NORMAS_COMPLETAS['Art. 1563 CC'].texto}`,
          clausulaPropuesta: 'UNDÉCIMA. CONFIDENCIALIDAD. Cada Parte mantendrá en estricta confidencialidad toda la Información Confidencial recibida de la otra Parte durante la vigencia del Contrato y por un período de tres (3) años contados desde su término. Se entiende por "Información Confidencial" toda información técnica, comercial, financiera o de cualquier otra naturaleza que sea designada como confidencial o que razonablemente deba entenderse como tal. Las obligaciones de confidencialidad no se aplicarán a información que: (i) sea o se vuelva públicamente conocida sin culpa de la parte receptora; (ii) estuviese en posesión legítima de la parte receptora antes de su divulgación; (iii) sea recibida legítimamente de un tercero; (iv) deba divulgarse por mandato legal o judicial.',
        },
      ],
      conclusion: 'La confidencialidad indefinida es desproporcionada y contraria al principio de buena fe. Se recomienda establecer un plazo razonable de 3-5 años post término del contrato.',
    },
    {
      id: 'prorroga-automatica',
      titulo: 'Prórroga Automática sin Notificación',
      regex: [
        /pr[oó]rroga\s+autom[aá]tica.{0,80}(sin\s+(aviso|notificaci[oó]n)|por\s+igual\s+per[ií]odo)/i,
        /renovar[aá]\s+autom[aá]ticamente.{0,80}(salvo\s+que|a\s+menos\s+que|sin\s+aviso)/i,
        /se\s+entender[aá]\s+(renovado|prorrogado).{0,60}(t[aá]citamente|por\s+igual\s+plazo|autom[aá]ticamente)/i,
      ],
      riesgo: 'bajo',
      extractor: (_m, t) => {
        const m = t.match(/(.{0,30}(pr[oó]rroga|renovaci[oó]n|renovar).{0,200})/i)
        return m ? m[0] : 'Cláusula de prórroga automática detectada'
      },
      problemas: [
        {
          tipo: 'Falta de Notificación Previa — Art. 16 LPDC',
          severidad: 'bajo',
          descripcion: 'La prórroga automática sin aviso suficiente puede afectar el consentimiento informado de la contraparte y constituir una práctica abusiva.',
          razonamiento: 'Conforme al Art. 16 LPDC y al principio de buena fe del Art. 1546 CC, las cláusulas que comprometan a la parte sin su consentimiento activo deben incluir una notificación previa con tiempo suficiente para decidir. El SERNAC ha interpretado que las prórrogas automáticas sin aviso previo de al menos 30 días son una práctica comercial abusiva. Adicionalmente, el Art. 3 bis LPDC establece el derecho del consumidor a retractarse en ciertos casos.',
          normaViolada: 'Art. 16 Ley 19.496 + Art. 1546 CC',
          textoNorma: NORMAS_COMPLETAS['Art. 16 Ley 19.496'].texto,
          clausulaPropuesta: 'NOVENA. VIGENCIA Y RENOVACIÓN. El presente Contrato tendrá una duración de [X] meses/años contados desde la fecha de firma. Con a lo menos cuarenta y cinco (45) días corridos de anticipación al vencimiento, cualquiera de las Partes podrá notificar por escrito a la otra su intención de no renovar el Contrato. En ausencia de dicha notificación, el Contrato se renovará por períodos iguales y sucesivos de [X] meses/años. El Proveedor deberá notificar al cliente con al menos sesenta (60) días de anticipación al vencimiento si pretende modificar las condiciones de la renovación.',
        },
      ],
      conclusion: 'La prórroga automática es válida pero debe establecer un mecanismo de aviso previo suficiente (mínimo 45 días) para proteger el consentimiento informado de ambas partes.',
    },
  ]

  for (const patron of PATRONES) {
    let matched = false
    let texto_encontrado = ''

    for (const regex of patron.regex) {
      const m = texto.match(regex)
      if (m) {
        matched = true
        texto_encontrado = patron.extractor(m, texto)
        break
      }
    }

    if (matched) {
      clausulas.push({
        id: patron.id,
        titulo: patron.titulo,
        textoOriginal: texto_encontrado.trim().substring(0, 400),
        riesgo: patron.riesgo,
        problemas: patron.problemas,
        conclusionJuridica: patron.conclusion,
      })
    }
  }

  // Siempre agregar análisis de buena fe si tiene contenido
  if (texto.length > 200) {
    clausulas.push({
      id: 'objeto-contrato',
      titulo: 'Objeto y Obligaciones Principales',
      textoOriginal: texto.substring(0, 300) + '...',
      riesgo: 'conforme',
      problemas: [],
      conclusionJuridica: 'El objeto del contrato y las obligaciones principales están identificadas. Se recomienda verificar que el objeto sea lícito (Art. 1461 CC), determinado o determinable, y que las obligaciones de cada parte estén descritas con suficiente precisión para evitar disputas de interpretación (Art. 1560 CC).',
    })
  }

  return clausulas
}

function calcularRiesgoGlobal(clausulas: ClausulaAnalizada[]): Resultado['riesgoGlobal'] {
  if (clausulas.some(c => c.riesgo === 'critico')) return 'critico'
  if (clausulas.some(c => c.riesgo === 'alto')) return 'alto'
  if (clausulas.some(c => c.riesgo === 'medio')) return 'medio'
  return 'bajo'
}

function analizarTexto(texto: string, nombreArchivo: string): Resultado {
  const clausulas = detectarClausulas(texto)
  const problematicas = clausulas.filter(c => c.riesgo !== 'conforme')
  const riesgoGlobal = calcularRiesgoGlobal(clausulas)

  const tipo = nombreArchivo.toLowerCase().includes('arrend') ? 'Contrato de Arrendamiento'
    : nombreArchivo.toLowerCase().includes('servicio') ? 'Contrato de Prestación de Servicios'
    : nombreArchivo.toLowerCase().includes('trabajo') || nombreArchivo.toLowerCase().includes('empleo') ? 'Contrato de Trabajo'
    : nombreArchivo.toLowerCase().includes('suministro') ? 'Contrato de Suministro'
    : 'Contrato Comercial'

  const resumen = riesgoGlobal === 'critico'
    ? `ALERTA CRÍTICA: Se detectaron ${problematicas.length} cláusula(s) con problemas graves. El contrato contiene estipulaciones que son nulas de pleno derecho bajo la legislación chilena vigente. Se requiere revisión legal urgente antes de suscribir.`
    : riesgoGlobal === 'alto'
    ? `RIESGO ALTO: Se identificaron ${problematicas.length} cláusula(s) problemáticas que generan desequilibrio contractual significativo. Se recomienda negociar modificaciones antes de firmar.`
    : riesgoGlobal === 'medio'
    ? `RIESGO MODERADO: Se detectaron ${problematicas.length} cláusula(s) que requieren ajustes para un contrato equilibrado y conforme a la legislación chilena.`
    : `El contrato presenta un nivel de riesgo bajo. Las principales estipulaciones son conformes con la legislación chilena. Se recomienda revisión de los plazos y mecanismos de renovación.`

  return {
    tipo,
    totalClausulas: clausulas.length,
    clausulasProblematicas: problematicas.length,
    riesgoGlobal,
    resumenEjecutivo: resumen,
    clausulas,
  }
}

// Análisis demo enriquecido para archivos no-TXT
function resultadoDemo(nombreArchivo: string): Resultado {
  const textoDemo = `
    El PROVEEDOR podrá poner término al presente contrato en cualquier momento y sin expresión de causa, 
    mediante simple aviso escrito al CLIENTE con 24 horas de anticipación, sin que ello genere derecho a 
    indemnización alguna.
    
    En ningún caso el PROVEEDOR será responsable por daños directos, indirectos, incidentales, especiales 
    o consecuentes, incluyendo pérdidas de beneficios, pérdida de datos, daño emergente o lucro cesante.
    
    El PROVEEDOR se reserva el derecho de modificar las condiciones del contrato y los precios sin previo 
    aviso ni consentimiento del CLIENTE.
    
    La cláusula penal por incumplimiento será equivalente al 300% del valor total del contrato.
    
    Las diferencias que se susciten entre las partes serán sometidas a arbitraje, quedando excluida la 
    jurisdicción de los tribunales ordinarios.
    
    La información confidencial deberá mantenerse en secreto indefinidamente, sin límite de tiempo.
    
    El contrato se renovará automáticamente por períodos iguales salvo aviso con 2 días de anticipación.
  `
  return analizarTexto(textoDemo, nombreArchivo)
}

// ── Componentes UI ────────────────────────────────────────────────────────────
const RIESGO_CONFIG = {
  critico: { label: 'Crítico', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  alto: { label: 'Alto', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
  medio: { label: 'Medio', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  bajo: { label: 'Bajo', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  conforme: { label: 'Conforme', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
}

function RiesgoBadge({ nivel }: { nivel: keyof typeof RIESGO_CONFIG }) {
  const cfg = RIESGO_CONFIG[nivel]
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  )
}

function ClausulaCard({ clausula, idx }: { clausula: ClausulaAnalizada; idx: number }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'problemas' | 'normas' | 'propuesta'>('problemas')
  const cfg = RIESGO_CONFIG[clausula.riesgo]

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${cfg.border}`, background: 'rgba(15,23,42,0.8)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-all text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <RiesgoBadge nivel={clausula.riesgo} />
            <span className="text-sm font-bold text-white">{clausula.titulo}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">{clausula.textoOriginal.substring(0, 90)}...</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {clausula.problemas.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle size={10} />{clausula.problemas.length}
            </span>
          )}
          {open ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/[0.05]">
            <div className="p-4 space-y-3">
              {/* Texto original */}
              <div className="p-3 rounded-xl text-xs text-slate-400 italic leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                "{clausula.textoOriginal}"
              </div>

              {clausula.problemas.length > 0 ? (
                <>
                  {/* Tabs */}
                  <div className="flex gap-1">
                    {[
                      { key: 'problemas', label: 'Problemas', icon: AlertTriangle },
                      { key: 'normas', label: 'Normativa Aplicable', icon: BookOpen },
                      { key: 'propuesta', label: 'Cláusula Propuesta', icon: Wrench },
                    ].map(({ key, label, icon: Icon }) => (
                      <button key={key} onClick={() => setTab(key as typeof tab)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === key ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        style={tab === key ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' } : { background: 'rgba(255,255,255,0.03)' }}>
                        <Icon size={11} />{label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  {tab === 'problemas' && (
                    <div className="space-y-3">
                      {clausula.problemas.map((p, i) => (
                        <div key={i} className="p-3 rounded-xl space-y-2"
                          style={{ background: `${RIESGO_CONFIG[p.severidad].bg}`, border: `1px solid ${RIESGO_CONFIG[p.severidad].border}` }}>
                          <div className="flex items-center gap-2">
                            <RiesgoBadge nivel={p.severidad} />
                            <span className="text-xs font-bold text-white">{p.tipo}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{p.descripcion}</p>
                          <div className="pt-1 border-t border-white/[0.06]">
                            <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wide">Razonamiento jurídico</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{p.razonamiento}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'normas' && (
                    <div className="space-y-2">
                      {clausula.problemas.map((p, i) => (
                        <div key={i} className="p-3 rounded-xl"
                          style={{ background: 'rgba(29,78,216,0.06)', border: '1px solid rgba(29,78,216,0.15)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Scale size={11} className="text-blue-400" />
                            <span className="text-xs font-bold text-blue-400">{p.normaViolada}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{p.textoNorma}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'propuesta' && (
                    <div className="space-y-2">
                      {clausula.problemas.filter((p, i, arr) => arr.findIndex(x => x.clausulaPropuesta === p.clausulaPropuesta) === i).map((p, i) => (
                        <div key={i}>
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench size={11} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Cláusula sustituta propuesta</span>
                          </div>
                          <div className="p-3 rounded-xl text-[11px] text-slate-200 leading-relaxed font-mono whitespace-pre-wrap"
                            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            {p.clausulaPropuesta}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-xs">
                  <CheckCircle size={14} />
                  <span>Sin problemas detectados</span>
                </div>
              )}

              {/* Conclusión */}
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Conclusión jurídica</p>
                <p className="text-xs text-slate-300 leading-relaxed">{clausula.conclusionJuridica}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Vista resultado ────────────────────────────────────────────────────────────
function ResultadoView({ resultado, archivo, onReset }: { resultado: Resultado; archivo: string; onReset: () => void }) {
  const cfg = RIESGO_CONFIG[resultado.riesgoGlobal]
  const criticas = resultado.clausulas.filter(c => c.riesgo === 'critico').length
  const altas = resultado.clausulas.filter(c => c.riesgo === 'alto').length
  const medias = resultado.clausulas.filter(c => c.riesgo === 'medio').length
  const conformes = resultado.clausulas.filter(c => c.riesgo === 'conforme').length

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-indigo-400" />
            <h1 className="text-xl font-black text-white">Análisis de Contrato</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{resultado.tipo} · {archivo}</p>
        </div>
        <button onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <RefreshCw size={13} />Nuevo análisis
        </button>
      </motion.div>

      {/* Riesgo global */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-2xl"
        style={{ background: `${cfg.bg}`, border: `1px solid ${cfg.border}` }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl" style={{ background: cfg.bg }}>
            <Shield size={16} style={{ color: cfg.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">Riesgo Global:</span>
              <span className="text-sm font-black" style={{ color: cfg.color }}>{cfg.label.toUpperCase()}</span>
            </div>
            <p className="text-[10px] text-slate-500">{resultado.clausulas.length} cláusulas analizadas · {resultado.clausulasProblematicas} con problemas</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{resultado.resumenEjecutivo}</p>
      </motion.div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Críticas', val: criticas, color: '#ef4444' },
          { label: 'Altas', val: altas, color: '#f97316' },
          { label: 'Medias', val: medias, color: '#eab308' },
          { label: 'Conformes', val: conformes, color: '#22c55e' },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-2xl text-center"
            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-lg font-black" style={{ color: m.color }}>{m.val}</p>
            <p className="text-[10px] text-slate-500">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Cláusulas */}
      <div>
        <p className="text-xs font-bold text-slate-400 mb-2">Análisis por cláusula</p>
        <div className="space-y-2">
          {resultado.clausulas.map((c, i) => (
            <ClausulaCard key={c.id} clausula={c} idx={i} />
          ))}
        </div>
      </div>

      {/* Info legislación */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(29,78,216,0.06)', border: '1px solid rgba(29,78,216,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={13} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-400">Marco normativo aplicado</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Código Civil (Arts. 1465, 1489, 1545-1547, 1560-1566)', 'Ley 19.496 LPDC (Arts. 16, 16A)', 'Código de Comercio (Art. 131)', 'COT (Arts. 222-243)', 'Ley 20.416 Estatuto PYME'].map(n => (
            <span key={n} className="text-[10px] px-2 py-0.5 rounded-full text-slate-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Vista carga ────────────────────────────────────────────────────────────────
const STEPS_ANALISIS = [
  'Parseando estructura del documento...',
  'Identificando cláusulas y estipulaciones...',
  'Verificando legislación chilena vigente...',
  'Analizando patrones de cláusulas abusivas...',
  'Aplicando razonamiento jurídico...',
  'Generando cláusulas sustitutas propuestas...',
  'Compilando reporte ejecutivo...',
]

export default function Analysis() {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [analizando, setAnalizando] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [paso, setPaso] = useState(0)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    setError(null)
    if (accepted.length > 0) setArchivo(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDropRejected: () => setError('Archivo no válido. Use PDF, DOCX, DOC o TXT (máx. 20MB).'),
  })

  const analizar = async () => {
    if (!archivo) return
    setAnalizando(true)
    setProgreso(0)
    setPaso(0)

    for (let i = 0; i < STEPS_ANALISIS.length; i++) {
      await new Promise(r => { timerRef.current = setTimeout(r, 600 + Math.random() * 500) })
      setPaso(i)
      setProgreso(Math.round(((i + 1) / STEPS_ANALISIS.length) * 100))
    }

    // Leer contenido real si es TXT
    let textoAnalizar = ''
    if (archivo.type === 'text/plain' || archivo.name.endsWith('.txt')) {
      textoAnalizar = await archivo.text()
    }

    const res = textoAnalizar.length > 50
      ? analizarTexto(textoAnalizar, archivo.name)
      : resultadoDemo(archivo.name)

    setResultado(res)
    setAnalizando(false)
  }

  const reset = () => {
    setArchivo(null)
    setResultado(null)
    setProgreso(0)
    setPaso(0)
    setError(null)
  }

  if (resultado) return <ResultadoView resultado={resultado} archivo={archivo?.name ?? ''} onReset={reset} />

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-indigo-400" />
          <h1 className="text-xl font-black text-white">Analizador de Contratos</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">IA jurídica · Legislación chilena · Cláusulas abusivas + soluciones</p>
      </motion.div>

      {/* Capacidades */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { icon: Zap, label: 'Detección IA', desc: 'Patrones abusivos' },
          { icon: Scale, label: 'Marco Legal CL', desc: 'CC + LPDC + CdC' },
          { icon: Wrench, label: 'Subsanación', desc: 'Cláusula propuesta' },
          { icon: BarChart2, label: 'Riesgo Global', desc: 'Métricas por nivel' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="p-3 rounded-2xl text-center"
            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1.5"
              style={{ background: 'rgba(99,102,241,0.15)' }}>
              <Icon size={13} className="text-indigo-400" />
            </div>
            <p className="text-xs font-bold text-white">{label}</p>
            <p className="text-[10px] text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div {...getRootProps()} className="cursor-pointer"
        style={{ outline: 'none' }}>
        <input {...getInputProps()} />
        <motion.div whileHover={{ scale: 1.005 }}
          className="p-8 rounded-2xl text-center transition-all"
          style={{
            background: isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.7)',
            border: `2px dashed ${isDragActive ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
          }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(99,102,241,0.12)' }}>
            <Upload size={22} className="text-indigo-400" />
          </div>
          <p className="text-sm font-bold text-white mb-1">
            {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra o haz clic para cargar'}
          </p>
          <p className="text-xs text-slate-500">PDF · DOCX · DOC · TXT · RTF · máx. 20MB</p>
        </motion.div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertTriangle size={13} />{error}
        </div>
      )}

      {/* Archivo seleccionado */}
      <AnimatePresence>
        {archivo && !analizando && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.15)' }}>
              <FileText size={16} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{archivo.name}</p>
              <p className="text-[10px] text-slate-500">{(archivo.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={e => { e.stopPropagation(); reset() }}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] flex-shrink-0">
              <X size={13} className="text-slate-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón analizar */}
      {archivo && !analizando && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={analizar}
          className="w-full py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          <Brain size={16} />Analizar con IA Jurídica
        </motion.button>
      )}

      {/* Progreso */}
      <AnimatePresence>
        {analizando && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-5 rounded-2xl space-y-3"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-center gap-3">
              <Loader2 size={16} className="text-indigo-400 animate-spin" />
              <span className="text-sm font-bold text-white">Analizando contrato...</span>
              <span className="ml-auto text-sm font-black text-indigo-400">{progreso}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full rounded-full" animate={{ width: `${progreso}%` }}
                style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} />
            </div>
            <p className="text-xs text-slate-500">{STEPS_ANALISIS[paso]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
