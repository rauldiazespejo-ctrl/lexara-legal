export interface CampoTemplate {
  id: string
  label: string
  tipo: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'currency'
  placeholder?: string
  opciones?: string[]
  default?: string
  requerido: boolean
  ayuda?: string
}

export interface ClausulaTemplate {
  id: string
  numero?: number
  categoria: string
  nombre: string
  tiposContrato: string[]
  descripcionSimple: string
  explicacion: string
  campos: CampoTemplate[]
  generarTexto: (v: Record<string, string>) => string
  normasAplicables: string[]
  riesgos: string[]
  mejoras: string[]
  esObligatoria?: boolean
}

export const TIPOS_CONTRATO = [
  'Prestación de Servicios',
  'Compraventa',
  'Arrendamiento de Inmueble',
  'Arrendamiento de Servicios',
  'Mandato',
  'Suministro',
  'Obra y Faena',
  'Distribución',
  'Franquicia',
  'Confidencialidad (NDA)',
  'Sociedad / Joint Venture',
  'Mutuo / Préstamo',
  'Licencia de Software',
  'Contrato de Trabajo',
  'General / Otro',
]

export const CATEGORIAS_CLAUSULA = [
  'Partes y Antecedentes',
  'Objeto y Alcance',
  'Precio y Pago',
  'Obligaciones',
  'Confidencialidad',
  'Propiedad Intelectual',
  'Vigencia y Terminación',
  'Responsabilidad',
  'Resolución de Conflictos',
  'Disposiciones Generales',
]

export const CLAUSULAS: ClausulaTemplate[] = [
  // ─────────────────────────────────────────────────────────────
  // PARTES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'partes-personas',
    categoria: 'Partes y Antecedentes',
    nombre: 'Individualización de las Partes (Personas Naturales)',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Identifica a las personas que firman el contrato con todos sus datos legales.',
    explicacion: 'Es la primera cláusula de todo contrato. Sin ella el documento no tiene efecto legal porque no se sabe quién se obliga. Debe incluir nombre completo, RUT, domicilio y cómo actúa cada parte.',
    esObligatoria: true,
    campos: [
      { id: 'nombre_parte_a', label: 'Nombre completo Parte A', tipo: 'text', placeholder: 'Ej: Juan Carlos Pérez Rojas', requerido: true },
      { id: 'rut_parte_a', label: 'RUT Parte A', tipo: 'text', placeholder: 'Ej: 12.345.678-9', requerido: true },
      { id: 'domicilio_parte_a', label: 'Domicilio Parte A', tipo: 'text', placeholder: 'Ej: Av. Providencia 1234, Providencia, Santiago', requerido: true },
      { id: 'rol_parte_a', label: 'Denominación Parte A', tipo: 'select', opciones: ['PRESTADOR', 'VENDEDOR', 'ARRENDADOR', 'MANDANTE', 'ACREEDOR', 'LICENCIANTE', 'CONTRATANTE'], requerido: true },
      { id: 'nombre_parte_b', label: 'Nombre completo Parte B', tipo: 'text', placeholder: 'Ej: María Isabel Soto Fuentes', requerido: true },
      { id: 'rut_parte_b', label: 'RUT Parte B', tipo: 'text', placeholder: 'Ej: 9.876.543-2', requerido: true },
      { id: 'domicilio_parte_b', label: 'Domicilio Parte B', tipo: 'text', placeholder: 'Ej: Los Leones 456, Las Condes, Santiago', requerido: true },
      { id: 'rol_parte_b', label: 'Denominación Parte B', tipo: 'select', opciones: ['CLIENTE', 'COMPRADOR', 'ARRENDATARIO', 'MANDATARIO', 'DEUDOR', 'LICENCIATARIO', 'CONTRATADO'], requerido: true },
      { id: 'ciudad_contrato', label: 'Ciudad donde se celebra', tipo: 'text', placeholder: 'Ej: Santiago', requerido: true, default: 'Santiago' },
      { id: 'fecha_contrato', label: 'Fecha del contrato', tipo: 'date', requerido: true },
    ],
    generarTexto: (v) => `COMPARECEN: En ${v.ciudad_contrato || 'Santiago'}, a ${v.fecha_contrato ? new Date(v.fecha_contrato).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : '[FECHA]'}, ante Notario Público o en forma privada, comparecen:

Por una parte, don/doña ${v.nombre_parte_a || '[NOMBRE PARTE A]'}, cédula de identidad N° ${v.rut_parte_a || '[RUT]'}, domiciliado/a en ${v.domicilio_parte_a || '[DOMICILIO]'}, quien en adelante se denominará indistintamente "${v.rol_parte_a || 'PARTE A'}"; y

Por la otra parte, don/doña ${v.nombre_parte_b || '[NOMBRE PARTE B]'}, cédula de identidad N° ${v.rut_parte_b || '[RUT]'}, domiciliado/a en ${v.domicilio_parte_b || '[DOMICILIO]'}, quien en adelante se denominará indistintamente "${v.rol_parte_b || 'PARTE B'}".

Ambas partes, mayores de edad, capaces de contratar y obligarse, y con el mérito de sus respectivas cédulas de identidad, han convenido en celebrar el presente contrato, sujeto a las siguientes cláusulas y condiciones:`,
    normasAplicables: ['Art. 1438 CC — Definición de contrato', 'Art. 1445 CC — Requisitos de validez', 'Art. 1446 CC — Capacidad legal'],
    riesgos: ['Sin identificación clara, el contrato puede ser impugnable por falta de sujetos determinados.', 'Domicilio incorrecto dificulta las notificaciones judiciales.'],
    mejoras: ['Agregar profesión u oficio de cada parte.', 'En contratos importantes, indicar estado civil y régimen matrimonial.', 'Para personas jurídicas, incluir número de escritura pública y representante legal.'],
  },
  {
    id: 'partes-empresa',
    categoria: 'Partes y Antecedentes',
    nombre: 'Individualización de las Partes (Personas Jurídicas)',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Identifica a las empresas que firman el contrato, incluyendo su representante legal.',
    explicacion: 'Las empresas no pueden firmar por sí solas: necesitan un representante legal (gerente, director). Esta cláusula establece quién tiene facultades para obligar a la empresa.',
    esObligatoria: true,
    campos: [
      { id: 'razon_social_a', label: 'Razón Social Empresa A', tipo: 'text', placeholder: 'Ej: Servicios Tecnológicos Ltda.', requerido: true },
      { id: 'rut_empresa_a', label: 'RUT Empresa A', tipo: 'text', placeholder: 'Ej: 76.543.210-5', requerido: true },
      { id: 'domicilio_empresa_a', label: 'Domicilio Empresa A', tipo: 'text', requerido: true },
      { id: 'rep_legal_a', label: 'Nombre Representante Legal Empresa A', tipo: 'text', requerido: true },
      { id: 'rut_rep_a', label: 'RUT Representante Legal', tipo: 'text', requerido: true },
      { id: 'cargo_rep_a', label: 'Cargo del Representante', tipo: 'select', opciones: ['Gerente General', 'Gerente', 'Director', 'Apoderado', 'Representante Legal'], requerido: true },
      { id: 'rol_empresa_a', label: 'Denominación Empresa A', tipo: 'select', opciones: ['PRESTADOR', 'VENDEDOR', 'PROVEEDOR', 'ARRENDADOR', 'LICENCIANTE', 'CONTRATANTE'], requerido: true },
      { id: 'razon_social_b', label: 'Razón Social Empresa B', tipo: 'text', requerido: true },
      { id: 'rut_empresa_b', label: 'RUT Empresa B', tipo: 'text', requerido: true },
      { id: 'domicilio_empresa_b', label: 'Domicilio Empresa B', tipo: 'text', requerido: true },
      { id: 'rep_legal_b', label: 'Nombre Representante Legal Empresa B', tipo: 'text', requerido: true },
      { id: 'rut_rep_b', label: 'RUT Representante Legal B', tipo: 'text', requerido: true },
      { id: 'cargo_rep_b', label: 'Cargo del Representante B', tipo: 'select', opciones: ['Gerente General', 'Gerente', 'Director', 'Apoderado', 'Representante Legal'], requerido: true },
      { id: 'rol_empresa_b', label: 'Denominación Empresa B', tipo: 'select', opciones: ['CLIENTE', 'COMPRADOR', 'CONTRATANTE', 'ARRENDATARIO', 'LICENCIATARIO'], requerido: true },
      { id: 'ciudad_contrato', label: 'Ciudad', tipo: 'text', default: 'Santiago', requerido: true },
      { id: 'fecha_contrato', label: 'Fecha', tipo: 'date', requerido: true },
    ],
    generarTexto: (v) => `COMPARECEN: En ${v.ciudad_contrato || 'Santiago'}, a ${v.fecha_contrato ? new Date(v.fecha_contrato).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : '[FECHA]'}, comparecen:

Por una parte, ${v.razon_social_a || '[EMPRESA A]'}, RUT N° ${v.rut_empresa_a || '[RUT]'}, sociedad del giro de su nombre, domiciliada en ${v.domicilio_empresa_a || '[DOMICILIO]'}, representada legalmente por don/doña ${v.rep_legal_a || '[REPRESENTANTE]'}, RUT N° ${v.rut_rep_a || '[RUT REP]'}, en calidad de ${v.cargo_rep_a || 'Gerente General'}, con domicilio en el indicado; en adelante, el/la "${v.rol_empresa_a || 'PRESTADOR'}"; y

Por otra parte, ${v.razon_social_b || '[EMPRESA B]'}, RUT N° ${v.rut_empresa_b || '[RUT]'}, sociedad del giro de su nombre, domiciliada en ${v.domicilio_empresa_b || '[DOMICILIO]'}, representada legalmente por don/doña ${v.rep_legal_b || '[REPRESENTANTE]'}, RUT N° ${v.rut_rep_b || '[RUT REP]'}, en calidad de ${v.cargo_rep_b || 'Gerente General'}; en adelante, el/la "${v.rol_empresa_b || 'CLIENTE'}".

Ambas partes actúan en nombre y representación de sus respectivas sociedades, con facultades suficientes para obligarlas en virtud del presente instrumento, y han convenido en celebrar el presente contrato al tenor de las siguientes cláusulas:`,
    normasAplicables: ['Art. 1438 CC', 'Art. 8 Ley 18.046 (SA)', 'Art. 396 CdC (representación)'],
    riesgos: ['Representante sin facultades suficientes genera inoponibilidad del contrato a la empresa.'],
    mejoras: ['Adjuntar copia del certificado de vigencia de la sociedad.', 'Verificar en el Registro de Comercio que el representante tiene poder vigente.'],
  },

  // ─────────────────────────────────────────────────────────────
  // OBJETO
  // ─────────────────────────────────────────────────────────────
  {
    id: 'objeto-servicios',
    categoria: 'Objeto y Alcance',
    nombre: 'Objeto del Contrato — Prestación de Servicios',
    tiposContrato: ['Prestación de Servicios', 'Arrendamiento de Servicios', 'General / Otro'],
    descripcionSimple: 'Define exactamente qué servicios se van a prestar, dejando claro qué está incluido y qué no.',
    explicacion: 'Esta cláusula es el corazón del contrato. Una descripción vaga del servicio es la principal causa de disputas. Debe ser tan específica que no quepan interpretaciones distintas.',
    esObligatoria: true,
    campos: [
      { id: 'descripcion_servicio', label: 'Describe el servicio en tus propias palabras', tipo: 'textarea', placeholder: 'Ej: Diseño y desarrollo de un sitio web con 5 páginas, sistema de contacto y panel de administración...', requerido: true },
      { id: 'entregables', label: 'Entregables específicos (separados por coma)', tipo: 'textarea', placeholder: 'Ej: Diseño en Figma, código fuente, manual de uso, capacitación de 2 horas', requerido: true },
      { id: 'lugar_servicio', label: 'Lugar de prestación del servicio', tipo: 'text', placeholder: 'Ej: Oficinas del Cliente / De forma remota / Ambas', requerido: false },
      { id: 'exclusiones', label: 'Qué NO incluye (exclusiones)', tipo: 'textarea', placeholder: 'Ej: No incluye hosting, dominio, ni soporte post-entrega', requerido: false },
    ],
    generarTexto: (v) => `OBJETO DEL CONTRATO. Por el presente instrumento, el PRESTADOR se obliga a prestar al CLIENTE los siguientes servicios: ${v.descripcion_servicio || '[DESCRIPCIÓN DEL SERVICIO]'}.

Los entregables específicos que comprenden el servicio son los siguientes: ${v.entregables || '[ENTREGABLES]'}.

${v.lugar_servicio ? `El servicio se prestará en: ${v.lugar_servicio}.` : ''}

${v.exclusiones ? `Quedan expresamente excluidos del presente contrato: ${v.exclusiones}. Cualquier trabajo adicional a los expresamente señalados deberá ser convenido por escrito mediante un addendum al presente contrato, pudiendo el PRESTADOR cobrar honorarios adicionales por dichos trabajos.` : 'Cualquier servicio no expresamente descrito en la presente cláusula quedará excluido del objeto de este contrato y podrá ser cotizado separadamente.'}

Las partes declaran que el PRESTADOR actúa como contratista independiente, sin vínculo de subordinación ni dependencia con el CLIENTE, siendo el único responsable de la forma en que organiza y ejecuta los servicios, con sus propios medios y a su propio riesgo técnico y profesional.`,
    normasAplicables: ['Art. 1461 CC — Objeto determinado', 'Art. 1560 CC — Interpretación por intención', 'Art. 2006 CC — Arrendamiento de servicios'],
    riesgos: ['Objeto vago permite al prestador entregar cualquier cosa.', 'Sin exclusiones, el cliente puede exigir trabajos no cotizados.'],
    mejoras: ['Agregar anexo técnico con especificaciones detalladas.', 'Definir criterios de aceptación (cómo saber cuándo el trabajo está "bien hecho").', 'Especificar estándares de calidad o normas aplicables.'],
  },
  {
    id: 'objeto-compraventa',
    categoria: 'Objeto y Alcance',
    nombre: 'Objeto del Contrato — Compraventa',
    tiposContrato: ['Compraventa', 'Suministro'],
    descripcionSimple: 'Describe con exactitud qué se está comprando y vendiendo.',
    explicacion: 'La compraventa requiere que la cosa vendida sea determinada o determinable. Si hay confusión sobre qué se vende, el contrato puede ser nulo.',
    esObligatoria: true,
    campos: [
      { id: 'descripcion_bien', label: 'Descripción detallada del bien', tipo: 'textarea', placeholder: 'Ej: Un automóvil marca Toyota, modelo Corolla, año 2022, patente AB-CD-12, color blanco, motor 1.8...', requerido: true },
      { id: 'cantidad', label: 'Cantidad / Unidades', tipo: 'text', placeholder: 'Ej: 1 unidad / 500 kg / 100 metros', requerido: false },
      { id: 'estado_bien', label: 'Estado del bien', tipo: 'select', opciones: ['Nuevo', 'Usado — Buen estado', 'Usado — Estado según se señala', 'Reacondicionado'], requerido: true },
      { id: 'accesorios', label: 'Accesorios o documentos incluidos', tipo: 'textarea', placeholder: 'Ej: Manual de usuario, garantía de fábrica, 2 llaves originales, revisión técnica al día', requerido: false },
      { id: 'garantias_ocultos', label: '¿Incluye garantía de vicios redhibitorios?', tipo: 'select', opciones: ['Sí, conforme al Art. 1857 CC', 'No, el comprador acepta el bien en estado actual'], requerido: true, default: 'Sí, conforme al Art. 1857 CC' },
    ],
    generarTexto: (v) => `OBJETO DEL CONTRATO. Por el presente instrumento, el VENDEDOR transfiere al COMPRADOR el dominio, posesión y mera tenencia de: ${v.descripcion_bien || '[DESCRIPCIÓN DEL BIEN]'}${v.cantidad ? `, en una cantidad de ${v.cantidad}` : ''}.

El bien se entrega en estado: ${v.estado_bien || '[ESTADO]'}.

${v.accesorios ? `La compraventa comprende los siguientes accesorios y documentos: ${v.accesorios}.` : ''}

${v.garantias_ocultos === 'No, el comprador acepta el bien en estado actual'
  ? 'El COMPRADOR declara conocer el estado actual del bien vendido, aceptándolo en las condiciones en que se encuentra y renunciando expresamente a la acción redhibitoria y a la acción quanti minoris por vicios o defectos que pudieren detectarse con posterioridad, siendo el precio convenido en consideración a dicho estado.'
  : 'El VENDEDOR garantiza que el bien objeto de esta compraventa está libre de vicios ocultos que lo hagan inútil para el uso al que se le destina o que disminuyan de tal modo su utilidad, conforme a los artículos 1857 y siguientes del Código Civil.'
}

El VENDEDOR garantiza que es dueño del bien vendido y que éste se encuentra libre de gravámenes, prohibiciones, hipotecas, embargos u otras limitaciones al dominio que pudieren afectar su libre transferencia.`,
    normasAplicables: ['Art. 1793 CC — Definición compraventa', 'Art. 1814 CC — Objeto lícito', 'Art. 1857 CC — Vicios redhibitorios'],
    riesgos: ['Sin descripción precisa, el vendedor puede entregar una variante inferior del bien.', 'Sin saneamiento de vicios ocultos, el comprador asume riesgos desconocidos.'],
    mejoras: ['Para inmuebles: incluir número de rol de avalúo y fojas en el Conservador de Bienes Raíces.', 'Para vehículos: adjuntar certificado de inscripción del Registro de Vehículos Motorizados.'],
  },

  // ─────────────────────────────────────────────────────────────
  // PRECIO Y PAGO
  // ─────────────────────────────────────────────────────────────
  {
    id: 'precio-servicios-uf',
    categoria: 'Precio y Pago',
    nombre: 'Precio y Forma de Pago — En UF',
    tiposContrato: ['Prestación de Servicios', 'Arrendamiento de Servicios', 'Arrendamiento de Inmueble'],
    descripcionSimple: 'Establece cuánto se va a pagar, en qué moneda y cuándo. En UF el monto mantiene su valor real.',
    explicacion: 'Pactar en UF protege los honorarios de la inflación. El valor se actualiza diariamente. Es la práctica recomendada en contratos de larga duración o de alto valor.',
    campos: [
      { id: 'monto_uf', label: 'Monto en UF', tipo: 'number', placeholder: 'Ej: 50', requerido: true },
      { id: 'modalidad_pago', label: 'Modalidad de pago', tipo: 'select', opciones: ['Pago único al inicio', 'Pago único a la entrega', 'Pago único en [X] días desde firma', '50% al inicio y 50% a la entrega', 'Cuotas mensuales iguales', 'Según hitos (milestones)', 'Mensual por el mes vencido'], requerido: true },
      { id: 'plazo_pago', label: 'Plazo de pago (días desde la factura)', tipo: 'number', placeholder: 'Ej: 30', default: '30', requerido: true },
      { id: 'num_cuotas', label: 'N° de cuotas (si aplica)', tipo: 'number', placeholder: 'Ej: 3', requerido: false },
      { id: 'metodo_pago', label: 'Método de pago', tipo: 'select', opciones: ['Transferencia bancaria', 'Cheque nominativo', 'Efectivo', 'Tarjeta de crédito/débito', 'Plataforma de pago online'], requerido: true },
      { id: 'datos_bancarios', label: 'Datos bancarios del receptor (opcional)', tipo: 'textarea', placeholder: 'Banco: ..., Cuenta Corriente N°: ..., Titular: ..., RUT: ...', requerido: false },
      { id: 'interes_mora', label: 'Interés por mora', tipo: 'select', opciones: ['No aplica', '1% mensual', '1,5% mensual (máximo legal pymes)', '2% mensual', 'Interés máximo convencional'], default: '1,5% mensual (máximo legal pymes)', requerido: true },
    ],
    generarTexto: (v) => `PRECIO Y FORMA DE PAGO. El precio total de los servicios objeto del presente contrato es la suma de ${v.monto_uf || '[X]'} Unidades de Fomento (UF), equivalente a la fecha de suscripción del presente instrumento al valor de la UF publicado por la Comisión para el Mercado Financiero (CMF), el que será pagado en pesos chilenos al valor de la UF del día del pago efectivo.

La forma de pago será la siguiente: ${v.modalidad_pago || '[MODALIDAD]'}${v.num_cuotas ? `, en ${v.num_cuotas} cuotas` : ''}.

El pago deberá efectuarse dentro de los ${v.plazo_pago || '30'} días corridos contados desde la fecha de emisión de la respectiva factura o boleta de honorarios, mediante ${v.metodo_pago || '[MÉTODO]'}.

${v.datos_bancarios ? `Los datos para efectuar la transferencia son los siguientes: ${v.datos_bancarios}.` : ''}

En caso de retardo o mora en el pago, las sumas adeudadas devengarán ${v.interes_mora === 'No aplica' ? 'los intereses legales correspondientes conforme al artículo 1559 del Código Civil.' : `un interés del ${v.interes_mora} sobre el saldo insoluto, sin perjuicio del derecho del PRESTADOR a exigir el cumplimiento íntegro de las obligaciones de pago mediante las acciones legales correspondientes.`}

El PRESTADOR podrá suspender la prestación de los servicios si el CLIENTE mantiene facturas pendientes de pago por más de quince (15) días hábiles desde su vencimiento, previa comunicación escrita con tres (3) días hábiles de anticipación, sin que dicha suspensión constituya incumplimiento de sus obligaciones contractuales.`,
    normasAplicables: ['Art. 1569 CC — Pago en mora', 'Art. 1559 CC — Intereses', 'Art. 4 bis Ley 20.416 — Pago oportuno 60 días PYME'],
    riesgos: ['Sin cláusula de interés moratorio, el recupero de deudas es más difícil.', 'Sin plazo definido de pago, rige el pago inmediato (Art. 1551 CC).'],
    mejoras: ['Para contratos largos, incluir reajuste anual por IPC además de la UF.', 'Establecer emisión automática de documentos tributarios al cumplirse cada hito.'],
  },
  {
    id: 'precio-servicios-clp',
    categoria: 'Precio y Pago',
    nombre: 'Precio y Forma de Pago — En Pesos Chilenos (CLP)',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Fija el precio en pesos chilenos con fecha y forma de pago.',
    explicacion: 'Útil para contratos de corto plazo. En contratos largos se recomienda la UF para proteger contra la inflación.',
    campos: [
      { id: 'monto_clp', label: 'Monto total en pesos ($)', tipo: 'currency', placeholder: 'Ej: 1500000', requerido: true },
      { id: 'modalidad_pago', label: 'Modalidad', tipo: 'select', opciones: ['Pago único al inicio', 'Pago único a la entrega', '50% al inicio y 50% a la entrega', 'Cuotas mensuales', 'A 30 días', 'A 60 días'], requerido: true },
      { id: 'plazo_pago', label: 'Plazo (días corridos desde la factura)', tipo: 'number', default: '30', requerido: true },
      { id: 'metodo_pago', label: 'Método', tipo: 'select', opciones: ['Transferencia bancaria', 'Cheque', 'Efectivo', 'Plataforma online'], requerido: true },
      { id: 'incluye_iva', label: '¿El precio incluye IVA?', tipo: 'select', opciones: ['El precio indicado es neto (más IVA 19%)', 'El precio indicado incluye IVA', 'No aplica IVA — boleta de honorarios'], requerido: true },
    ],
    generarTexto: (v) => `PRECIO Y FORMA DE PAGO. El precio total de los servicios/bienes objeto del presente contrato es la suma de $${v.monto_clp ? parseInt(v.monto_clp).toLocaleString('es-CL') : '[MONTO]'} (${v.incluye_iva || 'indicar si incluye IVA'}), pagaderos en moneda de curso legal.

La forma de pago será la siguiente: ${v.modalidad_pago || '[MODALIDAD]'}. El pago deberá realizarse dentro de los ${v.plazo_pago || '30'} días corridos desde la fecha de emisión del respectivo documento tributario, mediante ${v.metodo_pago || '[MÉTODO]'}.

El precio convenido se entenderá definitivo y no estará sujeto a reajuste, salvo que las partes así lo convengan expresamente por escrito. Cualquier modificación del precio requerirá acuerdo escrito firmado por ambas partes.

En caso de retardo o mora en el pago, las sumas adeudadas devengarán el interés máximo convencional vigente, determinado conforme a la Ley N° 18.010 sobre Operaciones de Crédito de Dinero, sin necesidad de requerimiento previo.`,
    normasAplicables: ['Art. 1559 CC — Intereses moratorios', 'Ley 18.010 — Operaciones de crédito', 'Art. 4 bis Ley 20.416'],
    riesgos: ['En contratos largos, precio fijo en CLP pierde valor real por inflación.'],
    mejoras: ['Para contratos >6 meses, considerar indexación al IPC.'],
  },

  // ─────────────────────────────────────────────────────────────
  // OBLIGACIONES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'obligaciones-prestador',
    categoria: 'Obligaciones',
    nombre: 'Obligaciones del Prestador / Vendedor',
    tiposContrato: ['Prestación de Servicios', 'Compraventa', 'Suministro', 'Arrendamiento de Servicios'],
    descripcionSimple: 'Lista todo lo que quien presta el servicio o vende el bien debe hacer y garantizar.',
    explicacion: 'Sin obligaciones claras, cada parte interpreta lo que debe hacer de forma distinta. Una lista detallada previene el 80% de los conflictos.',
    campos: [
      { id: 'plazo_ejecucion', label: 'Plazo para cumplir el servicio/entrega', tipo: 'text', placeholder: 'Ej: 30 días hábiles desde la firma / 3 meses', requerido: true },
      { id: 'estandar_calidad', label: 'Estándar de calidad exigido', tipo: 'text', placeholder: 'Ej: Normas ISO 9001 / Mejores prácticas del sector / Descripción propia', requerido: false },
      { id: 'obligaciones_adicionales', label: 'Obligaciones adicionales específicas', tipo: 'textarea', placeholder: 'Ej: Informar avances semanales, mantener disponibilidad 24/7, asignar un coordinador dedicado...', requerido: false },
      { id: 'sla', label: 'Nivel de servicio (SLA) si aplica', tipo: 'text', placeholder: 'Ej: Tiempo de respuesta máximo 4 horas hábiles para incidencias críticas', requerido: false },
    ],
    generarTexto: (v) => `OBLIGACIONES DEL PRESTADOR. Sin perjuicio de las demás obligaciones establecidas en este contrato, el PRESTADOR se obliga especialmente a:

a) Ejecutar los servicios objeto de este contrato dentro del plazo de ${v.plazo_ejecucion || '[PLAZO]'}, contado desde la suscripción del presente instrumento o desde la fecha en que el CLIENTE entregue toda la información necesaria para el inicio de los trabajos, lo que ocurra último.

b) Ejecutar los servicios con la diligencia, cuidado y estándar de un profesional competente en su ramo${v.estandar_calidad ? `, conforme a ${v.estandar_calidad}` : ''}, aplicando las mejores prácticas vigentes en el sector.

c) Informar al CLIENTE sobre cualquier circunstancia que pueda afectar el plazo o la calidad de los servicios, con la mayor anticipación posible.

${v.sla ? `d) Cumplir los siguientes niveles de servicio (SLA): ${v.sla}.` : ''}

${v.obligaciones_adicionales ? `d${v.sla ? 'e' : ')'} Las siguientes obligaciones adicionales: ${v.obligaciones_adicionales}.` : ''}

e) Mantener la confidencialidad de toda la información del CLIENTE a la que tenga acceso con ocasión de la ejecución del presente contrato.

f) Responder por los daños que cause al CLIENTE por incumplimiento culpable o doloso de sus obligaciones, conforme a los artículos 1546 y 1556 del Código Civil.`,
    normasAplicables: ['Art. 1546 CC — Buena fe', 'Art. 1556 CC — Indemnización', 'Art. 2006 CC — Arrendamiento servicios'],
    riesgos: ['Sin plazo definido, la obligación es exigible "de inmediato" (Art. 1551 N°3 CC).'],
    mejoras: ['Incluir un Anexo de Especificaciones Técnicas para servicios complejos.', 'Definir criterios objetivos de aceptación de cada entregable.'],
  },
  {
    id: 'obligaciones-cliente',
    categoria: 'Obligaciones',
    nombre: 'Obligaciones del Cliente / Comprador',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Define qué debe hacer y proporcionar el cliente para que el prestador pueda cumplir.',
    explicacion: 'El cliente también tiene obligaciones. Si no cumple (no entrega información, no paga), el prestador puede suspender el servicio o terminar el contrato.',
    campos: [
      { id: 'info_necesaria', label: 'Información o accesos que debe proveer el cliente', tipo: 'textarea', placeholder: 'Ej: Credenciales de acceso al servidor, imágenes, textos, bases de datos...', requerido: false },
      { id: 'plazo_respuesta_cliente', label: 'Plazo para responder solicitudes del prestador', tipo: 'text', placeholder: 'Ej: 3 días hábiles', default: '5 días hábiles', requerido: true },
      { id: 'persona_contacto', label: '¿Debe designar un coordinador/contacto?', tipo: 'select', opciones: ['Sí', 'No'], default: 'Sí', requerido: true },
    ],
    generarTexto: (v) => `OBLIGACIONES DEL CLIENTE. Sin perjuicio de las demás obligaciones establecidas en este contrato, el CLIENTE se obliga especialmente a:

a) Pagar el precio en la forma y plazo estipulados en el presente contrato.

b) Proporcionar al PRESTADOR, dentro de los cinco (5) días hábiles siguientes a la suscripción del presente instrumento, toda la información, documentación, accesos y materiales necesarios para la correcta ejecución de los servicios${v.info_necesaria ? `, incluyendo: ${v.info_necesaria}` : ''}.

c) Responder las consultas y solicitudes de información del PRESTADOR dentro de un plazo máximo de ${v.plazo_respuesta_cliente || '5 días hábiles'} contados desde su recepción. El incumplimiento de este plazo producirá la suspensión automática del plazo de ejecución del PRESTADOR por el tiempo equivalente al retardo.

${v.persona_contacto === 'Sí' ? 'd) Designar, al momento de la suscripción del contrato, a un coordinador con suficientes atribuciones para tomar decisiones relacionadas con el proyecto, a quien el PRESTADOR podrá dirigir sus comunicaciones y consultas.\n\ne)' : 'd)'} Aceptar formalmente los entregables dentro del plazo que las partes convengan al momento de cada entrega. Si el CLIENTE no emite observaciones fundadas dentro de dicho plazo, el entregable se tendrá por aceptado tácitamente.

f) Colaborar de buena fe en la ejecución del contrato, facilitando al PRESTADOR el acceso a las instalaciones, sistemas e información que razonablemente requiera para el cumplimiento de sus obligaciones.`,
    normasAplicables: ['Art. 1546 CC — Buena fe', 'Art. 1552 CC — Mora del acreedor'],
    riesgos: ['Sin obligación de entregar información, el prestador no puede justificar atrasos causados por el cliente.'],
    mejoras: ['Establecer un cronograma de reuniones de avance.', 'Definir la persona de contacto con nombre y email en un anexo.'],
  },

  // ─────────────────────────────────────────────────────────────
  // CONFIDENCIALIDAD
  // ─────────────────────────────────────────────────────────────
  {
    id: 'confidencialidad-estandar',
    categoria: 'Confidencialidad',
    nombre: 'Confidencialidad y Secreto Profesional',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Prohíbe a ambas partes revelar información del otro a terceros. Protege datos sensibles, know-how y estrategias de negocio.',
    explicacion: 'Una cláusula NDA (Non-Disclosure Agreement) integrada al contrato protege la información sensible. Sin ella, cualquier persona que acceda a datos confidenciales puede compartirlos libremente.',
    campos: [
      { id: 'plazo_confidencialidad', label: 'Duración de la obligación de confidencialidad', tipo: 'select', opciones: ['1 año post término del contrato', '2 años post término del contrato', '3 años post término del contrato', '5 años post término del contrato', 'Indefinido (solo para secretos comerciales genuinos)'], default: '3 años post término del contrato', requerido: true },
      { id: 'info_confidencial_ejemplos', label: 'Tipos de información confidencial (ejemplos)', tipo: 'textarea', placeholder: 'Ej: planes de negocio, listas de clientes, algoritmos, fórmulas, estrategias de marketing...', requerido: false },
      { id: 'incluye_datos_personales', label: '¿Se manejan datos personales de terceros?', tipo: 'select', opciones: ['Sí — incluir obligación Ley 19.628', 'No'], requerido: true },
    ],
    generarTexto: (v) => `CONFIDENCIALIDAD. Cada una de las Partes mantendrá en estricta reserva y confidencialidad toda la información de la otra Parte a la que acceda con ocasión o en ejecución del presente contrato, incluyendo, de manera enunciativa mas no taxativa: información técnica, comercial, financiera, jurídica, know-how, datos de clientes, estrategias, precios, procedimientos, proyectos${v.info_confidencial_ejemplos ? `, ${v.info_confidencial_ejemplos}` : ''}, y cualquier otra información designada como confidencial o que razonablemente deba entenderse como tal por su naturaleza o por las circunstancias de su divulgación (en adelante, la "Información Confidencial").

La obligación de confidencialidad permanecerá vigente durante toda la ejecución del presente contrato y por ${v.plazo_confidencialidad || '3 años post término del contrato'}, incluyendo cualquier prórroga del mismo.

Las obligaciones de confidencialidad no se aplicarán a información que: (i) sea o llegue a ser de dominio público sin culpa de la parte receptora; (ii) estuviese en posesión legítima de la parte receptora con anterioridad a su divulgación; (iii) sea recibida legítimamente de un tercero sin restricción de confidencialidad; o (iv) deba ser divulgada por mandato de autoridad competente o en virtud de una obligación legal, caso en el cual la parte obligada deberá notificar previamente a la otra con la mayor antelación posible.

Las partes no podrán utilizar la Información Confidencial para propósitos distintos a los del presente contrato, ni divulgarla a sus propios empleados, colaboradores o asesores, salvo a aquellos que tengan necesidad de conocerla para los fines del contrato y que se encuentren vinculados por obligaciones de confidencialidad equivalentes.

${v.incluye_datos_personales === 'Sí — incluir obligación Ley 19.628'
? `Tratamiento de Datos Personales: En el evento que la ejecución del presente contrato implique el tratamiento de datos personales de terceros, las partes se obligan a cumplir estrictamente con lo dispuesto en la Ley N° 19.628 sobre Protección de la Vida Privada y sus modificaciones, así como con las instrucciones del Consejo para la Transparencia. Las partes adoptarán las medidas de seguridad técnicas y organizativas necesarias para proteger dichos datos contra pérdida, acceso no autorizado, divulgación, alteración o destrucción accidental o ilícita.`
: ''}

El incumplimiento de esta cláusula dará derecho a la parte afectada a exigir el cese inmediato de la divulgación y a demandar la correspondiente indemnización de perjuicios, incluyendo daño emergente, lucro cesante y daño moral, sin perjuicio de las acciones penales que pudieren corresponder.`,
    normasAplicables: ['Art. 1546 CC — Buena fe', 'Ley 19.628 — Datos personales', 'Art. 284 CdC — Secreto industrial'],
    riesgos: ['Sin NDA, el prestador puede usar el know-how del cliente con terceros o competidores.'],
    mejoras: ['Para startups y tecnología, extender a "información relacionada con producto, código fuente e inversiones".', 'Incluir multa específica por violación para mayor efecto disuasorio.'],
  },

  // ─────────────────────────────────────────────────────────────
  // PROPIEDAD INTELECTUAL
  // ─────────────────────────────────────────────────────────────
  {
    id: 'propiedad-intelectual',
    categoria: 'Propiedad Intelectual',
    nombre: 'Propiedad Intelectual y Derechos de Autor',
    tiposContrato: ['Prestación de Servicios', 'Licencia de Software', 'General / Otro'],
    descripcionSimple: 'Define a quién pertenecen los productos, diseños, código u obras creadas durante el contrato.',
    explicacion: 'En Chile, el creador de una obra es dueño por defecto. Si el cliente paga para que le hagan una web o un diseño, sin esta cláusula el creador puede seguir siendo dueño. Esta cláusula transfiere esos derechos al cliente.',
    campos: [
      { id: 'titular_pi', label: '¿A quién pertenecerán los derechos?', tipo: 'select', opciones: ['Al CLIENTE (transferencia total)', 'Al PRESTADOR (licencia al cliente)', 'Compartido (co-autoría)', 'Al CLIENTE solo los entregables, PRESTADOR conserva herramientas propias'], requerido: true },
      { id: 'descripcion_obras', label: 'Descripción de las obras / trabajos creados', tipo: 'textarea', placeholder: 'Ej: diseños gráficos, código fuente, reportes, fotografías, redacción de textos...', requerido: true },
      { id: 'herramientas_previas', label: 'Herramientas/librerías preexistentes del prestador que se usarán', tipo: 'textarea', placeholder: 'Ej: framework propio, librería de componentes, metodología patentada...', requerido: false },
    ],
    generarTexto: (v) => `PROPIEDAD INTELECTUAL. ${
v.titular_pi === 'Al CLIENTE (transferencia total)'
? `El PRESTADOR transfiere al CLIENTE, de forma definitiva, exclusiva y sin limitación territorial ni temporal, la totalidad de los derechos de propiedad intelectual sobre las obras, trabajos y creaciones generados en virtud del presente contrato, incluyendo: ${v.descripcion_obras || '[OBRAS]'} (las "Obras"). Dicha transferencia se regirá por lo dispuesto en la Ley N° 17.336 sobre Propiedad Intelectual y comprende el derecho de reproducción, distribución, comunicación pública, transformación, traducción y cualquier otra modalidad de explotación. El PRESTADOR no podrá utilizar, licenciar ni exhibir las Obras, ni total ni parcialmente, sin el consentimiento previo y escrito del CLIENTE.`
: v.titular_pi === 'Al PRESTADOR (licencia al cliente)'
? `Los derechos de propiedad intelectual sobre las obras, trabajos y creaciones derivados del presente contrato, incluyendo ${v.descripcion_obras || '[OBRAS]'}, pertenecerán al PRESTADOR. El PRESTADOR otorga al CLIENTE una licencia de uso no exclusiva, intransferible, sin derecho a sublicenciar, limitada al territorio de la República de Chile y vigente durante la duración de este contrato o de la relación comercial entre las partes, para utilizar dichas obras únicamente con los fines para los que fueron encargadas.`
: `Las partes acuerdan que los derechos de propiedad intelectual sobre los entregables específicamente encargados y pagados por el CLIENTE conforme al presente contrato se transferirán al CLIENTE una vez recibido el pago íntegro del precio. El PRESTADOR conservará la titularidad sobre sus herramientas, metodologías, librerías y desarrollos preexistentes${v.herramientas_previas ? `, incluyendo: ${v.herramientas_previas}` : ''}, concediendo al CLIENTE únicamente una licencia de uso no exclusiva sobre aquellas que sean necesarias para el uso de los entregables.`
}

El PRESTADOR garantiza que las obras entregadas son originales y no infringen derechos de propiedad intelectual de terceros, respondiendo de saneamiento en caso contrario.`,
    normasAplicables: ['Ley 17.336 — Propiedad Intelectual', 'Art. 8 Ley 17.336 — Obra por encargo', 'Ley 19.039 — Propiedad Industrial'],
    riesgos: ['Sin esta cláusula, el diseñador o programador puede reclamar autoría y uso de los entregables.'],
    mejoras: ['Para software, especificar si se entrega el código fuente o solo el binario/ejecutable.'],
  },

  // ─────────────────────────────────────────────────────────────
  // VIGENCIA Y TERMINACIÓN
  // ─────────────────────────────────────────────────────────────
  {
    id: 'vigencia-plazo',
    categoria: 'Vigencia y Terminación',
    nombre: 'Vigencia y Plazo del Contrato',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Establece desde cuándo y hasta cuándo tiene efecto el contrato, y qué pasa al vencer.',
    explicacion: 'Un contrato sin plazo es indefinido y puede terminar en cualquier momento. Definir la vigencia da certeza a ambas partes sobre sus obligaciones.',
    campos: [
      { id: 'fecha_inicio', label: 'Fecha de inicio', tipo: 'date', requerido: true },
      { id: 'tipo_duracion', label: 'Tipo de duración', tipo: 'select', opciones: ['Plazo fijo (termina en fecha determinada)', 'Por proyecto/hito específico', 'Indefinido con aviso previo para terminar', 'Renovación automática'], requerido: true },
      { id: 'duracion', label: 'Duración (si es plazo fijo)', tipo: 'text', placeholder: 'Ej: 12 meses / hasta el 31/12/2025', requerido: false },
      { id: 'dias_aviso_termino', label: 'Días de aviso para no renovar o terminar', tipo: 'number', placeholder: '30', default: '30', requerido: false },
    ],
    generarTexto: (v) => `VIGENCIA. El presente contrato entrará en vigencia el día ${v.fecha_inicio ? new Date(v.fecha_inicio).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : '[FECHA INICIO]'} y tendrá ${
v.tipo_duracion === 'Indefinido con aviso previo para terminar'
? `una duración indefinida, pudiendo cualquiera de las partes ponerle término en cualquier tiempo mediante aviso escrito con ${v.dias_aviso_termino || '30'} días corridos de anticipación entregado a la otra parte por cualquier medio que permita dejar constancia de su recepción. Durante dicho período de aviso, las partes deberán seguir cumpliendo íntegramente sus obligaciones contractuales.`
: v.tipo_duracion === 'Renovación automática'
? `una duración inicial de ${v.duracion || '[PLAZO]'} contado desde su entrada en vigencia, renovándose automáticamente por períodos iguales y sucesivos, salvo que cualquiera de las partes notifique a la otra su voluntad de no renovar con al menos ${v.dias_aviso_termino || '30'} días corridos de anticipación al vencimiento del período en curso.`
: v.tipo_duracion === 'Por proyecto/hito específico'
? `una duración equivalente al tiempo necesario para la ejecución completa del objeto descrito en la cláusula anterior, finalizando con la entrega y aceptación de los últimos entregables o con el cumplimiento íntegro de las obligaciones de ambas partes, lo que ocurra último.`
: `una duración de ${v.duracion || '[PLAZO]'} contado desde su entrada en vigencia, sin perjuicio de las causales de terminación anticipada establecidas en este contrato.`
}

El vencimiento del plazo no afectará las obligaciones que por su naturaleza deban sobrevivir al término del contrato, tales como las de pago pendiente, confidencialidad, propiedad intelectual y resolución de conflictos.`,
    normasAplicables: ['Art. 1545 CC — Fuerza obligatoria', 'Art. 1554 CC — Promesa de contrato'],
    riesgos: ['Sin cláusula de prórroga, el contrato termina sin posibilidad de continuar automáticamente.'],
    mejoras: ['Establecer un procedimiento de "offboarding" o transferencia al terminar el contrato.'],
  },
  {
    id: 'terminacion-anticipada',
    categoria: 'Vigencia y Terminación',
    nombre: 'Terminación Anticipada por Incumplimiento',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Define en qué casos se puede terminar el contrato antes de plazo y qué consecuencias tiene.',
    explicacion: 'Sin esta cláusula, el único camino para terminar por incumplimiento es la acción judicial de resolución (Art. 1489 CC), que puede tardar años. Con esta cláusula, se puede terminar extrajudicialmente.',
    campos: [
      { id: 'plazo_subsanar', label: 'Días para subsanar el incumplimiento antes de terminar', tipo: 'number', placeholder: '10', default: '10', requerido: true },
      { id: 'causales_graves', label: 'Causales de terminación inmediata (sin plazo de subsanación)', tipo: 'textarea', placeholder: 'Ej: quiebra, fraude, violación grave de confidencialidad, daño doloso...', requerido: false },
      { id: 'indemnizacion_anticipada', label: '¿Se debe pagar algo por terminación anticipada sin causa?', tipo: 'select', opciones: ['Sí — equivalente a 1 mes de honorarios', 'Sí — equivalente a honorarios pendientes', 'Sí — monto a acordar entre partes', 'No — solo se paga lo devengado hasta la fecha'], requerido: true },
    ],
    generarTexto: (v) => `TERMINACIÓN ANTICIPADA POR INCUMPLIMIENTO. El presente contrato podrá ser terminado anticipadamente por cualquiera de las partes en los siguientes casos:

a) TERMINACIÓN POR INCUMPLIMIENTO: En caso de incumplimiento grave de las obligaciones del presente contrato por una de las partes, la parte afectada podrá notificar por escrito a la parte incumplidora, indicando la naturaleza del incumplimiento y otorgándole un plazo de ${v.plazo_subsanar || '10'} días hábiles para subsanarlo. Si transcurrido dicho plazo el incumplimiento no hubiere sido subsanado, la parte afectada podrá declarar resuelto el contrato mediante comunicación escrita, sin necesidad de intervención judicial, sin perjuicio de su derecho a exigir la correspondiente indemnización de perjuicios.

b) TERMINACIÓN INMEDIATA: Sin necesidad del plazo de subsanación anterior, el contrato podrá ser terminado de inmediato en caso de: (i) declaración de quiebra o insolvencia manifiesta de cualquiera de las partes; (ii) comisión de fraude o dolo en la ejecución del contrato; (iii) violación grave de la cláusula de confidencialidad${v.causales_graves ? `; (iv) ${v.causales_graves}` : ''}.

c) TERMINACIÓN UNILATERAL SIN CAUSA: Cualquiera de las partes podrá poner término al contrato sin expresión de causa, mediante aviso escrito con ${v.dias_aviso_termino || '30'} días de anticipación, pagando la contraparte afectada ${v.indemnizacion_anticipada || 'los honorarios devengados hasta la fecha de término más los daños efectivamente acreditados'}.

d) EFECTOS DEL TÉRMINO: Terminado el contrato por cualquier causa, las partes procederán a liquidar las prestaciones pendientes. El PRESTADOR entregará al CLIENTE todos los trabajos, avances y materiales realizados hasta la fecha de término, proporcionalmente al precio ya pagado.`,
    normasAplicables: ['Art. 1489 CC — Condición resolutoria', 'Art. 1545 CC — Fuerza obligatoria', 'Ley 19.496 Art. 16 — Prohibición terminación arbitraria'],
    riesgos: ['Una cláusula de terminación solo a favor de una parte viola el Art. 16 Ley 19.496.'],
    mejoras: ['Establecer procedimiento de entrega de archivos y documentación al terminar.', 'Incluir cláusula de supervivencia de obligaciones (confidencialidad, PI, pagos pendientes).'],
  },

  // ─────────────────────────────────────────────────────────────
  // RESPONSABILIDAD
  // ─────────────────────────────────────────────────────────────
  {
    id: 'responsabilidad-limitada',
    categoria: 'Responsabilidad',
    nombre: 'Limitación de Responsabilidad',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Pone un tope al monto máximo que una parte puede cobrar a la otra si algo sale mal.',
    explicacion: 'Sin límite de responsabilidad, un error pequeño puede generar demandas millonarias. La ley chilena permite limitar la responsabilidad, pero no puede excluir el dolo ni la culpa grave.',
    campos: [
      { id: 'limite_tipo', label: 'Base para calcular el límite', tipo: 'select', opciones: ['Igual al monto total del contrato', 'Igual a los honorarios de los últimos 12 meses', 'Igual a 3 meses de honorarios', 'Igual a 6 meses de honorarios', 'Monto fijo en UF'], requerido: true },
      { id: 'limite_uf', label: 'Si es monto fijo: número de UF', tipo: 'number', placeholder: 'Ej: 200', requerido: false },
      { id: 'excluye_indirectos', label: '¿Excluir daños indirectos y lucro cesante?', tipo: 'select', opciones: ['Sí — excluir daños indirectos y lucro cesante', 'No — responder por todos los daños'], default: 'Sí — excluir daños indirectos y lucro cesante', requerido: true },
    ],
    generarTexto: (v) => `LIMITACIÓN DE RESPONSABILIDAD. La responsabilidad total y acumulada de cualquiera de las partes frente a la otra por cualquier reclamación derivada o relacionada con el presente contrato, ya sea fundada en responsabilidad contractual, extracontractual, garantía legal o cualquier otra teoría jurídica, quedará limitada a ${
v.limite_tipo === 'Monto fijo en UF'
? `${v.limite_uf || '[X]'} Unidades de Fomento`
: v.limite_tipo === 'Igual al monto total del contrato'
? 'el monto total pagado o pagadero por el CLIENTE bajo el presente contrato'
: v.limite_tipo === 'Igual a los honorarios de los últimos 12 meses'
? 'el monto total de los honorarios efectivamente pagados por el CLIENTE durante los doce (12) meses inmediatamente anteriores al evento generador del daño'
: v.limite_tipo === 'Igual a 3 meses de honorarios'
? 'el equivalente a tres (3) mensualidades de los honorarios pactados'
: 'el equivalente a seis (6) mensualidades de los honorarios pactados'
}.

${v.excluye_indirectos === 'Sí — excluir daños indirectos y lucro cesante'
? `Ninguna de las partes será responsable frente a la otra por daños indirectos, consecuenciales, incidentales, especiales o punitivos, incluyendo la pérdida de beneficios, pérdida de datos, daño a la reputación o lucro cesante, aunque hubiere sido advertida de la posibilidad de dichos daños.`
: 'Las partes responderán de todos los daños causados, tanto directos como indirectos, incluyendo el lucro cesante debidamente acreditado.'}

Lo anterior no se aplicará en los siguientes casos, que quedan expresamente excluidos de la limitación: (i) dolo o culpa grave de cualquiera de las partes, conforme al artículo 1465 del Código Civil; (ii) daños causados a personas físicas; (iii) incumplimiento de las obligaciones de confidencialidad; (iv) infracción de derechos de propiedad intelectual.`,
    normasAplicables: ['Art. 1465 CC — Condonación dolo futuro prohibida', 'Art. 1547 CC — Culpa grave = dolo', 'Ley 19.496 Art. 16 e) — Límites abusivos prohibidos'],
    riesgos: ['Exclusión total de responsabilidad es NULA bajo el Art. 1465 CC y Art. 16(e) LPDC.'],
    mejoras: ['Contratar un seguro de responsabilidad civil profesional para complementar esta cláusula.'],
  },
  {
    id: 'fuerza-mayor',
    categoria: 'Responsabilidad',
    nombre: 'Caso Fortuito y Fuerza Mayor',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Exime a ambas partes de responsabilidad cuando el incumplimiento se debe a hechos imprevisibles fuera de su control (pandemia, terremoto, huelga, etc.).',
    explicacion: 'El Código Civil ya contempla el caso fortuito, pero esta cláusula amplía la definición y establece el procedimiento: notificar, qué hacer, y qué pasa si se prolonga.',
    campos: [
      { id: 'dias_notificacion_fm', label: 'Días para notificar la fuerza mayor', tipo: 'number', placeholder: '5', default: '5', requerido: true },
      { id: 'duracion_max_fm', label: 'Meses máximos de fuerza mayor antes de poder terminar el contrato', tipo: 'number', placeholder: '3', default: '3', requerido: true },
    ],
    generarTexto: (v) => `CASO FORTUITO Y FUERZA MAYOR. Ninguna de las partes será responsable por el incumplimiento o el retardo en el cumplimiento de sus obligaciones cuando dicho incumplimiento o retardo se deba a causas de fuerza mayor o caso fortuito, entendiéndose por tales los eventos que cumplan copulativamente los siguientes requisitos: (i) que el hecho sea ajeno a la voluntad de la parte afectada; (ii) que sea imprevisible al momento de la celebración del contrato o, siendo previsible, sea inevitable; y (iii) que impida absolutamente el cumplimiento de la obligación. Se considerarán eventos de fuerza mayor, a título meramente enunciativo: desastres naturales, incendios, inundaciones, terremotos, guerras, actos terroristas, pandemias declaradas por la autoridad competente, cortes generalizados de suministro eléctrico o de internet, huelgas o paros que afecten sectores estratégicos, y resoluciones de autoridades gubernamentales que impidan la ejecución de las obligaciones.

La parte afectada por el evento de fuerza mayor deberá notificar a la otra parte dentro de los ${v.dias_notificacion_fm || '5'} días hábiles siguientes a la ocurrencia del evento, indicando su naturaleza, duración estimada y las obligaciones contractuales afectadas. El incumplimiento de esta obligación de notificación privará a la parte afectada de invocar la exoneración de responsabilidad por el período anterior a la notificación.

Durante la vigencia del evento de fuerza mayor, las obligaciones de las partes quedarán suspendidas en la medida en que sea necesario. Si el evento se prolongare por más de ${v.duracion_max_fm || '3'} meses continuos, cualquiera de las partes podrá poner término al contrato sin derecho a indemnización, mediante comunicación escrita, debiendo ambas partes liquidar las prestaciones realizadas hasta la fecha de término.`,
    normasAplicables: ['Art. 45 CC — Caso fortuito', 'Art. 1547 CC — Exención de responsabilidad', 'Art. 1558 CC — Daños imprevistos'],
    riesgos: ['Sin esta cláusula, el concepto legal de caso fortuito es más restrictivo.'],
    mejoras: ['Incluir procedimientos específicos de comunicación (email con acuse de recibo).'],
  },

  // ─────────────────────────────────────────────────────────────
  // RESOLUCIÓN DE CONFLICTOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'arbitraje-cam',
    categoria: 'Resolución de Conflictos',
    nombre: 'Cláusula de Arbitraje (CAM Santiago)',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'En vez de ir a tribunales normales (que pueden tardar años), las disputas se resuelven ante un árbitro privado que dicta sentencia en meses.',
    explicacion: 'El arbitraje es más rápido, confidencial y especializado que los tribunales ordinarios. El CAM Santiago es el centro arbitral más reconocido de Chile.',
    campos: [
      { id: 'num_arbitros', label: 'Número de árbitros', tipo: 'select', opciones: ['1 árbitro (recomendado para contratos <5.000 UF)', '3 árbitros (recomendado para contratos >5.000 UF)'], default: '1 árbitro (recomendado para contratos <5.000 UF)', requerido: true },
      { id: 'tipo_arbitro', label: 'Tipo de árbitro', tipo: 'select', opciones: ['Árbitro de derecho (falla conforme a la ley)', 'Árbitro arbitrador/amigable componedor (falla en conciencia)', 'Árbitro mixto (tramita en derecho, falla en conciencia)'], default: 'Árbitro de derecho (falla conforme a la ley)', requerido: true },
      { id: 'sede', label: 'Sede del arbitraje', tipo: 'text', default: 'Santiago, Chile', requerido: true },
      { id: 'idioma', label: 'Idioma del procedimiento', tipo: 'select', opciones: ['Castellano', 'Inglés', 'Castellano o Inglés a elección del demandante'], default: 'Castellano', requerido: true },
    ],
    generarTexto: (v) => `RESOLUCIÓN DE CONTROVERSIAS. Toda controversia, desacuerdo o reclamación que surja del presente contrato o que tenga relación con él, incluyendo su existencia, validez, interpretación, cumplimiento, incumplimiento, resolución, terminación o efectos, que no haya sido resuelta por las partes de mutuo acuerdo dentro de los quince (15) días hábiles siguientes a la notificación de la disputa por cualquiera de las partes, será sometida a arbitraje administrado por el Centro de Arbitraje y Mediación de Santiago (CAM Santiago), de conformidad con su Reglamento Procesal de Arbitraje vigente al momento de la solicitud.

El tribunal arbitral estará compuesto por ${v.num_arbitros?.includes('1') ? 'un (1) árbitro' : 'tres (3) árbitros'}, que actuará como ${
v.tipo_arbitro?.includes('derecho') ? 'árbitro de derecho, tramitando el procedimiento y fallando conforme a las normas del derecho chileno aplicable'
: v.tipo_arbitro?.includes('amigable') ? 'árbitro arbitrador o amigable componedor, fallando en conciencia y sin sujeción estricta a las normas procesales'
: 'árbitro mixto, tramitando el procedimiento conforme a las normas procesales del derecho pero fallando en conciencia'
}.

La sede del arbitraje será ${v.sede || 'Santiago, Chile'}. El idioma del procedimiento será el ${v.idioma || 'castellano'}. El derecho sustantivo aplicable será el derecho chileno.

El laudo arbitral será definitivo, vinculante para ambas partes y ejecutable de conformidad con las leyes chilenas. Las costas del arbitraje serán distribuidas conforme al laudo. Las partes renuncian expresamente a cualquier recurso de apelación contra el laudo, salvo el recurso de nulidad en los casos expresamente previstos por la ley.

Sin perjuicio de lo anterior, cualquiera de las partes podrá recurrir a los tribunales ordinarios para solicitar medidas cautelares urgentes mientras se constituye el tribunal arbitral.`,
    normasAplicables: ['COT Art. 222-243 — Arbitraje', 'Ley 19.971 — Arbitraje internacional', 'Reglamento CAM Santiago'],
    riesgos: ['Una cláusula arbitral incompleta (sin designar el centro ni el número de árbitros) puede ser inoperante.'],
    mejoras: ['Para contratos >5.000 UF, considerar 3 árbitros para mayor legitimidad del fallo.'],
  },
  {
    id: 'jurisdiccion-ordinaria',
    categoria: 'Resolución de Conflictos',
    nombre: 'Jurisdicción Ordinaria y Domicilio',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Establece en qué ciudad se resolverán los conflictos si no hay acuerdo entre las partes.',
    explicacion: 'Si no se pacta un tribunal específico, el demandante puede elegir dónde demandar, lo que puede resultar inconveniente. Esta cláusula fija una sola jurisdicción.',
    campos: [
      { id: 'ciudad_jurisdiccion', label: 'Ciudad de la jurisdicción pactada', tipo: 'text', placeholder: 'Ej: Santiago', default: 'Santiago', requerido: true },
    ],
    generarTexto: (v) => `DOMICILIO, LEY APLICABLE Y JURISDICCIÓN. Para todos los efectos legales derivados del presente contrato, las partes fijan su domicilio en la ciudad de ${v.ciudad_jurisdiccion || 'Santiago'} y se someten a la jurisdicción y competencia de sus tribunales ordinarios de justicia, renunciando a cualquier otro fuero o domicilio que pudiera corresponderles.

El presente contrato se regirá, interpretará y ejecutará conforme a las leyes de la República de Chile. En todo lo no expresamente regulado por el presente instrumento, se aplicarán supletoriamente las disposiciones del Código Civil, el Código de Comercio y la legislación especial que corresponda según la naturaleza del acto.`,
    normasAplicables: ['Art. 1546 CC — Interpretación sistemática', 'Art. 182 CPC — Prórroga de competencia'],
    riesgos: ['Sin pacto de prórroga, el demandante puede elegir el tribunal, lo que puede ser costoso.'],
    mejoras: ['Combinar con mediación previa obligatoria: 30 días de mediación antes de ir a tribunal.'],
  },

  // ─────────────────────────────────────────────────────────────
  // DISPOSICIONES GENERALES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'no-competencia',
    categoria: 'Disposiciones Generales',
    nombre: 'No Competencia Post-Contractual',
    tiposContrato: ['Prestación de Servicios', 'Arrendamiento de Servicios', 'Distribución', 'Franquicia'],
    descripcionSimple: 'Prohíbe al prestador trabajar para competidores del cliente durante cierto tiempo después de terminar el contrato.',
    explicacion: 'Esta cláusula es válida en Chile pero debe ser razonable en plazo, territorio y actividad para no ser declarada abusiva. El período máximo aceptado por la jurisprudencia chilena es de 1-2 años.',
    campos: [
      { id: 'plazo_nc', label: 'Duración de la restricción (post término)', tipo: 'select', opciones: ['6 meses', '1 año (recomendado)', '2 años (máximo razonable)', '3 años (alto riesgo de nulidad)'], default: '1 año (recomendado)', requerido: true },
      { id: 'territorio_nc', label: 'Territorio de la restricción', tipo: 'text', placeholder: 'Ej: Chile / Santiago y Región Metropolitana / Latinoamérica', requerido: true },
      { id: 'actividad_nc', label: 'Actividad específica restringida', tipo: 'textarea', placeholder: 'Ej: No podrá prestar servicios de desarrollo de software a empresas del sector financiero que compitan directamente con el CLIENTE', requerido: true },
      { id: 'compensacion_nc', label: '¿Se paga compensación por la restricción?', tipo: 'select', opciones: ['Sí — incluida en el precio general del contrato', 'Sí — compensación adicional específica', 'No (mayor riesgo de nulidad)'], default: 'Sí — incluida en el precio general del contrato', requerido: true },
    ],
    generarTexto: (v) => `NO COMPETENCIA. Durante la vigencia del presente contrato y por un período de ${v.plazo_nc || '1 año'} contado desde su término por cualquier causa, el PRESTADOR se obliga a no prestar servicios, directa o indirectamente (ya sea como empleado, contratista, socio, accionista mayoritario, consultor o en cualquier otra calidad), a empresas o personas que compitan directamente con el CLIENTE en la siguiente actividad: ${v.actividad_nc || '[ACTIVIDAD]'}, dentro del siguiente territorio: ${v.territorio_nc || '[TERRITORIO]'}.

La restricción de no competencia comprende la prohibición de: (i) prestar los servicios descritos a competidores directos del CLIENTE; (ii) captar a los clientes del CLIENTE con los que el PRESTADOR haya tenido contacto durante la ejecución del contrato; (iii) reclutar o contratar a empleados del CLIENTE.

${v.compensacion_nc === 'Sí — incluida en el precio general del contrato'
? 'El PRESTADOR declara que la compensación por esta restricción se encuentra incluida en el precio general pactado en el presente contrato, siendo este uno de los elementos considerados para su determinación.'
: v.compensacion_nc === 'Sí — compensación adicional específica'
? 'El CLIENTE pagará al PRESTADOR, como compensación específica por la presente restricción, la suma de [X] UF pagadera al término del contrato.'
: ''}

La presente cláusula no podrá interpretarse de forma que afecte el libre ejercicio de la actividad general del PRESTADOR fuera de la restricción específica convenida. En caso de incumplimiento, el CLIENTE tendrá derecho a exigir el cese inmediato de la actividad prohibida y una indemnización de perjuicios.`,
    normasAplicables: ['Art. 1546 CC — Buena fe', 'Art. 1462 CC — Objeto lícito', 'Sentencia CS 2023 — Nulidad no competencia desproporcionada'],
    riesgos: ['Cláusulas de no competencia sin plazo, territorio o actividad definida son nulas por objeto ilícito.', 'Plazo mayor a 2 años tiene alto riesgo de declaración de nulidad.'],
    mejoras: ['Incluir compensación proporcional al período de restricción para mayor validez.'],
  },
  {
    id: 'modificaciones-enmiendas',
    categoria: 'Disposiciones Generales',
    nombre: 'Modificaciones y Enmiendas al Contrato',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Establece que cualquier cambio al contrato debe hacerse por escrito y firmado por ambas partes. Nadie puede cambiar el contrato de palabra.',
    explicacion: 'Sin esta cláusula, alguien puede argumentar que un email o conversación telefónica modificó el contrato. Esta cláusula requiere escritura formal para cualquier cambio.',
    campos: [
      { id: 'incluye_adendum', label: '¿Incluir procedimiento formal de addendum?', tipo: 'select', opciones: ['Sí', 'No'], default: 'Sí', requerido: true },
    ],
    generarTexto: (v) => `MODIFICACIONES. El presente contrato solo podrá ser modificado, enmendado o complementado mediante acuerdo escrito firmado por representantes debidamente autorizados de ambas partes (en adelante, un "Addendum"). Ninguna modificación oral, ningún intercambio de correos electrónicos, mensajes de texto u otras comunicaciones informales tendrá efecto modificatorio sobre el presente instrumento, salvo que dicha comunicación sea expresamente incorporada en un Addendum firmado conforme a lo indicado.

${v.incluye_adendum === 'Sí'
? `Los Addendums deberán: (i) identificar con precisión las cláusulas que se modifican; (ii) indicar la fecha desde la cual rige la modificación; (iii) ser suscritos por las mismas personas o sus sucesores que firmaron el contrato original, o por quien acredite tener poder suficiente; y (iv) incorporarse como Anexos numerados del presente instrumento.`
: ''}

El hecho de que una parte no ejerza o retrase el ejercicio de cualquier derecho o acción previsto en este contrato no implicará renuncia a dicho derecho ni creará un precedente para futuros incumplimientos. La renuncia a un derecho solo será efectiva si consta por escrito.`,
    normasAplicables: ['Art. 1545 CC — Mutuo consentimiento para modificar', 'Art. 1560 CC — Intención de los contratantes'],
    riesgos: ['Sin esta cláusula, un email puede ser considerado una modificación contractual válida.'],
    mejoras: ['Designar expresamente a las personas autorizadas para firmar addendums.'],
  },
  {
    id: 'notificaciones',
    categoria: 'Disposiciones Generales',
    nombre: 'Notificaciones y Comunicaciones',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'Define cómo deben comunicarse las partes oficialmente: carta certificada, email, etc.',
    explicacion: 'En disputas, es fundamental poder probar que se envió y recibió una comunicación. Esta cláusula establece los medios válidos y cuándo se entiende recibida una notificación.',
    campos: [
      { id: 'email_parte_a', label: 'Email oficial Parte A', tipo: 'text', placeholder: 'contacto@empresa.cl', requerido: true },
      { id: 'email_parte_b', label: 'Email oficial Parte B', tipo: 'text', placeholder: 'contacto@cliente.cl', requerido: true },
      { id: 'acepta_email', label: '¿El email tiene valor de notificación formal?', tipo: 'select', opciones: ['Sí — email tiene valor de notificación (con acuse de lectura)', 'No — solo carta notarial o certificada'], default: 'Sí — email tiene valor de notificación (con acuse de lectura)', requerido: true },
    ],
    generarTexto: (v) => `NOTIFICACIONES. Toda notificación, comunicación, solicitud o requerimiento que deba efectuarse entre las partes en virtud del presente contrato deberá dirigirse a las siguientes personas y direcciones:

AL ${v.rol_parte_a || 'PRESTADOR'}: ${v.domicilio_parte_a || v.domicilio_empresa_a || '[DOMICILIO]'} / Email: ${v.email_parte_a || '[EMAIL]'}
AL ${v.rol_parte_b || 'CLIENTE'}: ${v.domicilio_parte_b || v.domicilio_empresa_b || '[DOMICILIO]'} / Email: ${v.email_parte_b || '[EMAIL]'}

Las notificaciones se tendrán por efectivamente realizadas y recibidas: (i) en el acto, si se entregan personalmente con firma de recepción; (ii) al día siguiente hábil de su envío, si se efectúan por correo electrónico ${v.acepta_email?.includes('Sí') ? 'a las direcciones indicadas, siempre que el remitente cuente con acuse de lectura o confirmación de entrega' : '(solo para comunicaciones informales, no para notificaciones de resolución o terminación del contrato)'}; (iii) a los dos días hábiles de su envío, si se efectúan por carta certificada al domicilio señalado; (iv) al momento de su protocolización ante notario, si se efectúan mediante notificación notarial.

Cualquier cambio en los datos de notificación deberá comunicarse a la otra parte mediante los medios señalados, con al menos cinco (5) días hábiles de anticipación.`,
    normasAplicables: ['Art. 1447 CC — Representación en actos jurídicos'],
    riesgos: ['Sin cláusula de notificaciones, en juicio puede discutirse si la contraparte "supo" de un aviso.'],
    mejoras: ['Agregar número de WhatsApp como medio de comunicación informal (no formal).'],
  },
  {
    id: 'clausula-integra',
    categoria: 'Disposiciones Generales',
    nombre: 'Acuerdo Íntegro y Divisibilidad',
    tiposContrato: TIPOS_CONTRATO,
    descripcionSimple: 'El contrato escrito reemplaza a todos los acuerdos anteriores. Si una parte del contrato es nula, el resto sigue vigente.',
    explicacion: 'Esta cláusula protege de la "extensión verbal del contrato": si hubo negociaciones previas o emails, el contrato escrito final es lo que vale. Además, si un juez anula una cláusula, no cae todo el contrato.',
    campos: [],
    generarTexto: () => `ACUERDO ÍNTEGRO. El presente contrato, junto con sus Anexos y Addendums debidamente suscritos, constituye el acuerdo íntegro y completo entre las partes respecto de su objeto, y deja sin efecto cualquier negociación, propuesta, oferta, correspondencia, entendimiento verbal o escrito anterior relacionado con el mismo. Las partes declaran que no han celebrado el presente contrato basándose en ninguna declaración o promesa que no figure en este instrumento.

DIVISIBILIDAD. En el evento que cualquier cláusula, disposición o parte del presente contrato sea declarada nula, ineficaz, inválida o inaplicable por un tribunal competente, dicha nulidad o ineficacia se aplicará exclusivamente a la cláusula o disposición afectada, manteniéndose plenamente vigentes todas las demás cláusulas del contrato. Las partes se comprometen, en tal caso, a reemplazar la cláusula nula o ineficaz por otra que, siendo válida, logre en la mayor medida posible los efectos económicos y jurídicos de la disposición original.

RENUNCIA. El no ejercicio o el retardo en el ejercicio de cualquier derecho o facultad derivado del presente contrato no implicará renuncia al mismo. La renuncia a un derecho específico solo tendrá efecto si consta por escrito.`,
    normasAplicables: ['Art. 1681 CC — Nulidad parcial', 'Art. 1546 CC — Buena fe'],
    riesgos: [],
    mejoras: ['Incluir una cláusula de "no agencia" si el prestador no debe representar al cliente.'],
  },
]
