import { describe, expect, it } from 'vitest'
import { dueDate, untilDue } from '../lib/due'
import { elapsed } from '../lib/elapsed'
import { formatDateLine, formatWeekday, untilDueParts, untilDueWeeksLine } from '../lib/format'

describe('dueDate', () => {
  it('matches the 17 Feb 2026 → 6 Oct 2026 fixture', () => {
    const lmp = new Date(2026, 1, 17)
    const today = new Date(2026, 9, 6)
    const due = dueDate(lmp)

    expect(due).toEqual(new Date(2026, 10, 24))
    expect(formatWeekday(due)).toBe('TUESDAY')
    expect(formatDateLine(due)).toEqual({ dayMonth: '24 NOVEMBER', year: '26' })

    const result = untilDue(due, today)
    expect(result).toEqual({ days: 49, weeks: 7, weekRemainderDays: 0 })
    expect(untilDueParts(result)).toEqual({ value: '49', label: 'days to go' })
    expect(untilDueWeeksLine(result)).toBe('7 weeks · 0 days')
    expect(elapsed(lmp, today).days + result.days).toBe(280)
  })

  it('adds 9 calendar months and 7 days, not a flat 280 days', () => {
    const lmp = new Date(2025, 11, 1)
    const due = dueDate(lmp)
    expect(due).toEqual(new Date(2026, 8, 8))
    expect(elapsed(lmp, due).days).toBe(281)
  })

  it('clamps a 31 May LMP to the end of February before adding 7 days', () => {
    expect(dueDate(new Date(2026, 4, 31))).toEqual(new Date(2027, 2, 7))
    expect(dueDate(new Date(2027, 4, 31))).toEqual(new Date(2028, 2, 7))
  })

  it('counts calendar days across a DST fall-back', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/New_York')
    // 1 Nov 2026 is the US fall-back: these midnights are 49 hours apart.
    const result = untilDue(new Date(2026, 10, 2), new Date(2026, 9, 31))
    expect(result.days).toBe(2)
  })
})

describe('untilDue', () => {
  const due = new Date(2026, 10, 24)

  it('hides the weeks line inside the final week', () => {
    const result = untilDue(due, new Date(2026, 10, 23))
    expect(result).toEqual({ days: 1, weeks: 0, weekRemainderDays: 1 })
    expect(untilDueParts(result)).toEqual({ value: '1', label: 'day to go' })
    expect(untilDueWeeksLine(result)).toBeNull()
  })

  it('reads "Due today" on the due date', () => {
    const result = untilDue(due, due)
    expect(result.days).toBe(0)
    expect(untilDueParts(result)).toEqual({ value: null, label: 'Due today' })
    expect(untilDueWeeksLine(result)).toBeNull()
  })

  it('counts days past due with no weeks line', () => {
    const one = untilDue(due, new Date(2026, 10, 25))
    expect(one).toEqual({ days: -1, weeks: 0, weekRemainderDays: 0 })
    expect(untilDueParts(one)).toEqual({ value: '1', label: 'day past due' })

    const ten = untilDue(due, new Date(2026, 11, 4))
    expect(untilDueParts(ten)).toEqual({ value: '10', label: 'days past due' })
    expect(untilDueWeeksLine(ten)).toBeNull()
  })
})
