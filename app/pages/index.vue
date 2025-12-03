<template>
  <div>
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
      <div class="error-icon" />
      <p class="error-text">{{ error }}</p>
      <button class="retry-button" @click="retryLoading">
        Попробовать снова
      </button>
    </div>

    <template v-else>
      <FilterControls :tracks="tracks" @filter-change="handleFilterChange" />

      <div v-if="hasActiveFilters" class="filters-status">
        <span class="filters-status__text">
          Активные фильтры: {{ getActiveFiltersCount }}
        </span>
        <span class="filters-status__clear" @click="clearAllFilters">
          Очистить все
        </span>
      </div>

      <div class="data-source">
        Загружено треков: {{ tracks.length }}
        <span v-if="filteredTracks.length !== tracks.length">
          (отфильтровано: {{ filteredTracks.length }})
        </span>
      </div>

      <PlayList v-if="filteredTracks.length > 0">
        <AppTrack
          v-for="track in filteredTracks"
          :key="track.id"
          :track="track"
          :playlist="filteredTracks"
        />
      </PlayList>

      <div v-else class="no-tracks">
        <div class="no-tracks-icon" />
        <p class="no-tracks-text">Треки не найдены</p>
        <p class="no-tracks-subtext">
          Попробуйте изменить параметры поиска или фильтры
        </p>
        <button class="clear-filters-btn" @click="clearAllFilters">
          Очистить фильтры
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
const {
  tracks,
  filteredTracks,
  loading,
  error,
  fetchTracks,
  searchTracks,
  clearAllFilters,
  hasActiveFilters,
  getActiveFiltersCount,
  applyFilters,
} = useTracks();

const searchQuery = ref("");

let searchTimeout = null;

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    searchTracks(searchQuery.value);
  }, 300);
};

const handleFilterChange = (filters) => {
  applyFilters(filters);
};

const retryLoading = () => {
  error.value = null;
  fetchTracks();
};

onMounted(() => {
  fetchTracks();
});
</script>

<style scoped>
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

.clear-filters-btn {
  padding: 10px 20px;
  background: #b672ff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 15px;
}

.clear-filters-btn:hover {
  background: #9a5cd6;
}

.loading-state,
.error-state,
.no-tracks {
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
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  border: 1px solid #ff6b6b;
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
</style>
