export const useTracks = () => {
  const tracks = ref([]);
  const filteredTracks = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentFilters = ref({});

  const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

  const fetchTracks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${API_URL}/catalog/track/all/`);

      if (!response.data) {
        throw new Error("Некорректная структура данных от сервера");
      }

      tracks.value = response.data.map((track) => {
        let genre = track.genre || "Неизвестный жанр";
        if (Array.isArray(genre)) {
          genre = genre[0] || "Неизвестный жанр";
        }

        return {
          id: track.id,
          title: track.name || "Без названия",
          subtitle: track.track_file || "",
          author: track.author || "Неизвестный исполнитель",
          album: track.album || "Неизвестный альбом",
          duration: formatDuration(track.duration_in_seconds || 0),
          genre: genre,
          release_date: track.release_date || null,
          url: track.track_file || "#",
          artistUrl: "#",
          albumUrl: "#",
        };
      });

      filteredTracks.value = [...tracks.value];
    } catch (e) {
      error.value = e.message || "Ошибка при загрузке треков :(";
      console.error(" Ошибка загрузки треков:", e);
    } finally {
      loading.value = false;
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const applyFilters = (filters) => {
    currentFilters.value = filters;

    if (
      Object.keys(filters).length === 0 ||
      (filters.authors?.length === 0 &&
        filters.years?.length === 0 &&
        filters.genres?.length === 0)
    ) {
      filteredTracks.value = [...tracks.value];
      return;
    }

    filteredTracks.value = tracks.value.filter((track) => {
      const authorMatch =
        filters.authors?.length === 0 || filters.authors.includes(track.author);

      const trackYear = track.release_date
        ? new Date(track.release_date).getFullYear()
        : null;
      const yearMatch =
        filters.years?.length === 0 ||
        (trackYear && filters.years.includes(trackYear));

      const genreMatch =
        filters.genres?.length === 0 || filters.genres.includes(track.genre);

      return authorMatch && yearMatch && genreMatch;
    });
  };

  const searchTracks = async (query) => {
    if (!query.trim()) {
      await fetchTracks();
      return;
    }

    loading.value = true;
    try {
      const searchResults = tracks.value.filter(
        (track) =>
          track.title?.toLowerCase().includes(query.toLowerCase()) ||
          track.author?.toLowerCase().includes(query.toLowerCase()) ||
          track.album?.toLowerCase().includes(query.toLowerCase()) ||
          track.genre?.toLowerCase().includes(query.toLowerCase())
      );
      filteredTracks.value = searchResults;
    } catch (e) {
      error.value = "Ошибка при поиске треков";
      console.error("Ошибка поиска:", e);
    } finally {
      loading.value = false;
    }
  };

  const clearFilters = () => {
    currentFilters.value = {};
    filteredTracks.value = [...tracks.value];
  };

  return {
    tracks: readonly(tracks),
    filteredTracks: readonly(filteredTracks),
    loading: readonly(loading),
    error: readonly(error),
    currentFilters: readonly(currentFilters),
    fetchTracks,
    formatDuration,
    applyFilters,
    searchTracks,
    clearFilters,
  };
};
