import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { isAuthenticated } from './api/auth'
import CollectionPage from './pages/CollectionPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  const [authVersion, setAuthVersion] = useState(0)
  const bump = useCallback(() => setAuthVersion((v) => v + 1), [])

  useEffect(() => {
    function onHash() {
      bump()
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [bump])

  const authed = isAuthenticated()

  useLayoutEffect(() => {
    if (authed && window.location.hash !== '#/colecao') {
      window.location.replace('#/colecao')
    }
    if (!authed && window.location.hash === '#/colecao') {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [authed, authVersion])

  const handleLoggedIn = useCallback(() => {
    bump()
    window.location.hash = '#/colecao'
  }, [bump])

  if (!isAuthenticated()) {
    return <LoginPage onLoggedIn={handleLoggedIn} />
  }

  return <CollectionPage />
}
