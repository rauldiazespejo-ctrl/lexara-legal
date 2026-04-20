const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models'

/** Modelos que no son chat completions (audio, embeddings, etc.) */
const NON_CHAT = /whisper|embed|rerank|tts|guard|vox|compound|playai|moderat/i

export type GroqListedModel = { id: string }

export async function fetchGroqChatModels(apiKey: string): Promise<GroqListedModel[]> {
  const key = apiKey.trim()
  if (!key) throw new Error('Ingresa una API Key primero')

  const res = await fetch(GROQ_MODELS_URL, {
    headers: { Authorization: `Bearer ${key}` },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (body as { error?: { message?: string } })?.error?.message
    throw new Error(msg || `Groq respondió ${res.status}`)
  }

  const data = body as { data?: { id: string }[] }
  const rows = data.data ?? []
  return rows
    .filter(m => typeof m.id === 'string' && m.id.length > 0 && !NON_CHAT.test(m.id))
    .map(m => ({ id: m.id }))
    .sort((a, b) => a.id.localeCompare(b.id))
}

export const DEFAULT_GROQ_CHAT_MODEL = 'llama-3.3-70b-versatile'
const LS_GROQ_CHAT_MODEL = 'lexara_groq_chat_model'

export function getGroqChatModelId(): string {
  try {
    const v = localStorage.getItem(LS_GROQ_CHAT_MODEL)
    return v?.trim() || DEFAULT_GROQ_CHAT_MODEL
  } catch {
    return DEFAULT_GROQ_CHAT_MODEL
  }
}

export function setGroqChatModelId(modelId: string): void {
  try {
    localStorage.setItem(LS_GROQ_CHAT_MODEL, modelId.trim())
  } catch {
    /* ignore */
  }
  try {
    window.dispatchEvent(new CustomEvent('lexara-groq-model-changed', { detail: { id: modelId.trim() } }))
  } catch {
    /* ignore */
  }
}
