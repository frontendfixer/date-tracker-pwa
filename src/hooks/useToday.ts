import { addDays, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'

function msUntilNextLocalMidnight(now: Date): number {
  const next = addDays(startOfDay(now), 1)
  return Math.max(1_000, next.getTime() - now.getTime())
}

export function useToday(): Date {
  const [today, setToday] = useState(() => startOfDay(new Date()))

  useEffect(() => {
    let timer = 0

    const refresh = () => {
      const next = startOfDay(new Date())
      setToday((prev) => (prev.getTime() === next.getTime() ? prev : next))
    }

    const arm = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        refresh()
        arm()
      }, msUntilNextLocalMidnight(new Date()))
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh()
        arm()
      }
    }

    const onFocus = () => {
      refresh()
      arm()
    }

    arm()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return today
}
