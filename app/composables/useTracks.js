
export const useTracks = () => {
    const tracks = ref([])
    const loading = ref(false)
    const error = ref(null)
  
    const API_URL = 'https://webdev-music-003b5b991590.herokuapp.com'
  
    const fetchTracks = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await $fetch(`${API_URL}/catalog/track/all/`)
        
        tracks.value = response.data.map(track => ({
          id: track.id,
          title: track.name,
          subtitle: track.track_file || '',
          author: track.author || 'Неизвестный исполнитель',
          album: track.album || 'Неизвестный альбом',
          duration: formatDuration(track.duration_in_seconds || 0),
          url: track.track_file || '#',
          artistUrl: '#',
          albumUrl: '#'
        }))
      } catch (e) {
        error.value = e.message || 'Ошибка при загрузке треков :('
        console.error('Ошибка загрузки треков:', e)
      } finally {
        loading.value = false
      }
    }
  
    const formatDuration = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  
    const searchTracks = async (query) => {
      if (!query.trim()) {
        await fetchTracks()
        return
      }
      
      loading.value = true
      try {
        const filteredTracks = tracks.value.filter(track => 
          track.title?.toLowerCase().includes(query.toLowerCase()) ||
          track.author?.toLowerCase().includes(query.toLowerCase()) ||
          track.album?.toLowerCase().includes(query.toLowerCase())
        )
        tracks.value = filteredTracks
      } catch (e) {
        error.value = 'Ошибка при поиске треков'
        console.error('Ошибка поиска:', e)
      } finally {
        loading.value = false
      }
    }
  
    return {
      tracks: readonly(tracks),
      loading: readonly(loading),
      error: readonly(error),
      fetchTracks,
      formatDuration,
      searchTracks,
    }
  }