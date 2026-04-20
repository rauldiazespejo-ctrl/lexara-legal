/** Z.AI (智谱) · Kimi (Moonshot) · Qwen (DashScope) — APIs estilo OpenAI */

export type ListedModel = { id: string }

function parseOpenAiModelList(data: unknown): ListedModel[] {
  const d = data as { data?: { id?: string }[] }
  const rows = d.data ?? []
  return rows
    .map(r => (typeof r?.id === 'string' ? { id: r.id } : null))
    .filter((x): x is ListedModel => !!x)
}

function dispatchModelEvent(name: string, id: string) {
  try {
    window.dispatchEvent(new CustomEvent(name, { detail: { id } }))
  } catch {
    /* ignore */
  }
}

// ─── Z.AI (GLM) ─────────────────────────────────────────────────────────────
/** Mismo origen: Vite y Netlify reenvían a api.z.ai (el navegador no puede llamar a Z.AI directo por CORS). */
function getZaiProxyRoot(): string {
  const b = import.meta.env.BASE_URL || '/'
  const root = b.replace(/\/$/, '') || ''
  return `${root}/api/zai`
}

const ZAI_STATIC: ListedModel[] = [
  { id: 'glm-5.1' },
  { id: 'glm-4.6' },
  { id: 'glm-4-plus' },
  { id: 'glm-4-air' },
  { id: 'glm-4-flash' },
  { id: 'glm-4-long' },
]

const NON_CHAT = /whisper|embed|rerank|tts|moderation|image|video|audio|realtime|transcribe|speech/i

export async function fetchZaiModels(apiKey: string): Promise<ListedModel[]> {
  const key = apiKey.trim()
  if (!key) throw new Error('Ingresa una API Key')
  const res = await fetch(`${getZaiProxyRoot()}/models`, {
    headers: {
      Authorization: `Bearer ${key}`,
      'Accept-Language': 'en-US,en',
    },
  })
  if (!res.ok) {
    return ZAI_STATIC
  }
  const list = parseOpenAiModelList(await res.json()).filter(m => !NON_CHAT.test(m.id))
  return list.length > 0 ? list.sort((a, b) => a.id.localeCompare(b.id)) : ZAI_STATIC
}

const LS_ZAI_MODEL = 'lexara_zai_chat_model'
export const DEFAULT_ZAI_CHAT_MODEL = 'glm-5.1'
export const LEXARA_ZAI_MODEL_CHANGED = 'lexara-zai-model-changed'

export function getZaiChatModelId(): string {
  try {
    return localStorage.getItem(LS_ZAI_MODEL)?.trim() || DEFAULT_ZAI_CHAT_MODEL
  } catch {
    return DEFAULT_ZAI_CHAT_MODEL
  }
}

export function setZaiChatModelId(id: string): void {
  try {
    localStorage.setItem(LS_ZAI_MODEL, id.trim())
  } catch {
    /* ignore */
  }
  dispatchModelEvent(LEXARA_ZAI_MODEL_CHANGED, id.trim())
}

export function getZaiChatCompletionsUrl(): string {
  return `${getZaiProxyRoot()}/chat/completions`
}

// ─── Kimi (Moonshot) ─────────────────────────────────────────────────────────
const KIMI_BASE = 'https://api.moonshot.ai/v1'

const KIMI_STATIC: ListedModel[] = [
  { id: 'kimi-k2.5' },
  { id: 'kimi-k2-0905-preview' },
  { id: 'kimi-k2-turbo-preview' },
  { id: 'moonshot-v1-128k' },
  { id: 'moonshot-v1-32k' },
  { id: 'moonshot-v1-8k' },
]

export async function fetchKimiModels(apiKey: string): Promise<ListedModel[]> {
  const key = apiKey.trim()
  if (!key) throw new Error('Ingresa una API Key')
  const res = await fetch(`${KIMI_BASE}/models`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    const msg = (j as { error?: { message?: string } })?.error?.message
    throw new Error(msg || `Moonshot ${res.status}`)
  }
  const list = parseOpenAiModelList(await res.json()).filter(m => !NON_CHAT.test(m.id))
  return list.length > 0 ? list.sort((a, b) => a.id.localeCompare(b.id)) : KIMI_STATIC
}

const LS_KIMI_MODEL = 'lexara_kimi_chat_model'
export const DEFAULT_KIMI_CHAT_MODEL = 'kimi-k2.5'
export const LEXARA_KIMI_MODEL_CHANGED = 'lexara-kimi-model-changed'

export function getKimiChatModelId(): string {
  try {
    return localStorage.getItem(LS_KIMI_MODEL)?.trim() || DEFAULT_KIMI_CHAT_MODEL
  } catch {
    return DEFAULT_KIMI_CHAT_MODEL
  }
}

export function setKimiChatModelId(id: string): void {
  try {
    localStorage.setItem(LS_KIMI_MODEL, id.trim())
  } catch {
    /* ignore */
  }
  dispatchModelEvent(LEXARA_KIMI_MODEL_CHANGED, id.trim())
}

export const KIMI_CHAT_URL = `${KIMI_BASE}/chat/completions`

// ─── Qwen (DashScope compatible-mode, región internacional) ─────────────────
const QWEN_BASE = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

const QWEN_STATIC: ListedModel[] = [
  { id: 'qwen-plus' },
  { id: 'qwen-turbo' },
  { id: 'qwen-max' },
  { id: 'qwen2.5-72b-instruct' },
  { id: 'qwen2.5-32b-instruct' },
]

export async function fetchQwenModels(apiKey: string): Promise<ListedModel[]> {
  const key = apiKey.trim()
  if (!key) throw new Error('Ingresa una API Key')
  const res = await fetch(`${QWEN_BASE}/models`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) {
    return QWEN_STATIC
  }
  const list = parseOpenAiModelList(await res.json()).filter(
    m => /qwen/i.test(m.id) && !/embedding|rerank|vl-ocr|audio/i.test(m.id),
  )
  return list.length > 0 ? list.sort((a, b) => a.id.localeCompare(b.id)) : QWEN_STATIC
}

const LS_QWEN_MODEL = 'lexara_qwen_chat_model'
export const DEFAULT_QWEN_CHAT_MODEL = 'qwen-plus'
export const LEXARA_QWEN_MODEL_CHANGED = 'lexara-qwen-model-changed'

export function getQwenChatModelId(): string {
  try {
    return localStorage.getItem(LS_QWEN_MODEL)?.trim() || DEFAULT_QWEN_CHAT_MODEL
  } catch {
    return DEFAULT_QWEN_CHAT_MODEL
  }
}

export function setQwenChatModelId(id: string): void {
  try {
    localStorage.setItem(LS_QWEN_MODEL, id.trim())
  } catch {
    /* ignore */
  }
  dispatchModelEvent(LEXARA_QWEN_MODEL_CHANGED, id.trim())
}

export const QWEN_CHAT_URL = `${QWEN_BASE}/chat/completions`
