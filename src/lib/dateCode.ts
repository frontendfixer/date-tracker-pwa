import { isAfter, startOfDay } from 'date-fns'

/**
 * Parse a DDMMYY passcode into a local calendar day.
 * Returns null when the code is not a real date on or before `today`.
 * `today` is any local instant; only its calendar day is used.
 */
export function parseDateCode(code: string, today: Date): Date | null {
  if (!/^[0-9]{6}$/.test(code)) return null

  const day = Number(code.slice(0, 2))
  const month = Number(code.slice(2, 4))
  const year = 2000 + Number(code.slice(4, 6))

  if (month < 1 || month > 12) return null

  // Local calendar constructor. Do not parse an ISO date string (that is UTC).
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  const from = startOfDay(date)
  if (isAfter(from, startOfDay(today))) return null
  return from
}
