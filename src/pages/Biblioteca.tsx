import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Search, FileText, Scale, Tag, Copy, ExternalLink,
  ChevronDown, ChevronUp, CheckCircle, Plus, Link2, Download,
} from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

async function downloadFormularioWord(form: Formulario, text: string) {
  const lines = text.split('\n')
  const children = lines.map(line => {
    if (line.startsWith('I. ') || line.startsWith('II. ') || line.startsWith('III. ') || line.startsWith('POR TANTO') || line.startsWith('EN SUBSIDIO')) {
      return new Paragraph({ children: [new TextRun({ text: line, bold: true })], spacing: { before: 200, after: 100 } })
    }
    if (line.startsWith('EN LO PRINCIPAL') || line.startsWith('OTROSÍ')) {
      return new Paragraph({ children: [new TextRun({ text: line, bold: true, size: 24 })], heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 200 } })
    }
    return new Paragraph({ children: [new TextRun({ text: line || ' ' })], spacing: { before: 80, after: 80 } })
  })

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: form.nombre.toUpperCase(), bold: true, size: 32, color: '1e293b' })],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Materia: ${form.materia} · Actualizado: ${form.fechaActualizacion}`, color: '64748b', size: 18 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        ...children,
        new Paragraph({
          children: [new TextRun({ text: '— Generado por LEXARA PRO · NexusForge —', color: '94a3b8', size: 16 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 600 },
        }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${form.nombre.replace(/\s+/g, '_')}_LEXARA.docx`
  a.click()
  URL.revokeObjectURL(url)
}

interface Fallo {
  id: string
  titulo: string
  tribunal: string
  rol: string
  fecha: string
  materia: 'laboral' | 'civil' | 'penal' | 'comercial' | 'familia' | 'tributario'
  resultado: 'favorable' | 'desfavorable' | 'parcial'
  resumen: string
  doctrina: string
  vinculadoCasos?: string[]
  palabrasClave: string[]
}

interface DocItem {
  id: string
  titulo: string
  autor: string
  publicacion: string
  año: number
  materia: string
  resumen: string
  url?: string
}

interface Formulario {
  id: string
  nombre: string
  tipo: 'demanda' | 'recurso' | 'contrato' | 'mandato' | 'solicitud' | 'acta'
  materia: string
  descripcion: string
  camposVariables: string[]
  fechaActualizacion: string
}

const FALLOS: Fallo[] = [
  {
    id: 'f1',
    titulo: 'Despido injustificado — trabajador plataformas digitales',
    tribunal: 'Corte Suprema',
    rol: '2341-2024',
    fecha: '2024-08-15',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'La Corte Suprema confirmó la existencia de vínculo laboral entre un repartidor de Rappi y la empresa, desestimando la tesis de contratación independiente. Se acreditó subordinación y dependencia a través de la aplicación móvil, geolocalización y supervisión algorítmica. El tribunal ordenó el pago de indemnización por años de servicio con recargo del 80% por aplicación del artículo 168 CT. Se reconoció adicionalmente el derecho a cotizaciones previsionales impagas.',
    doctrina: 'El control ejercido mediante algoritmos y geolocalización en plataformas digitales constituye subordinación y dependencia conforme al artículo 7 del Código del Trabajo, independientemente del formato contractual utilizado.',
    palabrasClave: ['plataformas digitales', 'subordinación', 'Rappi', 'despido injustificado', 'gig economy'],
  },
  {
    id: 'f2',
    titulo: 'Nulidad cláusula de no competencia post-contractual',
    tribunal: 'CA Santiago',
    rol: '8712-2023',
    fecha: '2023-11-20',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'La Corte de Apelaciones de Santiago declaró la nulidad de una cláusula de no competencia que prohibía al trabajador desempeñarse en el rubro por 24 meses sin compensación económica. El tribunal estimó que la cláusula era desproporcionada y vulneraba la libertad de trabajo garantizada en el artículo 19 N°16 de la Constitución. Se indicó que para ser válida la cláusula debe establecer una contraprestación adecuada y tener un alcance territorial y temporal razonable. El empleador fue condenado en costas.',
    doctrina: 'Las cláusulas de no competencia post-contractual sin compensación económica son nulas por atentar contra la libertad de trabajo y la dignidad del trabajador, conforme a los artículos 5 y 7 del Código del Trabajo.',
    palabrasClave: ['no competencia', 'nulidad', 'libertad de trabajo', 'cláusula abusiva', 'compensación'],
  },
  {
    id: 'f3',
    titulo: 'Responsabilidad empresa matriz por obligaciones laborales de filial',
    tribunal: 'Corte Suprema',
    rol: '4589-2024',
    fecha: '2024-05-30',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'La Corte Suprema aplicó la doctrina del levantamiento del velo societario para declarar la responsabilidad solidaria de la empresa matriz respecto de las deudas laborales de su filial declarada en quiebra. Se acreditó que ambas entidades compartían dirección, patrimonio y unidad de mando. El tribunal consideró que la separación formal de personas jurídicas se utilizó en fraude de los derechos de los trabajadores. La condena incluyó indemnizaciones, remuneraciones adeudadas y cotizaciones previsionales.',
    doctrina: 'Cuando existe unidad económica entre matriz y filial, procede el levantamiento del velo corporativo para proteger los derechos laborales, siendo la distinción formal de personas jurídicas inoponible a los trabajadores afectados.',
    palabrasClave: ['levantamiento del velo', 'empresa matriz', 'filial', 'responsabilidad solidaria', 'fraude laboral'],
  },
  {
    id: 'f4',
    titulo: 'Terminación contrato arriendo por emergencia sanitaria — fuerza mayor',
    tribunal: 'Juzgado Civil Santiago',
    rol: '14322-2023',
    fecha: '2023-07-10',
    materia: 'civil',
    resultado: 'parcial',
    resumen: 'El juzgado acogió parcialmente la acción de arrendatario que invocó fuerza mayor por cierre de local comercial durante la pandemia. El tribunal reconoció la suspensión temporal de la obligación de pago de renta durante los meses de cierre obligatorio decretado por autoridad sanitaria. Sin embargo, rechazó la terminación unilateral del contrato sin indemnización, ordenando una compensación proporcional al período de imposibilidad de uso. Se aplicaron los artículos 1547 y 1558 del Código Civil.',
    doctrina: 'La pandemia y los decretos de cierre de actividades pueden configurar fuerza mayor que suspende temporalmente las obligaciones contractuales, pero no extingue el contrato ni exime totalmente al arrendatario del cumplimiento diferido.',
    palabrasClave: ['fuerza mayor', 'arriendo', 'pandemia', 'emergencia sanitaria', 'suspensión obligaciones'],
  },
  {
    id: 'f5',
    titulo: 'Accidente del trabajo con subcontratista — responsabilidad principal',
    tribunal: 'Corte Suprema',
    rol: '6701-2023',
    fecha: '2023-09-14',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'La Corte Suprema confirmó la responsabilidad solidaria de la empresa principal respecto del accidente fatal sufrido por un trabajador de su contratista, por omisión en la fiscalización de medidas de seguridad. Se acreditó que la empresa principal tenía pleno control del espacio de trabajo y que el sistema de prevención de riesgos era deficiente. El daño moral fue fijado en 2.500 UF por cada carga familiar del trabajador fallecido. Se aplicó el artículo 183-E del Código del Trabajo.',
    doctrina: 'La empresa principal responde solidariamente por los accidentes del trabajo sufridos por empleados de sus contratistas cuando incumple su deber de adoptar las medidas necesarias para proteger eficazmente la vida y salud de todos los trabajadores que laboren en su obra.',
    palabrasClave: ['subcontratación', 'accidente del trabajo', 'daño moral', 'responsabilidad solidaria', 'prevención de riesgos'],
  },
  {
    id: 'f6',
    titulo: 'IVA servicios digitales prestados por no domiciliados — plataformas streaming',
    tribunal: 'Tribunal Tributario y Aduanero Santiago',
    rol: '312-2024',
    fecha: '2024-03-22',
    materia: 'tributario',
    resultado: 'desfavorable',
    resumen: 'El TTA rechazó la reclamación de una plataforma de streaming que impugnó la aplicación del IVA a sus servicios por considerar que el hecho gravado no se configuraba en territorio chileno. El tribunal determinó que la Ley 21.210 (Modernización Tributaria) estableció expresamente la afectación con IVA de los servicios digitales consumidos en Chile por suscriptores locales. Se desestimó el argumento de doble tributación internacional por falta de tratado aplicable. La empresa fue condenada al pago del impuesto con intereses y multas.',
    doctrina: 'Los servicios digitales prestados desde el exterior a usuarios domiciliados en Chile quedan afectos a IVA conforme al artículo 8 letra n) de la Ley del IVA, incorporado por la Ley 21.210, siendo el criterio determinante el lugar de consumo del servicio.',
    palabrasClave: ['IVA digital', 'servicios digitales', 'no domiciliados', 'Ley 21.210', 'streaming', 'tributación'],
  },
  {
    id: 'f7',
    titulo: 'Derechos fundamentales — privacidad laboral y monitoreo correo electrónico',
    tribunal: 'Corte Suprema',
    rol: '5123-2024',
    fecha: '2024-06-18',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'La Corte Suprema acogió tutela laboral de trabajador cuyo empleador había accedido a su correo electrónico corporativo sin notificación previa ni reglamento interno que lo autorizara. El tribunal declaró que la revisión unilateral vulneró los derechos fundamentales a la privacidad y a la inviolabilidad de las comunicaciones del artículo 19 N°5 de la Constitución. Se condenó al empleador al pago de una indemnización adicional equivalente a 11 meses de remuneración. La prueba obtenida de forma ilícita fue declarada inadmisible.',
    doctrina: 'El empleador no puede acceder al correo electrónico corporativo del trabajador sin contar con reglamento interno que lo permita, notificación previa y causa justificada, pues ello vulnera los derechos fundamentales de privacidad aun en el contexto laboral.',
    palabrasClave: ['privacidad laboral', 'correo electrónico', 'tutela laboral', 'derechos fundamentales', 'monitoreo'],
  },
  {
    id: 'f8',
    titulo: 'Nulidad cláusula de exclusión de responsabilidad en contrato de adhesión',
    tribunal: 'CA Valparaíso',
    rol: '3340-2023',
    fecha: '2023-04-05',
    materia: 'civil',
    resultado: 'favorable',
    resumen: 'La Corte de Apelaciones de Valparaíso declaró la nulidad absoluta de una cláusula que eximía al proveedor de toda responsabilidad por daños derivados del servicio, contenida en condiciones generales de un contrato de adhesión. El tribunal aplicó el artículo 16 letra e) de la Ley 19.496 (LPDC) que prohíbe cláusulas que inviertan la carga de la prueba en perjuicio del consumidor. Se ordenó la devolución de lo pagado más una indemnización por daño moral de 30 UTM. La cláusula fue declarada no escrita.',
    doctrina: 'Las cláusulas de exoneración total de responsabilidad en contratos de adhesión son nulas de pleno derecho conforme a la Ley 19.496, siendo especialmente inválidas cuando invierten la carga probatoria o suprimen derechos irrenunciables del consumidor.',
    palabrasClave: ['contrato adhesión', 'cláusula abusiva', 'LPDC', 'nulidad', 'consumidor', 'responsabilidad'],
  },
  {
    id: 'f9',
    titulo: 'Indemnización daño moral por despido nulo — acoso laboral',
    tribunal: 'Juzgado Laboral Santiago',
    rol: '9821-2024',
    fecha: '2024-01-29',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'El Juzgado de Letras del Trabajo de Santiago acogió la acción de tutela laboral por acoso, declarando el despido nulo y ordenando la reincorporación de la trabajadora o, a su elección, el pago de las indemnizaciones legales más un recargo del 80%. Se condenó adicionalmente al pago de daño moral por $4.500.000 por la afectación psicológica acreditada mediante informe pericial. El tribunal consideró que el hostigamiento sistemático por parte del superior jerárquico constituía vulneración de la dignidad en los términos del artículo 2 del Código del Trabajo.',
    doctrina: 'El acoso laboral acreditado que motiva un despido constituye vulneración de derechos fundamentales, haciendo procedente la nulidad del despido, las indemnizaciones con recargo máximo y la indemnización de daño moral autónoma.',
    palabrasClave: ['acoso laboral', 'daño moral', 'despido nulo', 'tutela laboral', 'dignidad', 'reincorporación'],
  },
  {
    id: 'f10',
    titulo: 'Prescripción acción penal — delitos económicos continuados',
    tribunal: 'Corte Suprema',
    rol: '7890-2024',
    fecha: '2024-10-03',
    materia: 'penal',
    resultado: 'desfavorable',
    resumen: 'La Corte Suprema confirmó el sobreseimiento definitivo por prescripción de la acción penal en causa por apropiación indebida reiterada, desestimando la tesis fiscal de que el delito continuado interrumpía el cómputo del plazo. El tribunal precisó que la prescripción debe computarse desde la última acción constitutiva del ilícito, y que habiendo transcurrido más de diez años desde ese momento sin haberse formalizado la investigación, operó la prescripción de pleno derecho. Se aplicó el artículo 94 del Código Penal.',
    doctrina: 'En los delitos continuados el plazo de prescripción comienza a correr desde la ejecución del último acto constitutivo del delito, sin que los actos anteriores reinicien el cómputo, conforme al artículo 94 bis del Código Penal.',
    palabrasClave: ['prescripción penal', 'delito continuado', 'delitos económicos', 'sobreseimiento', 'apropiación indebida'],
  },
  {
    id: 'f11',
    titulo: 'Responsabilidad solidaria empleador en régimen de subcontratación',
    tribunal: 'CA Concepción',
    rol: '2219-2023',
    fecha: '2023-06-12',
    materia: 'laboral',
    resultado: 'favorable',
    resumen: 'La Corte de Apelaciones de Concepción confirmó la condena solidaria de la empresa principal por las remuneraciones adeudadas por la contratista a sus trabajadores, al no haber ejercido el derecho de retención ni requerido a la contratista el pago de dichas obligaciones. El tribunal determinó que la empresa principal tenía pleno conocimiento del incumplimiento y omitió los mecanismos de protección previstos en el artículo 183-C del CT. Se extendió la condena a cotizaciones y asignaciones familiares impagas.',
    doctrina: 'La empresa principal que omite ejercer los derechos de retención y pago directo previstos en el artículo 183-C del Código del Trabajo responde solidariamente por el íntegro de las obligaciones laborales y previsionales incumplidas por su contratista.',
    palabrasClave: ['subcontratación', 'responsabilidad solidaria', 'empresa principal', 'remuneraciones', 'Art. 183-C CT'],
  },
  {
    id: 'f12',
    titulo: 'Arbitraje CISG — compraventa internacional de mercaderías',
    tribunal: 'CAM Santiago',
    rol: '4402-2024',
    fecha: '2024-07-08',
    materia: 'comercial',
    resultado: 'parcial',
    resumen: 'El Centro de Arbitraje y Mediación de Santiago acogió parcialmente la demanda de comprador chileno por incumplimiento de contrato de compraventa internacional de maquinaria industrial, aplicando la Convención de Viena sobre Compraventa Internacional (CISG) ratificada por Chile. El árbitro determinó la entrega tardía y la falta de conformidad parcial del bien, fijando una indemnización equivalente al 35% del precio pagado. Se rechazó la resolución total del contrato por no alcanzar el umbral de incumplimiento esencial del artículo 25 CISG.',
    doctrina: 'La CISG es aplicable a contratos de compraventa internacional cuando las partes tienen sus establecimientos en Estados contratantes distintos, siendo el incumplimiento esencial del artículo 25 el estándar para la resolución, con umbral más exigente que el derecho civil interno chileno.',
    palabrasClave: ['CISG', 'compraventa internacional', 'arbitraje comercial', 'incumplimiento esencial', 'CAM Santiago'],
  },
]

const DOCTRINA: DocItem[] = [
  {
    id: 'd1',
    titulo: 'Validez y perfeccionamiento de los contratos electrónicos en el ordenamiento jurídico chileno',
    autor: 'Prof. Carolina Méndez Vargas',
    publicacion: 'Revista de Derecho PUCV',
    año: 2024,
    materia: 'Civil / Tecnología',
    resumen: 'El artículo analiza el régimen de validez de los contratos celebrados por medios electrónicos a la luz de la Ley 19.799 y el Código Civil, examinando los requisitos de consentimiento, la equivalencia funcional de la firma electrónica avanzada y los problemas de atribución de declaraciones de voluntad en entornos automatizados. Se propone una interpretación integradora que reconoce plena eficacia a los contratos digitales sin exigir adecuación legislativa adicional para la mayoría de actos y contratos.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd2',
    titulo: 'Responsabilidad penal de las personas jurídicas: balance de la Ley 20.393 a diez años de vigencia',
    autor: 'Dr. Rodrigo Aldunate Lizana',
    publicacion: 'Revista de Ciencias Penales',
    año: 2023,
    materia: 'Penal / Compliance',
    resumen: 'El trabajo evalúa la eficacia práctica de la Ley 20.393 sobre responsabilidad penal de personas jurídicas, analizando la jurisprudencia acumulada en delitos de cohecho, lavado de activos y financiamiento del terrorismo. Se concluye que el modelo de atribución por defecto organizacional ha generado incentivos reales para la implementación de programas de cumplimiento, aunque subsisten problemas de prueba del elemento subjetivo de la persona natural autora.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd3',
    titulo: 'La reforma al proceso civil chileno: desafíos de la oralidad en el sistema de prueba',
    autor: 'Prof. Mauricio Silva Cancino',
    publicacion: 'Revista Chilena de Derecho Procesal',
    año: 2024,
    materia: 'Procesal Civil',
    resumen: 'El autor examina los principales cambios que introduce el Anteproyecto de Código Procesal Civil en materia probatoria, con especial énfasis en la audiencia preliminar, el estándar de prueba y la valoración racional de la evidencia. Se advierte sobre los riesgos de implementar la oralidad sin un fortalecimiento paralelo de la infraestructura judicial y la capacitación de jueces.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd4',
    titulo: 'Protección de datos personales en Chile: hacia un régimen GDPR-compatible',
    autor: 'Dra. Valentina Orrego Fuentes',
    publicacion: 'El Mercurio Legal',
    año: 2024,
    materia: 'Tecnología / Privacidad',
    resumen: 'El artículo analiza el proyecto de reforma a la Ley 19.628 de Protección de la Vida Privada, evaluando su convergencia con el Reglamento Europeo de Protección de Datos (GDPR). Se abordan los nuevos derechos del titular, las obligaciones del responsable del tratamiento, el régimen sancionatorio y el rol de la Agencia de Protección de Datos Personales, concluyendo que el proyecto representa un avance sustancial aunque insuficiente en materia de transferencias internacionales.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd5',
    titulo: 'La buena fe como principio rector en la interpretación de los contratos',
    autor: 'Prof. Juan Pablo Vergara Ahumada',
    publicacion: 'Revista de Derecho Universidad de Chile',
    año: 2023,
    materia: 'Civil / Contratos',
    resumen: 'El trabajo sistematiza la jurisprudencia de la Corte Suprema sobre la función interpretativa de la buena fe objetiva en los contratos civiles y mercantiles, distinguiendo entre los planos de formación, ejecución y extinción. Se propone un modelo de análisis en tres etapas que permite aplicar el estándar de buena fe con mayor predictibilidad, reduciendo la discrecionalidad judicial en casos de contratos de larga duración o relacionales.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd6',
    titulo: 'Arbitraje comercial internacional: Chile como sede y la incorporación de las reglas UNCITRAL',
    autor: 'Dr. Felipe Ossa Díaz',
    publicacion: 'Revista de Arbitraje Comercial e Inversiones',
    año: 2023,
    materia: 'Comercial / Arbitraje',
    resumen: 'El artículo evalúa el posicionamiento de Chile como sede de arbitraje internacional a partir de la Ley 19.971 sobre Arbitraje Comercial Internacional, analizando la recepción jurisprudencial de las causales de anulación del laudo y el régimen de reconocimiento de sentencias arbitrales extranjeras conforme a la Convención de Nueva York. Se identifican las áreas que requieren desarrollo legislativo para atraer mayor flujo de arbitrajes regionales.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd7',
    titulo: 'Indemnización de accidentes del trabajo: análisis del sistema dual chileno',
    autor: 'Prof. Marcela Fuentes Rojas',
    publicacion: 'Revista Laboral Chilena',
    año: 2024,
    materia: 'Laboral / Seguridad Social',
    resumen: 'El trabajo examina la convivencia del sistema de seguro de la Ley 16.744 con la responsabilidad civil derivada de accidentes del trabajo, analizando las condiciones bajo las cuales el trabajador puede demandar indemnización adicional por daño moral. Se estudia la evolución jurisprudencial hacia el reconocimiento del daño moral autónomo y las dificultades probatorias que enfrenta el trabajador para acreditar la negligencia del empleador.',
    url: 'https://www.bcn.cl',
  },
  {
    id: 'd8',
    titulo: 'Tributación de la economía digital en Chile: retos del sistema fiscal ante los modelos de negocio disruptivos',
    autor: 'Dr. Pablo Montt Retamal',
    publicacion: 'Revista de Derecho Tributario',
    año: 2024,
    materia: 'Tributario / Digital',
    resumen: 'El artículo analiza los desafíos que plantean los modelos de negocio de la economía digital al sistema tributario chileno, evaluando las modificaciones introducidas por la Ley 21.210 en materia de IVA a servicios digitales y la adecuación de las normas de establecimiento permanente. Se propone una agenda de reformas que permita capturar de manera equitativa el valor generado por plataformas multilaterales, economía colaborativa e inteligencia artificial como servicio.',
    url: 'https://www.bcn.cl',
  },
]

const FORMULARIOS: Formulario[] = [
  {
    id: 'frm1',
    nombre: 'Mandato Judicial',
    tipo: 'mandato',
    materia: 'General',
    descripcion: 'Poder especial para actuar en juicio ante cualquier tribunal de la República, con todas las facultades ordinarias del mandato judicial.',
    camposVariables: ['{{nombre_poderdante}}', '{{rut_poderdante}}', '{{domicilio_poderdante}}', '{{nombre_apoderado}}', '{{rut_apoderado}}', '{{tribunal}}', '{{causa_rol}}'],
    fechaActualizacion: '2025-01-10',
  },
  {
    id: 'frm2',
    nombre: 'Demanda Ordinaria Civil',
    tipo: 'demanda',
    materia: 'Civil',
    descripcion: 'Demanda en procedimiento ordinario de mayor cuantía conforme al Título XI del CPC. Incluye estructura completa con hechos, derecho y peticiones.',
    camposVariables: ['{{nombre_demandante}}', '{{rut_demandante}}', '{{nombre_demandado}}', '{{rut_demandado}}', '{{tribunal}}', '{{monto_demandado}}', '{{fundamento_legal}}', '{{peticion_principal}}'],
    fechaActualizacion: '2025-02-01',
  },
  {
    id: 'frm3',
    nombre: 'Querella Criminal',
    tipo: 'demanda',
    materia: 'Penal',
    descripcion: 'Querella por delito de acción penal pública o privada ante el Ministerio Público o Juzgado de Garantía, con relato de hechos y calificación jurídica.',
    camposVariables: ['{{nombre_querellante}}', '{{rut_querellante}}', '{{nombre_imputado}}', '{{delito}}', '{{fecha_hechos}}', '{{lugar_hechos}}', '{{tribunal_garantia}}', '{{fiscal_regional}}'],
    fechaActualizacion: '2025-01-20',
  },
  {
    id: 'frm4',
    nombre: 'Demanda Laboral — Despido Injustificado',
    tipo: 'demanda',
    materia: 'Laboral',
    descripcion: 'Demanda ante el Juzgado de Letras del Trabajo por despido injustificado, indebido o improcedente con cobro de prestaciones e indemnizaciones.',
    camposVariables: ['{{nombre_trabajador}}', '{{rut_trabajador}}', '{{nombre_empleador}}', '{{rut_empleador}}', '{{fecha_inicio}}', '{{fecha_termino}}', '{{remuneracion}}', '{{causal_despido}}', '{{anos_servicio}}'],
    fechaActualizacion: '2025-02-15',
  },
  {
    id: 'frm5',
    nombre: 'Recurso de Apelación',
    tipo: 'recurso',
    materia: 'General',
    descripcion: 'Recurso de apelación en contra de sentencia definitiva o interlocutoria, con fundamentos de hecho y derecho y peticiones concretas a la Corte de Apelaciones.',
    camposVariables: ['{{nombre_apelante}}', '{{nombre_apelado}}', '{{tribunal_origen}}', '{{causa_rol}}', '{{fecha_sentencia}}', '{{fundamento_apelacion}}', '{{peticion_principal}}', '{{peticion_subsidiaria}}'],
    fechaActualizacion: '2025-01-05',
  },
  {
    id: 'frm6',
    nombre: 'Poder Notarial General',
    tipo: 'mandato',
    materia: 'General / Notarial',
    descripcion: 'Poder general para actos de administración y disposición, otorgado ante Notario Público. Incluye cláusulas de sustitución y revocación.',
    camposVariables: ['{{nombre_mandante}}', '{{rut_mandante}}', '{{estado_civil}}', '{{domicilio_mandante}}', '{{nombre_mandatario}}', '{{rut_mandatario}}', '{{facultades_especiales}}', '{{notaria}}'],
    fechaActualizacion: '2025-03-01',
  },
  {
    id: 'frm7',
    nombre: 'Contrato de Prestación de Servicios',
    tipo: 'contrato',
    materia: 'Civil / Comercial',
    descripcion: 'Contrato simple de prestación de servicios profesionales con cláusulas de objeto, honorarios, plazo, confidencialidad y resolución de conflictos.',
    camposVariables: ['{{nombre_prestador}}', '{{rut_prestador}}', '{{nombre_cliente}}', '{{rut_cliente}}', '{{descripcion_servicio}}', '{{honorario}}', '{{fecha_inicio}}', '{{fecha_termino}}', '{{forma_pago}}'],
    fechaActualizacion: '2025-02-20',
  },
  {
    id: 'frm8',
    nombre: 'Acuerdo de Confidencialidad (NDA)',
    tipo: 'contrato',
    materia: 'Comercial',
    descripcion: 'Acuerdo de no divulgación de información confidencial en el contexto de negociaciones o relaciones comerciales. Incluye definición de información protegida y excepciones.',
    camposVariables: ['{{nombre_parte_a}}', '{{rut_parte_a}}', '{{nombre_parte_b}}', '{{rut_parte_b}}', '{{objeto_acuerdo}}', '{{vigencia}}', '{{penalidad}}', '{{tribunal_arbitro}}'],
    fechaActualizacion: '2025-01-28',
  },
  {
    id: 'frm9',
    nombre: 'Demanda Ejecutiva',
    tipo: 'demanda',
    materia: 'Civil',
    descripcion: 'Demanda ejecutiva en juicio de hacienda o civil basada en título ejecutivo perfecto (letra de cambio, pagaré, sentencia firme o instrumento público).',
    camposVariables: ['{{nombre_ejecutante}}', '{{rut_ejecutante}}', '{{nombre_ejecutado}}', '{{rut_ejecutado}}', '{{tipo_titulo}}', '{{monto_capital}}', '{{intereses}}', '{{fecha_vencimiento}}', '{{tribunal}}'],
    fechaActualizacion: '2025-02-10',
  },
  {
    id: 'frm10',
    nombre: 'Recurso de Casación en el Fondo',
    tipo: 'recurso',
    materia: 'General',
    descripcion: 'Recurso de casación en el fondo ante la Corte Suprema por infracción de ley que influyó sustancialmente en lo dispositivo del fallo.',
    camposVariables: ['{{nombre_recurrente}}', '{{causa_rol}}', '{{tribunal_origen}}', '{{sala_cs}}', '{{normas_infringidas}}', '{{forma_infraccion}}', '{{influencia_dispositivo}}', '{{peticion}}'],
    fechaActualizacion: '2025-01-15',
  },
]

const MATERIAS = [
  { id: 'all', label: 'Todas' },
  { id: 'laboral', label: 'Laboral' },
  { id: 'civil', label: 'Civil' },
  { id: 'penal', label: 'Penal' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'familia', label: 'Familia' },
  { id: 'tributario', label: 'Tributario' },
]

const MATERIA_COLORS: Record<string, string> = {
  laboral: '#6366f1',
  civil: '#3b82f6',
  penal: '#ef4444',
  comercial: '#f59e0b',
  familia: '#ec4899',
  tributario: '#10b981',
}

const RESULTADO_CONFIG = {
  favorable: { label: 'Favorable', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  desfavorable: { label: 'Desfavorable', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  parcial: { label: 'Parcial', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
}

const TIPO_FORM_CONFIG: Record<string, { label: string; color: string }> = {
  demanda: { label: 'Demanda', color: '#ef4444' },
  recurso: { label: 'Recurso', color: '#f59e0b' },
  contrato: { label: 'Contrato', color: '#10b981' },
  mandato: { label: 'Mandato', color: '#6366f1' },
  solicitud: { label: 'Solicitud', color: '#3b82f6' },
  acta: { label: 'Acta', color: '#ec4899' },
}

function generateTemplate(form: Formulario): string {
  const lines: string[] = [
    `EN LO PRINCIPAL: ${form.nombre.toUpperCase()}`,
    `OTROSÍ: Acompaña documentos`,
    '',
    `${form.materia.toUpperCase()} TRIBUNAL:`,
    '',
  ]

  if (form.tipo === 'mandato') {
    lines.push(
      `{{nombre_poderdante}}, RUT {{rut_poderdante}}, domiciliado en {{domicilio_poderdante}}, a S.S. respetuosamente digo:`,
      '',
      `Que por medio del presente instrumento, vengo en conferir MANDATO JUDICIAL ESPECIAL a don(ña) {{nombre_apoderado}}, RUT {{rut_apoderado}}, abogado habilitado para el ejercicio de la profesión, para que me represente en la causa ROL {{causa_rol}}, seguida ante {{tribunal}}.`,
      '',
      `El mandatario queda investido de todas las facultades ordinarias del mandato judicial, incluyendo las especiales del inciso segundo del artículo 7 del Código de Procedimiento Civil.`,
    )
  } else if (form.tipo === 'demanda') {
    lines.push(
      `{{nombre_demandante}}, RUT {{rut_demandante}}, domiciliado en {{domicilio_demandante}}, por medio de su abogado patrocinante y apoderado, a S.S. respetuosamente digo:`,
      '',
      `I. HECHOS`,
      '',
      `[Relación circunstanciada de los hechos que fundamentan la acción]`,
      '',
      `II. DERECHO`,
      '',
      `La acción deducida se funda en {{fundamento_legal}}.`,
      '',
      `III. PETICIONES`,
      '',
      `POR TANTO, solicito a S.S.: {{peticion_principal}}.`,
    )
  } else if (form.tipo === 'recurso') {
    lines.push(
      `{{nombre_apelante}}, en la causa ROL {{causa_rol}}, a S.S. respetuosamente digo:`,
      '',
      `Que dentro del plazo legal interpongo RECURSO DE {{nombre.toUpperCase()}} en contra de la sentencia dictada con fecha {{fecha_sentencia}}, por los siguientes fundamentos:`,
      '',
      `I. FUNDAMENTOS DE DERECHO`,
      '',
      `{{fundamento_apelacion}}`,
      '',
      `POR TANTO, solicito: {{peticion_principal}}`,
      `EN SUBSIDIO: {{peticion_subsidiaria}}`,
    )
  } else if (form.tipo === 'contrato') {
    lines.push(
      `En Santiago, a {{fecha_inicio}}, comparecen:`,
      '',
      `De una parte, {{nombre_parte_a}}, RUT {{rut_parte_a}};`,
      `De otra parte, {{nombre_parte_b}}, RUT {{rut_parte_b}};`,
      '',
      `Quienes acuerdan el siguiente contrato de ${form.nombre}:`,
      '',
      `PRIMERO: OBJETO. {{descripcion_servicio}}`,
      `SEGUNDO: VIGENCIA. {{fecha_inicio}} al {{fecha_termino}}`,
      `TERCERO: HONORARIOS. {{honorario}}, pagaderos {{forma_pago}}`,
      `CUARTO: CONFIDENCIALIDAD. Las partes se obligan a mantener reserva de toda información.`,
      `QUINTO: JURISDICCIÓN. Cualquier conflicto será resuelto por {{tribunal_arbitro}}.`,
    )
  }

  lines.push('', `[Fecha], [Ciudad]`, '', `_______________________________`, `Firma y timbre`)
  return lines.join('\n')
}

function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  const show = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }
  return { toast, show }
}

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl"
      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', backdropFilter: 'blur(12px)' }}
    >
      <CheckCircle size={15} className="text-emerald-400" />
      <span className="text-xs font-semibold text-emerald-300">{message}</span>
    </motion.div>
  )
}

function PlantillaModal({ form, onClose }: { form: Formulario; onClose: () => void }) {
  const text = generateTemplate(form)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        className="w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col"
        style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '85vh' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: `${TIPO_FORM_CONFIG[form.tipo].color}20`, border: `1px solid ${TIPO_FORM_CONFIG[form.tipo].color}40` }}>
              <FileText size={13} style={{ color: TIPO_FORM_CONFIG[form.tipo].color }} />
            </div>
            <div>
              <p className="text-sm font-black text-white">{form.nombre}</p>
              <p className="text-[10px] text-slate-500">{form.materia}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={copied
                ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              <Copy size={12} />
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button
              onClick={() => downloadFormularioWord(form, text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
              <Download size={12} />Word
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all">
              <Plus size={15} className="rotate-45" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <textarea
            value={text}
            readOnly
            rows={22}
            className="w-full rounded-xl p-4 text-xs text-slate-300 font-mono leading-relaxed resize-none outline-none"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {form.camposVariables.map(v => (
              <span key={v} className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                {v}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function FalloCard({ fallo, search, onVincular }: { fallo: Fallo; search: string; onVincular: (titulo: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const mc = MATERIA_COLORS[fallo.materia] ?? '#6366f1'
  const rc = RESULTADO_CONFIG[fallo.resultado]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(15,23,42,0.85)', border: `1px solid ${mc}22` }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${mc}14`, border: `1px solid ${mc}30` }}>
          <Scale size={14} style={{ color: mc }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-xs font-bold text-white leading-snug flex-1">{fallo.titulo}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color }}>
              {rc.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-medium">{fallo.tribunal}</span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-500">ROL {fallo.rol}</span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-500">{fallo.fecha}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full capitalize"
              style={{ background: `${mc}14`, color: mc, border: `1px solid ${mc}28` }}>
              {fallo.materia}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-3">
              <div className="p-3.5 rounded-xl space-y-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resumen</p>
                <p className="text-xs text-slate-300 leading-relaxed">{fallo.resumen}</p>
              </div>
              <div className="p-3.5 rounded-xl space-y-2" style={{ background: `${mc}07`, border: `1px solid ${mc}18` }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: mc }}>Doctrina establecida</p>
                <p className="text-xs text-slate-300 leading-relaxed">{fallo.doctrina}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {fallo.palabrasClave.map(kw => (
                  <span key={kw} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#94a3b8' }}>
                    <Tag size={9} />
                    {kw}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onVincular(fallo.titulo)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(124,58,237,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}
              >
                <Link2 size={12} />
                Vincular a caso
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DocCard({ doc }: { doc: DocItem }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(59,130,246,0.15)' }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.22)' }}>
          <BookOpen size={14} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white leading-snug">{doc.titulo}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-blue-400">{doc.autor}</span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-500 italic">{doc.publicacion}</span>
            <span className="text-[10px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-500">{doc.año}</span>
          </div>
          <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
            {doc.materia}
          </span>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-3">
              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <p className="text-xs text-slate-300 leading-relaxed">{doc.resumen}</p>
              </div>
              {doc.url && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink size={11} />
                  Ver en Biblioteca del Congreso Nacional
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FormularioCard({ form, onUsar }: { form: Formulario; onUsar: (f: Formulario) => void }) {
  const tc = TIPO_FORM_CONFIG[form.tipo] ?? { label: form.tipo, color: '#6366f1' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: 'rgba(15,23,42,0.85)', border: `1px solid ${tc.color}22` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${tc.color}14`, border: `1px solid ${tc.color}30` }}>
          <FileText size={14} style={{ color: tc.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-bold text-white">{form.nombre}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${tc.color}18`, border: `1px solid ${tc.color}35`, color: tc.color }}>
              {tc.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{form.materia}</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">{form.descripcion}</p>

      <div className="flex flex-wrap gap-1">
        {form.camposVariables.map(v => (
          <span key={v} className="text-[9px] px-1.5 py-0.5 rounded-full font-mono"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
            {v}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-slate-600">Actualizado {form.fechaActualizacion}</span>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onUsar(form)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{ background: `linear-gradient(135deg,${tc.color}cc,${tc.color}99)` }}
        >
          <Copy size={11} />
          Usar plantilla
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Biblioteca() {
  const [activeTab, setActiveTab] = useState<'jurisprudencia' | 'doctrina' | 'formularios'>('jurisprudencia')
  const [search, setSearch] = useState('')
  const [materiaFilter, setMateriaFilter] = useState('all')
  const [plantillaForm, setPlantillaForm] = useState<Formulario | null>(null)
  const { toast, show: showToast } = useToast()

  const q = search.toLowerCase()

  const filteredFallos = FALLOS.filter(f => {
    const matchSearch = !q ||
      f.titulo.toLowerCase().includes(q) ||
      f.tribunal.toLowerCase().includes(q) ||
      f.rol.toLowerCase().includes(q) ||
      f.resumen.toLowerCase().includes(q) ||
      f.doctrina.toLowerCase().includes(q) ||
      f.palabrasClave.some(k => k.toLowerCase().includes(q))
    const matchMateria = materiaFilter === 'all' || f.materia === materiaFilter
    return matchSearch && matchMateria
  })

  const filteredDoctrina = DOCTRINA.filter(d => {
    const matchSearch = !q ||
      d.titulo.toLowerCase().includes(q) ||
      d.autor.toLowerCase().includes(q) ||
      d.publicacion.toLowerCase().includes(q) ||
      d.resumen.toLowerCase().includes(q) ||
      d.materia.toLowerCase().includes(q)
    const matchMateria = materiaFilter === 'all' || d.materia.toLowerCase().includes(materiaFilter)
    return matchSearch && matchMateria
  })

  const filteredFormularios = FORMULARIOS.filter(f => {
    const matchSearch = !q ||
      f.nombre.toLowerCase().includes(q) ||
      f.materia.toLowerCase().includes(q) ||
      f.descripcion.toLowerCase().includes(q) ||
      f.tipo.toLowerCase().includes(q) ||
      f.camposVariables.some(v => v.toLowerCase().includes(q))
    const matchMateria = materiaFilter === 'all' || f.materia.toLowerCase().includes(materiaFilter)
    return matchSearch && matchMateria
  })

  const tabs = [
    { id: 'jurisprudencia' as const, label: 'Jurisprudencia', short: 'Fallos', icon: Scale, count: filteredFallos.length },
    { id: 'doctrina' as const, label: 'Doctrina', short: 'Doctrina', icon: BookOpen, count: filteredDoctrina.length },
    { id: 'formularios' as const, label: 'Formularios', short: 'Forms', icon: FileText, count: filteredFormularios.length },
  ]

  return (
    <div className="space-y-5" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
          <BookOpen size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Biblioteca Jurídica</h1>
          <p className="text-xs text-slate-500 mt-0.5">Jurisprudencia · Doctrina · Formularios</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar en toda la biblioteca..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {MATERIAS.map(m => (
            <button
              key={m.id}
              onClick={() => setMateriaFilter(m.id)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap"
              style={materiaFilter === m.id
                ? { background: 'linear-gradient(135deg,rgba(29,78,216,0.3),rgba(124,58,237,0.3))', border: '1px solid rgba(99,102,241,0.4)', color: '#c7d2fe' }
                : { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="flex gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
              style={active
                ? { background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: '#fff', boxShadow: '0 0 18px rgba(99,102,241,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8' }}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={active
                  ? { background: 'rgba(255,255,255,0.2)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.17 }}
          className="space-y-3"
        >
          {activeTab === 'jurisprudencia' && (
            <>
              {filteredFallos.length === 0 && (
                <div className="text-center py-14 text-slate-600 text-sm">
                  No se encontraron fallos para "{search}"
                </div>
              )}
              {filteredFallos.map((fallo, i) => (
                <motion.div key={fallo.id} transition={{ delay: i * 0.03 }}>
                  <FalloCard
                    fallo={fallo}
                    search={search}
                    onVincular={titulo => showToast(`Fallo vinculado: "${titulo.slice(0, 48)}..."`)}
                  />
                </motion.div>
              ))}
            </>
          )}

          {activeTab === 'doctrina' && (
            <>
              {filteredDoctrina.length === 0 && (
                <div className="text-center py-14 text-slate-600 text-sm">
                  No se encontraron artículos para "{search}"
                </div>
              )}
              {filteredDoctrina.map((doc, i) => (
                <motion.div key={doc.id} transition={{ delay: i * 0.03 }}>
                  <DocCard doc={doc} />
                </motion.div>
              ))}
            </>
          )}

          {activeTab === 'formularios' && (
            <>
              {filteredFormularios.length === 0 && (
                <div className="text-center py-14 text-slate-600 text-sm">
                  No se encontraron formularios para "{search}"
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredFormularios.map((form, i) => (
                  <motion.div key={form.id} transition={{ delay: i * 0.03 }}>
                    <FormularioCard form={form} onUsar={f => setPlantillaForm(f)} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {plantillaForm && (
          <PlantillaModal form={plantillaForm} onClose={() => setPlantillaForm(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </div>
  )
}
