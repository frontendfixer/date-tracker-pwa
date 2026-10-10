import { format } from 'date-fns'
import type { UntilDue } from './due'
import type { Elapsed } from './elapsed'

export function formatWeekday(date: Date): string {
  return format(date, 'EEEE').toUpperCase()
}

export function formatDateLine(date: Date): { dayMonth: string; year: string } {
  return {
    dayMonth: `${format(date, 'dd')} ${format(date, 'MMMM').toUpperCase()}`,
    year: format(date, 'yy'),
  }
}

export function formatPrimaryCount(value: number): string {
  return value.toLocaleString('en-US')
}

export function unitWord(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`
}

export function formatQuantity(count: number, singular: string): string {
  return `${count} ${unitWord(count, singular)}`
}

/** Weeks and months lines. A line is omitted when its leading unit is 0. */
export function breakdownLines(result: Elapsed): string[] {
  const lines: string[] = []
  if (result.weeks > 0) {
    lines.push(
      `${formatQuantity(result.weeks, 'week')} · ${formatQuantity(result.weekRemainderDays, 'day')}`,
    )
  }
  if (result.months > 0) {
    lines.push(
      `${formatQuantity(result.months, 'month')} · ${formatQuantity(result.monthRemainderDays, 'day')}`,
    )
  }
  return lines
}

/**
 * Countdown to the due date as a large count and its label.
 * On the due date there is no count, only the label.
 */
export function untilDueParts(result: UntilDue): { value: string | null; label: string } {
  if (result.days === 0) return { value: null, label: 'Due today' }
  const count = Math.abs(result.days)
  const tail = result.days < 0 ? 'past due' : 'to go'
  return { value: formatPrimaryCount(count), label: `${unitWord(count, 'day')} ${tail}` }
}

/** Weeks line under the countdown. Omitted when under a week remains. */
export function untilDueWeeksLine(result: UntilDue): string | null {
  if (result.weeks === 0) return null
  return `${formatQuantity(result.weeks, 'week')} · ${formatQuantity(result.weekRemainderDays, 'day')}`
}
