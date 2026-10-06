import { describe, expect, it } from 'vitest'
import { elapsed } from '../lib/elapsed'
import {
  breakdownLines,
  formatDateLine,
  formatPrimaryCount,
  formatWeekday,
  unitWord,
} from '../lib/format'

describe('elapsed', () => {
  it('matches the 17 Feb 2026 → 6 Oct 2026 fixture', () => {
    const from = new Date(2026, 1, 17)
    const today = new Date(2026, 9, 6)
    const result = elapsed(from, today)

    expect(formatWeekday(from)).toBe('TUESDAY')
    expect(formatDateLine(from)).toEqual({ dayMonth: '17 FEBRUARY', year: '26' })
    expect(result).toEqual({
      days: 231,
      weeks: 33,
      weekRemainderDays: 0,
      months: 7,
      monthRemainderDays: 19,
    })
    expect(formatPrimaryCount(result.days)).toBe('231')
    expect(breakdownLines(result)).toEqual(['33 weeks · 0 days', '7 months · 19 days'])
    expect(unitWord(0, 'day')).toBe('days')
    expect(unitWord(1, 'day')).toBe('day')
    expect(unitWord(2, 'day')).toBe('days')
    expect(unitWord(1, 'week')).toBe('week')
    expect(unitWord(1, 'month')).toBe('month')
  })

  it('groups the primary count', () => {
    expect(formatPrimaryCount(1024)).toBe('1,024')
  })

  it('is zero on the same calendar day and hides both breakdown lines', () => {
    const today = new Date(2026, 9, 6)
    const result = elapsed(today, today)
    expect(result.days).toBe(0)
    expect(result.weeks).toBe(0)
    expect(result.months).toBe(0)
    expect(breakdownLines(result)).toEqual([])
  })

  it('hides a breakdown line when its leading unit is zero', () => {
    const from = new Date(2026, 0, 1)
    const sixDays = elapsed(from, new Date(2026, 0, 7))
    expect(sixDays.days).toBe(6)
    expect(sixDays.weeks).toBe(0)
    expect(breakdownLines(sixDays)).toEqual([])

    const eightDays = elapsed(from, new Date(2026, 0, 9))
    expect(eightDays).toMatchObject({
      days: 8,
      weeks: 1,
      weekRemainderDays: 1,
      months: 0,
    })
    expect(breakdownLines(eightDays)).toEqual(['1 week · 1 day'])
  })

  it('counts calendar days across a DST spring-forward', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/New_York')
    const from = new Date(2026, 2, 7)
    const today = new Date(2026, 2, 9)
    // 8 Mar 2026 is the US spring-forward: these midnights are 47 hours apart.
    expect((today.getTime() - from.getTime()) / 3_600_000).toBe(47)
    expect(elapsed(from, today).days).toBe(2)
  })

  it('clamps 31 Jan 2026 forward to the end of February', () => {
    const from = new Date(2026, 0, 31)
    const feb28 = elapsed(from, new Date(2026, 1, 28))
    expect(feb28).toMatchObject({
      days: 28,
      weeks: 4,
      weekRemainderDays: 0,
      months: 1,
      monthRemainderDays: 0,
    })
    expect(breakdownLines(feb28)).toEqual(['4 weeks · 0 days', '1 month · 0 days'])

    const mar1 = elapsed(from, new Date(2026, 2, 1))
    expect(mar1).toMatchObject({
      days: 29,
      weeks: 4,
      weekRemainderDays: 1,
      months: 1,
      monthRemainderDays: 1,
    })
    expect(breakdownLines(mar1)).toEqual(['4 weeks · 1 day', '1 month · 1 day'])
  })

  it('measures a year from leap day 29 Feb 2024', () => {
    const from = new Date(2024, 1, 29)
    const feb28 = elapsed(from, new Date(2025, 1, 28))
    expect(feb28).toMatchObject({
      days: 365,
      weeks: 52,
      weekRemainderDays: 1,
      months: 12,
      monthRemainderDays: 0,
    })
    expect(breakdownLines(feb28)).toEqual(['52 weeks · 1 day', '12 months · 0 days'])

    const mar1 = elapsed(from, new Date(2025, 2, 1))
    expect(mar1).toMatchObject({
      days: 366,
      weeks: 52,
      weekRemainderDays: 2,
      months: 12,
      monthRemainderDays: 1,
    })
    expect(breakdownLines(mar1)).toEqual(['52 weeks · 2 days', '12 months · 1 day'])
  })
})
