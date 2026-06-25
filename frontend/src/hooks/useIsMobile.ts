import { useState, useEffect } from 'react'

export const useIsMobile = (breakpoint: number = 600) => {
  // Initialise from the real viewport width to avoid a desktop->mobile flash
  // on first paint. Guarded for non-DOM (SSR) environments.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < breakpoint
  )

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkIsMobile()

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [breakpoint])

  return isMobile
}
