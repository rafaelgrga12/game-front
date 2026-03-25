import { IconCheck, IconExternalLink, IconStar } from '../icons'
import type { Game } from '../data/games'

type GameCardProps = {
  game: Game
  showCompletedBadge?: boolean
  showMarkComplete?: boolean
  onMarkComplete?: () => void
  markCompleteBusy?: boolean
}

export function GameCard({
  game,
  showCompletedBadge,
  showMarkComplete,
  onMarkComplete,
  markCompleteBusy,
}: GameCardProps) {
  return (
    <article className="game-card">
      <div className="game-card__media">
        {showCompletedBadge && (
          <div className="game-card__status">
            <IconCheck className="game-card__status-icon" />
            Concluído
          </div>
        )}
        <img
          className="game-card__img"
          src={game.coverUrl}
          alt=""
          loading="lazy"
          width={960}
          height={384}
        />
      </div>
      <div className="game-card__body">
        <h2 className="game-card__heading">{game.title}</h2>
        <div className="game-card__meta">
          <span className="game-card__rating">
            <IconStar className="game-card__rating-star" />
            {game.rating}
          </span>
          <span className="game-card__sep" aria-hidden>
            •
          </span>
          <span className="game-card__badge">{game.genre}</span>
        </div>
        <div className="game-card__actions">
          {showMarkComplete && onMarkComplete && (
            <button
              type="button"
              className="game-card__complete"
              onClick={onMarkComplete}
              disabled={markCompleteBusy}
            >
              <IconCheck aria-hidden />
              {markCompleteBusy ? 'Salvando…' : 'Marcar como concluído'}
            </button>
          )}
          <button type="button" className="game-card__action">
            Ver Jogo
            <IconExternalLink aria-hidden />
          </button>
        </div>
      </div>
    </article>
  )
}
