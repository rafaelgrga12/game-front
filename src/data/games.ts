export type Game = {
  id: string
  title: string
  rating: string
  genre: string
  /** URL estável para capa (substitua por assets do backend quando existir) */
  coverUrl: string
  /** Presente quando o item veio do backend — permite marcar como concluído */
  apiNumericId?: number
  link?: string | null
  /** URL de capa persistida na API (pode ser null; coverUrl pode ser placeholder) */
  imagem?: string | null
}

/** Quando a API falha, listas ficam vazias (dados vêm do backend). */
export const playingFallback: Game[] = []
export const completedFallback: Game[] = []
