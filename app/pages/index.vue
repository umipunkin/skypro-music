<script setup>
useSeoMeta({
  title: "Музыкальный сервис - Главная",
  description: "Слушайте лучшую музыку",
});

const {
  tracks,
  filteredTracks,
  loading,
  error,
  fetchTracks,
  applyFilters,
  clearFilters,
  currentFilters,
} = useTracks();
const searchQuery = ref("");

const fallbackTracks = ref([
  {
    id: 1,
    title: "Guilt",
    subtitle: "",
    author: "Nero",
    album: "Welcome Reality", 
    duration: "4:44",
    genre: "Electronic",
    release_date: "2011-08-12"
  },
  {
    id: 2,
    title: "Elektro",
    subtitle: "",
    author: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22",
    genre: "House",
    release_date: "2018-05-20"
  },
  {
    id: 3,
    title: "I'm Fire",
    subtitle: "",
    author: "Ali Bakgor", 
    album: "I'm Fire",
    duration: "2:22",
    genre: "Pop",
    release_date: "2019-03-15"
  },
  {
    id: 4,
    title: "Runaway",
    subtitle: "",
    author: "Nero",
    album: "Welcome Reality",
    duration: "4:05",
    genre: "Electronic",
    release_date: "2011-08-12"
  },
  {
    id: 5,
    title: "Must Be The Love",
    subtitle: "",
    author: "Dynoro",
    album: "Greatest Hits",
    duration: "3:15",
    genre: "Dance",
    release_date: "2020-11-30"
  }
])

const displayTracks = computed(() => {
  return filteredTracks.value.length > 0
    ? filteredTracks.value
    : tracks.value.length > 0
    ? tracks.value
    : fallbackTracks.value;
});

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await fetchTracks();
    return;
  }

  loading.value = true;
  try {
    const searchResults = tracks.value.filter(
      (track) =>
        track.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        track.author?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        track.album?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        track.genre?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    filteredTracks.value = searchResults;
  } catch (e) {
    console.error("Ошибка поиска:", e);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = (filters) => {
  applyFilters(filters);
};

const hasActiveFilters = computed(() => {
  return (
    currentFilters.value.authors?.length > 0 ||
    currentFilters.value.years?.length > 0 ||
    currentFilters.value.genres?.length > 0
  );
});

const retryLoading = () => {
  error.value = null;
  fetchTracks();
};

onMounted(() => {
  fetchTracks();
});
</script>

<template>
  <div id="app">
    <div class="wrapper">
      <div class="container">
        <main class="main">
          <AppNavbar />

          <div class="main__centerblock centerblock">
            <div class="centerblock__search search">
              <svg class="search__svg">
                <use xlink:href="/img/icon/sprite.svg#icon-search" />
              </svg>
              <input
                v-model="searchQuery"
                :disabled="loading"
                class="search__text"
                type="search"
                placeholder="Поиск"
                name="search"
                @input="handleSearch"
              >
            </div>
            <h2 class="centerblock__h2">Треки</h2>

            <div v-if="loading" class="loading-state">
              <div class="loading-spinner" />
              <p class="loading-text">Загрузка...</p>
            </div>

            <div v-else-if="error" class="error-state">
              <div class="error-icon">⚠️</div>
              <p class="error-text">{{ error }}</p>
              <button class="retry-button" @click="retryLoading">
                Попробовать снова
              </button>
            </div>

            <template v-else>
              <FilterControls
                :tracks="tracks"
                @filter-change="handleFilterChange"
              />

              <div v-if="hasActiveFilters" class="filters-status">
                <span class="filters-status__text">Активные фильтры:</span>
                <span class="filters-status__clear" @click="clearFilters"
                  >Очистить все</span
                >
              </div>

              <div v-if="tracks.length > 0" class="data-source">
                Загружено с сервера: {{ tracks.length }} треков
                <span v-if="filteredTracks.length !== tracks.length">
                  (отфильтровано: {{ filteredTracks.length }})
                </span>
              </div>
              <div v-else class="data-source">Используются тестовые данные</div>

              <PlayList v-if="displayTracks.length > 0">
                <AppTrack
                  v-for="track in displayTracks"
                  :key="track.id"
                  :title="track.title"
                  :subtitle="track.subtitle"
                  :author="track.author"
                  :album="track.album"
                  :duration="track.duration"
                />
              </PlayList>

              <div v-else class="no-tracks">
                <div class="no-tracks-icon">🎵</div>
                <p class="no-tracks-text">Треки не найдены</p>
                <p class="no-tracks-subtext">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            </template>
          </div>

          <div class="main__sidebar sidebar">
            <div class="sidebar__personal">
              <p class="sidebar__personal-name">Sergey.Ivanov</p>
              <div class="sidebar__icon">
                <svg>
                  <use xlink:href="/img/icon/sprite.svg#logout" />
                </svg>
              </div>
            </div>
            <div class="sidebar__block">
              <div class="sidebar__list">
                <div class="sidebar__item">
                  <a class="sidebar__link" href="#">
                    <img
                      class="sidebar__img"
                      src="/img/playlist01.png"
                      alt="day's playlist"
                    >
                  </a>
                </div>
                <div class="sidebar__item">
                  <a class="sidebar__link" href="#">
                    <img
                      class="sidebar__img"
                      src="/img/playlist02.png"
                      alt="day's playlist"
                    >
                  </a>
                </div>
                <div class="sidebar__item">
                  <a class="sidebar__link" href="#">
                    <img
                      class="sidebar__img"
                      src="/img/playlist03.png"
                      alt="day's playlist"
                    >
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <PlayerBar />

        <footer class="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #383838;
}

.container {
  max-width: 1920px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: #181818;
}

.main {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.main__centerblock {
  width: auto;
  flex-grow: 3;
  padding: 20px 40px 20px 111px;
}

.main__sidebar {
  max-width: 418px;
  padding: 20px 90px 20px 78px;
}

.centerblock__search {
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.centerblock__h2 {
  font-style: normal;
  font-weight: 400;
  font-size: 64px;
  line-height: 72px;
  letter-spacing: -0.8px;
  margin-bottom: 45px;
  color: #ffffff;
}

.search__svg {
  width: 17px;
  height: 17px;
  margin-right: 5px;
  stroke: #ffffff;
  fill: transparent;
}

.search__text {
  flex-grow: 100;
  background-color: transparent;
  border: none;
  padding: 13px 10px 14px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.search__text:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search__text::placeholder {
  background-color: transparent;
  color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}

.sidebar__personal {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0 15px 0;
}

.sidebar__personal-name {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding: 240px 0 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link {
  width: 100%;
  height: 100%;
}

.sidebar__img {
  width: 100%;
  height: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #4e4e4e;
  border-top: 4px solid #b672ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  border: 1px solid #ff6b6b;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-text {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 20px;
  max-width: 400px;
  line-height: 1.5;
}

.retry-button {
  background: #b672ff;
  color: #ffffff;
  border: none;
  border-radius: 60px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background: #9a5cd6;
}

.no-tracks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-tracks-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-tracks-text {
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
}

.no-tracks-subtext {
  color: #696969;
  font-size: 16px;
}

.data-source {
  color: #696969;
  font-size: 12px;
  text-align: center;
  margin-bottom: 20px;
  padding: 8px 12px;
  background: rgba(105, 105, 105, 0.1);
  border-radius: 6px;
}

.filters-status {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: rgba(182, 114, 255, 0.1);
  border-radius: 8px;
  border: 1px solid #b672ff;
}

.filters-status__text {
  color: #ffffff;
  font-size: 14px;
}

.filters-status__clear {
  color: #b672ff;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.filters-status__clear:hover {
  color: #ffffff;
}
</style>
