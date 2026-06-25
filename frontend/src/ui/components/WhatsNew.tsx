import { Link } from 'react-router-dom'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/ui/base/button'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Bump this when the announcement changes so it resurfaces once per update.
const WHATS_NEW_VERSION = '2026-06-paddock'

/**
 * Dismissible floating "what's new" CTA, pinned bottom-right. Replaces the old
 * full-width changelog banner. Dismissal persists per version via localStorage.
 */
export default function WhatsNew() {
  const [seenVersion, setSeenVersion] = useLocalStorage<string>(
    'paddock-whats-new',
    ''
  )

  if (seenVersion === WHATS_NEW_VERSION) return null

  const dismiss = () => setSeenVersion(WHATS_NEW_VERSION)

  return (
    <div className="fixed right-4 bottom-4 max-sm:bottom-24 z-50 w-[min(20rem,calc(100vw-2rem))]">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-subtle text-brand">
              <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="font-display text-base font-semibold text-foreground">
              What's new
            </h2>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="rounded-md p-1 text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <li>
            Meet <span className="font-medium text-foreground">Paddock</span> — a
            full visual redesign.
          </li>
          <li>
            Roster refreshed to the latest{' '}
            <span className="font-medium text-foreground">Global</span>{' '}
            characters.
          </li>
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link to="/instructions" onClick={dismiss}>
              How it works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={dismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}
