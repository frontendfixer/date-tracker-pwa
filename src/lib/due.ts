import { addDays, addMonths, differenceInCalendarDays } from 'date-fns'

export type UntilDue = {
  /** Calendar days from `today` to the due date. Negative once overdue. */
  days: number
  weeks: number
  weekRemainderDays: number
}

/**
 * Expected date of delivery by Naegele's rule as applied in Indian antenatal
 * practice: first day of the last menstrual period + 9 calendar months + 7 days.
 * This lands 280–283 days after the LMP depending on month lengths.
 * `addMonths` end-of-month clamping is date-fns behaviour (31 May → 28 Feb).
 */
export function dueDate(lmp: Date): Date {
  return addDays(addMonths(lmp, 9), 7)
}

/** `due` and `today` are local start-of-day dates. */
export function untilDue(due: Date, today: Date): UntilDue {
  const days = differenceInCalendarDays(due, today)
  const ahead = Math.max(0, days)
  return { days, weeks: Math.floor(ahead / 7), weekRemainderDays: ahead % 7 }
}
