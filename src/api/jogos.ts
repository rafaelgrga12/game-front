import type { Game } from '../data/games'

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

export type JogoDto = {
  id: number
  titulo: string
  genero: string | null
  nota: number | null
  link: string | null
  imagem: string | null
  status: 'A_JOGAR' | 'CONCLUIDO'
}

export type CriarJogoBody = {
  titulo: string
  genero?: string
  nota?: number | null
  link?: string
  imagem?: string
}

export async function fetchJogos(
  s: 'A_JOGAR' | 'CONCLUIDO',
): Promise<JogoDto[]> {
  const r = await fetch(`${BASE}/api/jogos?status=${s}`)
  if (!r.ok) {
    throw new Error(`Erro ao listar jogos (${r.status})`)
  }
  return r.json()
}

export function jogoDtoToGame(j: JogoDto): Game {
  return {
    id: String(j.id),
    title: j.titulo,
    rating: j.nota != null ? String(j.nota) : '—',
    genre: j.genero && j.genero.length > 0 ? j.genero : '—',
    coverUrl:
      j.imagem && j.imagem.length > 0
        ? j.imagem
        : `https://picsum.photos/seed/jogo-${j.id}/960/384`,
    apiNumericId: j.id,
    link: j.link,
    imagem: j.imagem,
  }
}

export type AtualizarJogoBody = {
  titulo: string
  genero?: string | null
  nota?: number | null
  link?: string | null
  imagem?: string | null
  status?: 'A_JOGAR' | 'CONCLUIDO'
}

/** Corpo para PUT /api/jogos/:id a partir do card */
export function gameToJogoUpdatePayload(game: Game): {
  titulo: string
  genero: string | null
  nota: number | null
  link: string | null
  imagem: string | null
} {
  const genero =
    !game.genre || game.genre === '—' ? null : game.genre
  let nota: number | null = null
  if (game.rating && game.rating !== '—') {
    const n = Number(String(game.rating).replace(',', '.'))
    if (!Number.isNaN(n)) nota = n
  }
  return {
    titulo: game.title,
    genero,
    nota,
    link: game.link ?? null,
    imagem: game.imagem ?? null,
  }
}

export async function updateJogo(
  id: number,
  body: AtualizarJogoBody,
): Promise<JogoDto> {
  const r = await fetch(`${BASE}/api/jogos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: body.titulo,
      genero: body.genero ?? null,
      nota: body.nota ?? null,
      link: body.link ?? null,
      imagem: body.imagem ?? null,
      status: body.status ?? null,
    }),
  })
  if (!r.ok) {
    const text = await r.text()
    throw new Error(text || `Falha ao atualizar (${r.status})`)
  }
  return r.json()
}

export async function createJogo(body: CriarJogoBody): Promise<JogoDto> {
  const r = await fetch(`${BASE}/api/jogos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: body.titulo,
      genero: body.genero || null,
      nota: body.nota ?? null,
      link: body.link || null,
      imagem: body.imagem || null,
    }),
  })
  if (!r.ok) {
    const text = await r.text()
    throw new Error(text || `Falha ao criar (${r.status})`)
  }
  return r.json()
}
