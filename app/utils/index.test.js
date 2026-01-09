import { describe, it, expect } from 'vitest'
import {
  cleanTrackTitle,
  getErrorMessage,
  validateEmail,
  validatePassword,
  validateUsername
} from './index'

describe('Utils - чистые функции', () => {
  describe('cleanTrackTitle', () => {
    it('возвращает "Без названия" для пустого значения', () => {
      expect(cleanTrackTitle('')).toBe('Без названия')
      expect(cleanTrackTitle(null)).toBe('Без названия')
      expect(cleanTrackTitle(undefined)).toBe('Без названия')
    })

    it('удаляет URL из названия', () => {
      const title = 'Track http://example.com/audio.mp3 Name'
      expect(cleanTrackTitle(title)).toBe('Track Name')
    })

    it('удаляет аудио расширения', () => {
      expect(cleanTrackTitle('Track.mp3')).toBe('Track')
      expect(cleanTrackTitle('Track.WAV')).toBe('Track')
      expect(cleanTrackTitle('Track.flac')).toBe('Track')
      expect(cleanTrackTitle('Track.ogg')).toBe('Track')
    })

    it('удаляет лишние пробелы', () => {
      expect(cleanTrackTitle('  Track  Name  ')).toBe('Track Name')
      expect(cleanTrackTitle('Track\tName')).toBe('Track Name')
      expect(cleanTrackTitle('Track\nName')).toBe('Track Name')
    })

    it('сохраняет оригинальное название без изменений', () => {
      expect(cleanTrackTitle('My Favorite Song')).toBe('My Favorite Song')
      expect(cleanTrackTitle('Песня 2024')).toBe('Песня 2024')
    })
  })

  describe('getErrorMessage', () => {
    it('обрабатывает ошибку таймаута', () => {
      const error = { name: 'AbortError' }
      expect(getErrorMessage(error)).toBe('Превышено время ожидания сервера. Проверьте подключение к интернету.')
    })

    it('обрабатывает ошибку сети', () => {
      const error = { message: 'Failed to fetch' }
      expect(getErrorMessage(error)).toBe('Не удалось подключиться к серверу. Проверьте подключение к интернету.')
    })

    it('обрабатывает 404 ошибку', () => {
      const error = { response: { status: 404 } }
      expect(getErrorMessage(error)).toBe('Сервер временно недоступен. Попробуйте позже.')
    })

    it('обрабатывает 500 ошибку', () => {
      const error = { response: { status: 500 } }
      expect(getErrorMessage(error)).toBe('Ошибка на сервере. Попробуйте позже.')
    })

    it('использует сообщение об ошибке по умолчанию', () => {
      const error = { message: 'Custom error' }
      expect(getErrorMessage(error)).toBe('Custom error')
    })

    it('использует дефолтное сообщение если нет информации', () => {
      const error = {}
      expect(getErrorMessage(error)).toBe('Не удалось загрузить треки. Попробуйте обновить страницу.')
    })
  })

  describe('validateEmail', () => {
    it('валидирует пустой email', () => {
      expect(validateEmail('')).toBe('Поле email обязательно для заполнения')
      expect(validateEmail(null)).toBe('Поле email обязательно для заполнения')
      expect(validateEmail(undefined)).toBe('Поле email обязательно для заполнения')
    })

    it('валидирует некорректный email', () => {
      expect(validateEmail('invalid')).toBe('Введите корректный email')
      expect(validateEmail('invalid@')).toBe('Введите корректный email')
      expect(validateEmail('invalid@domain')).toBe('Введите корректный email')
      expect(validateEmail('@domain.com')).toBe('Введите корректный email')
    })

    it('возвращает пустую строку для валидного email', () => {
      expect(validateEmail('test@example.com')).toBe('')
      expect(validateEmail('user.name@domain.co.uk')).toBe('')
      expect(validateEmail('test+tag@example.com')).toBe('')
    })
  })

  describe('validatePassword', () => {
    it('валидирует пустой пароль', () => {
      expect(validatePassword('')).toBe('Поле пароль обязательно для заполнения')
    })

    it('валидирует короткий пароль', () => {
      expect(validatePassword('12345')).toBe('Пароль должен содержать минимум 6 символов')
    })

    it('возвращает пустую строку для валидного пароля', () => {
      expect(validatePassword('123456')).toBe('')
      expect(validatePassword('password')).toBe('')
      expect(validatePassword('securePass123!')).toBe('')
    })
  })

  describe('validateUsername', () => {
    it('валидирует пустое имя пользователя', () => {
      expect(validateUsername('')).toBe('Поле имя пользователя обязательно для заполнения')
    })

    it('валидирует короткое имя пользователя', () => {
      expect(validateUsername('ab')).toBe('Имя пользователя должно содержать минимум 3 символа')
    })

    it('возвращает пустую строку для валидного имени', () => {
      expect(validateUsername('abc')).toBe('')
      expect(validateUsername('username')).toBe('')
      expect(validateUsername('user123')).toBe('')
    })
  })
})