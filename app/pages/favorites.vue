<template>
  <div>
    <div class="favorites-header">
      <h2 class="favorites-title">Избранное</h2>
      <p class="favorites-subtitle">Ваша персональная коллекция треков</p>
    </div>

    <div class="centerblock__search search">
      <svg class="search__svg">
        <use xlink:href="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        v-model="searchQuery"
        class="search__text"
        type="search"
        placeholder="Поиск в избранном..."
        name="search"
        @input="handleSearch"
      >
    </div>

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
      <div class="favorites-stats">
        <div class="stats-left">
          <span class="tracks-count"
            >{{ favoriteTracks.length }} треков в избранном</span
          >
          <span
            v-if="filteredFavorites.length !== favoriteTracks.length"
            class="filtered-count"
          >
            (найдено: {{ filteredFavorites.length }})
          </span>
        </div>

        <div v-if="favoriteTracks.length > 0" class="favorites-actions">
          <button
            class="clear-favorites"
            @click="
              favoriteTracks = [];
              saveFavorites();
            "
          >
            Очистить избранное
          </button>
        </div>
      </div>

      <PlayList v-if="filteredFavorites.length > 0">
        <AppTrack
          v-for="track in filteredFavorites"
          :key="track.id"
          :track="track"
          :playlist="filteredFavorites"
        />
      </PlayList>

      <div v-else-if="favoriteTracks.length === 0" class="no-favorites">
        <div class="no-favorites-icon" />
        <p class="no-favorites-text">В избранном пока нет треков</p>
        <p class="no-favorites-subtext">
          Добавляйте треки в избранное, нажимая на сердечко рядом с ними
        </p>
        <NuxtLink to="/" class="browse-link">
          Перейти к поиску треков
        </NuxtLink>
      </div>

      <div v-else class="no-favorites">
        <div class="no-favorites-icon">🔍</div>
        <p class="no-favorites-text">Треки не найдены</p>
        <p class="no-favorites-subtext">Попробуйте изменить поисковый запрос</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { usePlayerStore } from "~/stores/player";

useHead({
  title: "Избранное | Skypro.Music",
  meta: [
    {
      name: "description",
      content:
        "Ваши любимые треки в одном месте. Создавайте персональную коллекцию музыки.",
    },
  ],
});

useSeoMeta({
  title: "Избранное | Skypro.Music",
  description:
    "Ваши любимые треки в одном месте. Создавайте персональную коллекцию музыки.",
});

const playerStore = usePlayerStore();

const { loading, error, fetchTracks } = useTracks();

const searchQuery = ref("");

const favoriteTracks = ref([]);

const loadFavorites = () => {
  if (import.meta.client) {
    const saved = localStorage.getItem("favoriteTracks");
    if (saved) {
      favoriteTracks.value = JSON.parse(saved);
    }
  }
};

const saveFavorites = () => {
  if (import.meta.client) {
    localStorage.setItem(
      "favoriteTracks",
      JSON.stringify(favoriteTracks.value)
    );
  }
};

const filteredFavorites = computed(() => {
  if (!searchQuery.value.trim()) {
    return favoriteTracks.value;
  }

  return favoriteTracks.value.filter(
    (track) =>
      track.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      track.author?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

watch(favoriteTracks, () => {
  if (favoriteTracks.value.length > 0) {
    playerStore.setPlaylist(favoriteTracks.value);
  }
});

let searchTimeout = null;

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {}, 300);
};

const retryLoading = () => {
  error.value = null;
  fetchTracks();
};

onMounted(() => {
  fetchTracks();
  loadFavorites();
});
</script>

<style scoped>
.favorites-header {
  margin-bottom: 40px;
  text-align: center;
}

.favorites-title {
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.8px;
  margin-bottom: 16px;
  color: #ffffff;
}

.favorites-subtitle {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #b672ff;
}

.favorites-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(182, 114, 255, 0.1);
  border-radius: 12px;
  border: 1px solid #b672ff;
}

.stats-left {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tracks-count {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
}

.filtered-count {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #696969;
}

.clear-favorites {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #ff6b6b;
  border-radius: 20px;
  color: #ff6b6b;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-favorites:hover {
  background: #ff6b6b;
  color: #ffffff;
}

.no-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-favorites-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-favorites-text {
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
}

.no-favorites-subtext {
  color: #696969;
  font-size: 16px;
  margin-bottom: 20px;
  max-width: 400px;
}

.browse-link {
  padding: 12px 24px;
  background: #b672ff;
  color: #ffffff;
  border-radius: 60px;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.browse-link:hover {
  background: #9a5cd6;
}

/* Остальные стили как в index.vue */
.centerblock__search {
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
  display: flex;
  flex-direction: row;
  align-items: center;
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

.loading-state,
.error-state {
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
</style>
