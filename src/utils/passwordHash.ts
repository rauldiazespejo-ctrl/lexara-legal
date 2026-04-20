/** Client-side demo auth: compares SHA-256 of salted credentials (no plaintext passwords in source). */
const encoder = new TextEncoder()

export async function hashAuthPassword(email: string, password: string): Promise<string> {
  const normalized = email.toLowerCase().trim()
  const data = encoder.encode(`lexara-v1|${normalized}|${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
