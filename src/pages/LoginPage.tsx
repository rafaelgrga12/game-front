import { useState, type FormEvent } from 'react'
import { login as loginRequest } from '../api/auth'
import { IconGamepad } from '../icons'
import './LoginPage.css'

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m22 6-10 7L2 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

type LoginPageProps = {
  onLoggedIn: () => void
}

export default function LoginPage({ onLoggedIn }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const eTrim = email.trim()
    if (!eTrim || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    setSubmitting(true)
    try {
      await loginRequest(eTrim, password)
      onLoggedIn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__gradient" aria-hidden />
      <div className="login-page__glow" aria-hidden />

      <main className="login-card">
        <header className="login-card__header">
          <div className="login-card__brand">
            <IconGamepad className="login-card__brand-icon" size={32} />
          </div>
          <h1 className="login-card__title">Bem-vindo de volta</h1>
          <p className="login-card__subtitle">Acesse sua coleção de jogos</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="login-form__error" role="alert">
              {error}
            </p>
          )}
          <div className="login-field">
            <label className="login-field__label" htmlFor="login-email">
              Email
            </label>
            <div className="login-field__control">
              <span className="login-field__icon" aria-hidden>
                <IconMail />
              </span>
              <input
                id="login-email"
                className="login-field__input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field__label" htmlFor="login-password">
              Senha
            </label>
            <div className="login-field__control">
              <span className="login-field__icon" aria-hidden>
                <IconLock />
              </span>
              <input
                id="login-password"
                className="login-field__input"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </main>
    </div>
  )
}
