import { useCallback, useEffect, useState } from 'react'
import {
  fetchJogos,
  gameToJogoUpdatePayload,
  jogoDtoToGame,
  updateJogo,
} from '../api/jogos'
import { AddGameModal } from '../components/AddGameModal'
import { GameCard } from '../components/GameCard'
import { IconCheck, IconGamepad, IconPlus } from '../icons'
import {
  type Game,
  completedFallback,
  playingFallback,
} from '../data/games'
import './CollectionPage.css'

type TabId = 'playing' | 'completed'

export default function CollectionPage() {
  const [tab, setTab] = useState<TabId>('playing')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [playingList, setPlayingList] = useState<Game[]>(playingFallback)
  const [completedList, setCompletedList] = useState<Game[]>(completedFallback)
  const [completingId, setCompletingId] = useState<string | null>(null)

  const loadLists = useCallback(async () => {
    try {
      const [aJogar, concluidos] = await Promise.all([
        fetchJogos('A_JOGAR'),
        fetchJogos('CONCLUIDO'),
      ])
      setPlayingList(aJogar.map(jogoDtoToGame))
      setCompletedList(concluidos.map(jogoDtoToGame))
    } catch {
      setPlayingList(playingFallback)
      setCompletedList(completedFallback)
    }
  }, [])

  useEffect(() => {
    void loadLists()
  }, [loadLists])

  const closeAddModal = useCallback(() => setAddModalOpen(false), [])

  function goToTab(next: TabId) {
    setTab(next)
    setAddModalOpen(false)
  }

  const subtitle =
    tab === 'completed' ? 'Games Concluídos' : 'Games que pretendemos jogar'

  async function handleMarkComplete(game: Game) {
    if (game.apiNumericId == null) return
    setCompletingId(game.id)
    try {
      await updateJogo(game.apiNumericId, {
        ...gameToJogoUpdatePayload(game),
        status: 'CONCLUIDO',
      })
      await loadLists()
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : 'Não foi possível marcar como concluído.',
      )
    } finally {
      setCompletingId(null)
    }
  }

  return (
    <div className="collection">
      <header className="collection__header">
        <div className="collection__header-inner">
          <div className="collection__brand-row">
            <div className="collection__logo" aria-hidden>
              <IconGamepad size={24} />
            </div>
            <div className="collection__titles">
              <h1 className="collection__title">Coleção de Jogos</h1>
              <p className="collection__subtitle">{subtitle}</p>
            </div>
          </div>

          <nav className="collection__nav" aria-label="Seções da coleção">
            <button
              type="button"
              className={
                tab === 'playing'
                  ? 'collection__nav-btn collection__nav-btn--active'
                  : 'collection__nav-btn collection__nav-btn--ghost'
              }
              aria-pressed={tab === 'playing'}
              onClick={() => goToTab('playing')}
            >
              A Jogar
            </button>
            <button
              type="button"
              className={
                tab === 'completed'
                  ? 'collection__nav-btn collection__nav-btn--active'
                  : 'collection__nav-btn collection__nav-btn--ghost'
              }
              aria-pressed={tab === 'completed'}
              onClick={() => goToTab('completed')}
            >
              <IconCheck />
              Concluídos
            </button>
            <button
              type="button"
              className="collection__nav-btn collection__nav-btn--ghost"
              aria-expanded={addModalOpen}
              onClick={() => setAddModalOpen(true)}
            >
              <IconPlus />
              Adicionar Jogo
            </button>
          </nav>
        </div>
      </header>

      <main className="collection__main">
        {tab === 'playing' && (
          <div className="collection__grid">
            {playingList.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                showMarkComplete={game.apiNumericId != null}
                onMarkComplete={
                  game.apiNumericId != null
                    ? () => void handleMarkComplete(game)
                    : undefined
                }
                markCompleteBusy={completingId === game.id}
              />
            ))}
          </div>
        )}

        {tab === 'completed' && (
          <div className="collection__grid">
            {completedList.map((game) => (
              <GameCard key={game.id} game={game} showCompletedBadge />
            ))}
          </div>
        )}
      </main>

      <AddGameModal
        open={addModalOpen}
        onClose={closeAddModal}
        onCreated={loadLists}
      />
    </div>
  )
}
