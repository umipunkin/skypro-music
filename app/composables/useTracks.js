export const useTracks = () => {
  const tracks = ref([]);
  const filteredTracks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const filtersState = ref({
    activeFilters: {
      authors: [],
      years: [],
      genres: [],
    },
    searchQuery: "",
  });

  const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

  const cleanTrackTitle = (title) => {
    if (!title) return "Без названия";

    let cleanedTitle = title;
    cleanedTitle = cleanedTitle.replace(/https?:\/\/[^\s]+/g, "");
    cleanedTitle = cleanedTitle.replace(
      /\.(mp3|wav|flac|aac|ogg|m4a|wav)/gi,
      ""
    );
    cleanedTitle = cleanedTitle.replace(/\s+/g, " ").trim();

    return cleanedTitle || "Без названия";
  };

  const fetchTracks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`${API_URL}/catalog/track/all/`, {
        timeout: 10000,
        retry: 2,
      });

      if (!response.data) {
        throw new Error("Некорректная структура данных от сервера");
      }

      tracks.value = response.data.map((track) => {
        let genre = track.genre || "Неизвестный жанр";
        if (Array.isArray(genre)) {
          genre = genre[0] || "Неизвестный жанр";
        }

        const cleanedTitle = cleanTrackTitle(track.name);

        return {
          id: track._id,
          title: cleanedTitle,
          subtitle: "",
          author: track.author || "Неизвестный исполнитель",
          album: track.album || "Неизвестный альбом",
          duration: formatDuration(track.duration_in_seconds || 0),
          genre: genre,
          release_date: track.release_date || null,
          url: track.track_file || "#",
        };
      });

      filteredTracks.value = [...tracks.value];

      loadFiltersFromStorage();
      applyFilters();
    } catch (e) {
      console.error("Ошибка загрузки треков:", e);
      error.value = getErrorMessage(e);
    } finally {
      loading.value = false;
    }
  };

  const getErrorMessage = (error) => {
    if (error.name === "AbortError" || error.message.includes("timeout")) {
      return "Превышено время ожидания сервера. Проверьте подключение к интернету.";
    } else if (error.message.includes("Failed to fetch")) {
      return "Не удалось подключиться к серверу. Проверьте подключение к интернету.";
    } else if (error.response?.status === 404) {
      return "Сервер временно недоступен. Попробуйте позже.";
    } else if (error.response?.status >= 500) {
      return "Ошибка на сервере. Попробуйте позже.";
    } else {
      return (
        error.message ||
        "Не удалось загрузить треки. Попробуйте обновить страницу."
      );
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const loadFiltersFromStorage = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem("filtersState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          filtersState.value.activeFilters =
            parsed.activeFilters || filtersState.value.activeFilters;
          filtersState.value.searchQuery = parsed.searchQuery || "";
        } catch (error) {
          console.error("Error loading filters from localStorage:", error);
        }
      }
    }
  };

  const saveFiltersToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          "filtersState",
          JSON.stringify(filtersState.value)
        );
      } catch (error) {
        console.error("Error saving filters to localStorage:", error);
      }
    }
  };

  const applyFilters = () => {
    let result = [...tracks.value];

    if (filtersState.value.searchQuery.trim()) {
      const query = filtersState.value.searchQuery.toLowerCase();
      result = result.filter(
        (track) =>
          track.title?.toLowerCase().includes(query) ||
          track.author?.toLowerCase().includes(query) ||
          track.album?.toLowerCase().includes(query) ||
          track.genre?.toLowerCase().includes(query)
      );
    }

    const { authors, years, genres } = filtersState.value.activeFilters;

    if (authors.length > 0) {
      result = result.filter((track) => authors.includes(track.author));
    }

    if (years.length > 0) {
      result = result.filter((track) => {
        const trackYear = track.release_date
          ? new Date(track.release_date).getFullYear()
          : null;
        return trackYear && years.includes(trackYear);
      });
    }

    if (genres.length > 0) {
      result = result.filter((track) => genres.includes(track.genre));
    }

    filteredTracks.value = result;
  };

  const searchTracks = (query) => {
    filtersState.value.searchQuery = query;
    saveFiltersToStorage();
    applyFilters();
  };

  const handleFilterChange = (filters) => {
    filtersState.value.activeFilters = { ...filters };
    saveFiltersToStorage();
    applyFilters();
  };

  const clearAllFilters = () => {
    filtersState.value.activeFilters = {
      authors: [],
      years: [],
      genres: [],
    };
    filtersState.value.searchQuery = "";
    saveFiltersToStorage();
    applyFilters();
  };

  const hasActiveFilters = computed(() => {
    const { authors, years, genres } = filtersState.value.activeFilters;
    return authors.length > 0 || years.length > 0 || genres.length > 0;
  });

  const getActiveFiltersCount = computed(() => {
    const { authors, years, genres } = filtersState.value.activeFilters;
    return authors.length + years.length + genres.length;
  });

  return {
    tracks: readonly(tracks),
    filteredTracks: readonly(filteredTracks),
    loading: readonly(loading),
    error: readonly(error),
    filtersState: readonly(filtersState),
    hasActiveFilters: readonly(hasActiveFilters),
    getActiveFiltersCount: readonly(getActiveFiltersCount),
    fetchTracks,
    formatDuration,
    applyFilters: handleFilterChange,
    searchTracks,
    clearAllFilters,
  };
};
