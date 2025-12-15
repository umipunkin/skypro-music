import { describe, it, expect } from 'vitest'
import { formatDuration } from './useTracks'

describe('formatDuration', () => {
  it('форматирует 0 секунд', () => {
    expect(formatDuration(0)).toBe("0:00")
  })

  it('форматирует секунды меньше минуты', () => {
    expect(formatDuration(5)).toBe("0:05")
    expect(formatDuration(30)).toBe("0:30")
    expect(formatDuration(59)).toBe("0:59")
  })

  it('форматирует минуты и секунды', () => {
    expect(formatDuration(60)).toBe("1:00")
    expect(formatDuration(65)).toBe("1:05")
    expect(formatDuration(125)).toBe("2:05")
    expect(formatDuration(600)).toBe("10:00")
    expect(formatDuration(3599)).toBe("59:59")
  })

  it('обрабатывает некорректные значения', () => {
    expect(formatDuration()).toBe("")
    expect(formatDuration(null)).toBe("")
    expect(formatDuration(undefined)).toBe("")
    expect(formatDuration(NaN)).toBe("")
    expect(formatDuration('invalid')).toBe("")
    expect(formatDuration(-5)).toBe("")
  })
})