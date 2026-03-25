import { useEffect, useId, useState, type FormEvent } from 'react'
import { createJogo } from '../api/jogos'
import { IconX } from '../icons'

type AddGameModalProps = {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

export function AddGameModal({ open: openProp, onClose, onCreated }: AddGameModalProps) {
  const titleId = useId()
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [rating, setRating] = useState('')
  const [link, setLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!openProp) return
    setError(null)
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [openProp, onClose])

  if (!openProp) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const titulo = title.trim()
    if (!titulo) {
      setError('Informe o título.')
      return
    }
    let nota: number | null = null
    if (rating.trim()) {
      const n = Number(rating.replace(',', '.'))
      if (Number.isNaN(n)) {
        setError('Nota inválida.')
        return
      }
      nota = n
    }
    setSubmitting(true)
    try {
      await createJogo({
        titulo,
        genero: genre.trim() || undefined,
        nota,
        link: link.trim() || undefined,
        imagem: imageUrl.trim() || undefined,
      })
      setTitle('')
      setGenre('')
      setRating('')
      setLink('')
      setImageUrl('')
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="add-game-modal"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="add-game-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="add-game-modal__close"
          onClick={onClose}
          aria-label="Fechar"
          disabled={submitting}
        >
          <IconX />
        </button>

        <div className="add-game-modal__header">
          <h2 id={titleId} className="add-game-modal__title">
            Adicionar Jogo
          </h2>
          <p className="add-game-modal__desc">
            Adicione um novo jogo à sua coleção.
          </p>
        </div>

        <form className="add-game-modal__form" onSubmit={handleSubmit}>
          {error && (
            <p className="add-game-modal__error" role="alert">
              {error}
            </p>
          )}
          <div className="add-game-modal__row">
            <label className="add-game-modal__label" htmlFor="add-game-title">
              Título
            </label>
            <input
              id="add-game-title"
              className="add-game-modal__input"
              placeholder="Nome do jogo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              disabled={submitting}
              required
            />
          </div>
          <div className="add-game-modal__row">
            <label className="add-game-modal__label" htmlFor="add-game-genre">
              Gênero
            </label>
            <input
              id="add-game-genre"
              className="add-game-modal__input"
              placeholder="Ex: RPG de Ação"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="add-game-modal__row">
            <label className="add-game-modal__label" htmlFor="add-game-rating">
              Nota
            </label>
            <input
              id="add-game-rating"
              className="add-game-modal__input"
              placeholder="Ex: 9.5"
              inputMode="decimal"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="add-game-modal__row">
            <label className="add-game-modal__label" htmlFor="add-game-link">
              Link
            </label>
            <input
              id="add-game-link"
              className="add-game-modal__input"
              placeholder="URL da loja"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="add-game-modal__row">
            <label className="add-game-modal__label" htmlFor="add-game-image">
              Imagem
            </label>
            <input
              id="add-game-image"
              className="add-game-modal__input add-game-modal__input--image"
              placeholder="URL da imagem"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="add-game-modal__submit"
            disabled={submitting}
          >
            {submitting ? 'Salvando…' : 'Adicionar Jogo'}
          </button>
        </form>
      </div>
    </div>
  )
}
