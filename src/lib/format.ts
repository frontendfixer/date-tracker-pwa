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

/** Countdown to the due date, or how far past it. */
export function formatUntilDue(result: UntilDue): string {
  if (result.days === 0) return 'Due today'
  if (result.days < 0) return `${formatQuantity(-result.days, 'day')} past due`
  return `${formatQuantity(result.days, 'day')} to go`
}

/** Weeks line under the countdown. Omitted when under a week remains. */
export function untilDueWeeksLine(result: UntilDue): string | null {
  if (result.weeks === 0) return null
  return `${formatQuantity(result.weeks, 'week')} · ${formatQuantity(result.weekRemainderDays, 'day')}`
}
