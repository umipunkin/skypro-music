export const filterByAuthors = (tracks, authors) => {
    if (authors.length === 0) return tracks
    return tracks.filter(track => authors.includes(track.author))
  }
  
  export const filterByYears = (tracks, years) => {
    if (years.length === 0) return tracks
    return tracks.filter(track => {
      const trackYear = track.release_date
        ? new Date(track.release_date).getFullYear()
        : null
      return trackYear && years.includes(trackYear)
    })
  }
  
  export const filterByGenres = (tracks, genres) => {
    if (genres.length === 0) return tracks
    return tracks.filter(track => genres.includes(track.genre))
  }
  
  export const searchTracks = (tracks, query) => {
    if (!query.trim()) return tracks
    const searchTerm = query.toLowerCase()
    return tracks.filter(track =>
      track.title?.toLowerCase().includes(searchTerm) ||
      track.author?.toLowerCase().includes(searchTerm) ||
      track.album?.toLowerCase().includes(searchTerm) ||
      track.genre?.toLowerCase().includes(searchTerm)
    )
  }