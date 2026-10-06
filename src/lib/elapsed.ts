import { addMonths, differenceInCalendarDays, differenceInMonths } from 'date-fns'

export type Elapsed = {
  days: number
  weeks: number
  weekRemainderDays: number
  months: number
  monthRemainderDays: number
}

/**
 * Calendar-day elapsed time. `from` and `today` are local start-of-day dates.
 * DST and the time of day do not affect the result.
 * `addMonths` end-of-month clamping is date-fns behaviour.
 */
export function elapsed(from: Date, today: Date): Elapsed {
  const days = differenceInCalendarDays(today, from)
  const weeks = Math.floor(days / 7)
  const weekRemainderDays = days % 7
  const months = differenceInMonths(today, from)
  const monthRemainderDays = differenceInCalendarDays(today, addMonths(from, months))

  return { days, weeks, weekRemainderDays, months, monthRemainderDays }
}
