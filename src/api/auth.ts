const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const AUTH_STORAGE_KEY = 'game_auth'

type LoginResponseDto = { id: number; email: string }

export type AuthSession = { id: number; email: string }

function readSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as LoginResponseDto
    if (typeof o.id === 'number' && typeof o.email === 'string') {
      return { id: o.id, email: o.email }
    }
    return null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return readSession() != null
}

function setSession(session: AuthSession): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export async function login(email: string, senha: string): Promise<AuthSession> {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), senha }),
  })
  if (r.status === 401) {
    throw new Error('E-mail ou senha incorretos.')
  }
  if (!r.ok) {
    throw new Error(`Não foi possível entrar (${r.status}).`)
  }
  const data = (await r.json()) as LoginResponseDto
  const session: AuthSession = { id: data.id, email: data.email }
  setSession(session)
  return session
}
