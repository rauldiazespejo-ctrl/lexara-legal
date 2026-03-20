import type {
  Cliente, Caso, Plazo, EventoAgenda, Honorario
} from '../types'

export const UF_VALOR_CLP = 38_012

export const CLIENTES: Cliente[] = []
export const PLAZOS: Plazo[] = []
export const CASOS: Caso[] = []
export const HONORARIOS: Honorario[] = []
export const EVENTOS_AGENDA: EventoAgenda[] = []

export const DASHBOARD_DATA = {
  tendenciaIngresos: [] as { mes: string; uf: number; clp: number }[],
}

export const PLAZOS_LEGALES = {
  civil: [
    { acto: 'Contestación demanda (ordinario)', articulo: 'Art. 258 CPC', dias: 15, tipo: 'hábiles', fatal: true },
    { acto: 'Contestación demanda (sumario)', articulo: 'Art. 681 CPC', dias: 5, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de apelación sentencia definitiva', articulo: 'Art. 189 CPC', dias: 10, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de casación en la forma', articulo: 'Art. 770 CPC', dias: 15, tipo: 'hábiles', fatal: true },
    { acto: 'Abandono del procedimiento', articulo: 'Art. 152 CPC', dias: 180, tipo: 'corridos', fatal: false },
    { acto: 'Prescripción acción ordinaria', articulo: 'Art. 2515 CC', dias: 1825, tipo: 'corridos', fatal: false },
  ],
  laboral: [
    { acto: 'Demanda por despido injustificado', articulo: 'Art. 168 CT', dias: 60, tipo: 'hábiles', fatal: true },
    { acto: 'Denuncia tutela laboral', articulo: 'Art. 489 CT', dias: 60, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de nulidad laboral', articulo: 'Art. 478 CT', dias: 10, tipo: 'hábiles', fatal: true },
    { acto: 'Apelación (procedimiento monitorio)', articulo: 'Art. 500 CT', dias: 10, tipo: 'hábiles', fatal: true },
  ],
  penal: [
    { acto: 'Formalización de cargos', articulo: 'Art. 230 CPP', dias: 0, tipo: 'a petición', fatal: false },
    { acto: 'Plazo de investigación', articulo: 'Art. 247 CPP', dias: 730, tipo: 'corridos', fatal: true },
    { acto: 'Recurso de apelación auto de apertura', articulo: 'Art. 277 CPP', dias: 10, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de nulidad penal', articulo: 'Art. 372 CPP', dias: 10, tipo: 'hábiles', fatal: true },
  ],
  familia: [
    { acto: 'Mediación previa obligatoria', articulo: 'Art. 106 Ley 19.968', dias: 0, tipo: 'previa', fatal: true },
    { acto: 'Recurso de apelación', articulo: 'Art. 67 Ley 19.968', dias: 5, tipo: 'hábiles', fatal: true },
    { acto: 'Alimentos provisorios', articulo: 'Art. 55 Ley 14.908', dias: 15, tipo: 'hábiles', fatal: false },
  ],
  tributario: [
    { acto: 'Reclamación tributaria ante TTA', articulo: 'Art. 124 CT', dias: 90, tipo: 'hábiles', fatal: true },
    { acto: 'Recurso de apelación TTA', articulo: 'Art. 140 CT', dias: 15, tipo: 'hábiles', fatal: true },
    { acto: 'Prescripción ordinaria SII', articulo: 'Art. 200 CT', dias: 1095, tipo: 'corridos', fatal: false },
  ],
}
