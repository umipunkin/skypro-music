import { describe, it, expect } from 'vitest'
import {
  filterByAuthors,
  filterByYears,
  filterByGenres,
  searchTracks
} from './filters'

describe('Filter Functions - чистые функции', () => {
  const mockTracks = [
    {
      id: '1',
      title: 'Rock Song',
      author: 'Rock Band',
      album: 'Rock Album',
      genre: 'Rock',
      release_date: '2020-01-01'
    },
    {
      id: '2',
      title: 'Pop Song',
      author: 'Pop Singer',
      album: 'Pop Album',
      genre: 'Pop',
      release_date: '2021-01-01'
    },
    {
      id: '3',
      title: 'Jazz Song',
      author: 'Jazz Band',
      album: 'Jazz Album',
      genre: 'Jazz',
      release_date: '2022-01-01'
    }
  ]

  describe('filterByAuthors', () => {
    it('возвращает все треки если нет фильтров', () => {
      const result = filterByAuthors(mockTracks, [])
      expect(result).toEqual(mockTracks)
    })

    it('фильтрует по одному автору', () => {
      const result = filterByAuthors(mockTracks, ['Rock Band'])
      expect(result).toHaveLength(1)
      expect(result[0].author).toBe('Rock Band')
    })

    it('фильтрует по нескольким авторам', () => {
      const result = filterByAuthors(mockTracks, ['Rock Band', 'Jazz Band'])
      expect(result).toHaveLength(2)
      expect(result.map(t => t.author)).toEqual(['Rock Band', 'Jazz Band'])
    })

    it('возвращает пустой массив если нет совпадений', () => {
      const result = filterByAuthors(mockTracks, ['Unknown Artist'])
      expect(result).toHaveLength(0)
    })
  })

  describe('filterByYears', () => {
    it('возвращает все треки если нет фильтров', () => {
      const result = filterByYears(mockTracks, [])
      expect(result).toEqual(mockTracks)
    })

    it('фильтрует по одному году', () => {
      const result = filterByYears(mockTracks, [2020])
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Rock Song')
    })

    it('фильтрует по нескольким годам', () => {
      const result = filterByYears(mockTracks, [2020, 2021])
      expect(result).toHaveLength(2)
      expect(result.map(t => t.title)).toEqual(['Rock Song', 'Pop Song'])
    })

    it('игнорирует треки без даты', () => {
      const tracksWithNullDate = [
        { ...mockTracks[0], release_date: null },
        { ...mockTracks[1], release_date: '2021-01-01' }
      ]
      const result = filterByYears(tracksWithNullDate, [2020])
      expect(result).toHaveLength(0)
    })
  })

  describe('filterByGenres', () => {
    it('возвращает все треки если нет фильтров', () => {
      const result = filterByGenres(mockTracks, [])
      expect(result).toEqual(mockTracks)
    })

    it('фильтрует по одному жанру', () => {
      const result = filterByGenres(mockTracks, ['Rock'])
      expect(result).toHaveLength(1)
      expect(result[0].genre).toBe('Rock')
    })

    it('фильтрует по нескольким жанрам', () => {
      const result = filterByGenres(mockTracks, ['Rock', 'Jazz'])
      expect(result).toHaveLength(2)
      expect(result.map(t => t.genre)).toEqual(['Rock', 'Jazz'])
    })
  })

  describe('searchTracks', () => {
    it('возвращает все треки если поисковый запрос пустой', () => {
      const result = searchTracks(mockTracks, '')
      expect(result).toEqual(mockTracks)
    })

    it('возвращает все треки если поисковый запрос только из пробелов', () => {
      const result = searchTracks(mockTracks, '   ')
      expect(result).toEqual(mockTracks)
    })

    it('ищет по названию трека', () => {
      const result = searchTracks(mockTracks, 'rock')
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Rock Song')
    })

    it('ищет по автору', () => {
      const result = searchTracks(mockTracks, 'band')
      expect(result).toHaveLength(2)
      expect(result.map(t => t.author)).toEqual(['Rock Band', 'Jazz Band'])
    })

    it('ищет по альбому', () => {
      const result = searchTracks(mockTracks, 'jazz album')
      expect(result).toHaveLength(1)
      expect(result[0].album).toBe('Jazz Album')
    })

    it('ищет по жанру', () => {
      const result = searchTracks(mockTracks, 'pop')
      expect(result).toHaveLength(1)
      expect(result[0].genre).toBe('Pop')
    })

    it('регистронезависимый поиск', () => {
      const result = searchTracks(mockTracks, 'ROCK')
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Rock Song')
    })

    it('возвращает пустой массив если нет совпадений', () => {
      const result = searchTracks(mockTracks, 'nonexistent')
      expect(result).toHaveLength(0)
    })
  })
})