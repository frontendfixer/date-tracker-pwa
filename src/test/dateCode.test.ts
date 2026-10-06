import { describe, expect, it } from 'vitest'
import { parseDateCode } from '../lib/dateCode'

const oct6 = new Date(2026, 9, 6, 15, 4, 0)

describe('parseDateCode', () => {
  it('accepts 170226 as 17 February 2026', () => {
    const parsed = parseDateCode('170226', oct6)
    expect(parsed).not.toBeNull()
    expect(parsed!.getFullYear()).toBe(2026)
    expect(parsed!.getMonth()).toBe(1)
    expect(parsed!.getDate()).toBe(17)
    expect(parsed!.getHours()).toBe(0)
  })

  it('accepts the leap day 29 February 2024', () => {
    const parsed = parseDateCode('290224', oct6)
    expect(parsed).not.toBeNull()
    expect(parsed!.getFullYear()).toBe(2024)
    expect(parsed!.getMonth()).toBe(1)
    expect(parsed!.getDate()).toBe(29)
  })

  it('accepts 1 January 2000', () => {
    const parsed = parseDateCode('010100', oct6)
    expect(parsed).not.toBeNull()
    expect(parsed!.getFullYear()).toBe(2000)
    expect(parsed!.getMonth()).toBe(0)
    expect(parsed!.getDate()).toBe(1)
  })

  it("accepts today's own code, including late in the day", () => {
    const parsed = parseDateCode('061026', oct6)
    expect(parsed).not.toBeNull()
    expect(parsed!.getFullYear()).toBe(2026)
    expect(parsed!.getMonth()).toBe(9)
    expect(parsed!.getDate()).toBe(6)

    const now = new Date()
    const code = [
      String(now.getDate()).padStart(2, '0'),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getFullYear() % 100).padStart(2, '0'),
    ].join('')
    const today = parseDateCode(code, now)
    expect(today).not.toBeNull()
    expect(today!.getFullYear()).toBe(now.getFullYear())
    expect(today!.getMonth()).toBe(now.getMonth())
    expect(today!.getDate()).toBe(now.getDate())
  })

  it.each(['310226', '321226', '000126', '011326', '290225', '310426'])(
    'rejects impossible date %s',
    (code) => {
      expect(parseDateCode(code, oct6)).toBeNull()
    },
  )

  it.each(['12345', '1234567', 'abcdef', '17022a', ' 170226', '170226 '])(
    'rejects malformed code %s',
    (code) => {
      expect(parseDateCode(code, oct6)).toBeNull()
    },
  )

  it('rejects a future date relative to the injected today', () => {
    expect(parseDateCode('071026', oct6)).toBeNull()
    expect(parseDateCode('170226', new Date(2026, 0, 1))).toBeNull()
    expect(parseDateCode('010199', new Date(2026, 9, 6))).toBeNull()
  })
})
