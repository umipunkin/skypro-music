<template>
  <div>
    <div class="category-header">
      <h2 class="category-title">{{ categoryName }}</h2>
      <p class="category-subtitle">Треки в выбранной категории</p>
    </div>

    <div class="centerblock__search search">
      <svg class="search__svg">
        <use xlink:href="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        v-model="searchQuery"
        :disabled="loading"
        class="search__text"
        type="search"
        placeholder="Поиск в категории..."
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
      <div class="category-stats">
        <span class="tracks-count">{{ displayTracks.length }} треков</span>

        <div class="category-navigation">
          <span class="navigation-label">Другие категории:</span>
          <div class="category-tags">
            <button
              v-for="cat in Object.keys(categoryNames)"
              :key="cat"
              class="category-tag"
              :class="{ 'category-tag--active': cat === categoryId }"
              @click="goToCategory(cat)"
            >
              {{ categoryNames[cat] }}
            </button>
          </div>
        </div>
      </div>

      <PlayList v-if="displayTracks.length > 0">
        <AppTrack
          v-for="track in displayTracks"
          :key="track.id"
          :track="track"
          :playlist="displayTracks"
        />
      </PlayList>

      <div v-else class="no-tracks">
        <div class="no-tracks-icon" />
        <p class="no-tracks-text">Треки не найдены в этой категории</p>
        <p class="no-tracks-subtext">Попробуйте выбрать другую категорию</p>
        <div class="category-tags">
          <button
            v-for="cat in Object.keys(categoryNames)"
            :key="cat"
            class="category-tag"
            @click="goToCategory(cat)"
          >
            {{ categoryNames[cat] }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { usePlayerStore } from "~/stores/player";

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id;

useHead({
  title: `Категория ${categoryId} | Skypro.Music`,
  meta: [
    {
      name: "description",
      content: `Треки в категории ${categoryId}. Слушайте лучшую музыку в выбранном жанре.`,
    },
  ],
});

useSeoMeta({
  title: `Категория ${categoryId} | Skypro.Music`,
  description: `Треки в категории ${categoryId}. Слушайте лучшую музыку в выбранном жанре.`,
});

const playerStore = usePlayerStore();

const { tracks, loading, error, fetchTracks } = useTracks();

const searchQuery = ref("");

const categoryTracks = computed(() => {
  if (!tracks.value.length) return [];

  return tracks.value.filter((track) => {
    const trackGenre = Array.isArray(track.genre)
      ? track.genre[0]
      : track.genre;
    return trackGenre?.toLowerCase() === categoryId.toLowerCase();
  });
});

const displayTracks = computed(() => {
  return categoryTracks.value;
});

const categoryNames = {
  electronic: "Электронная музыка",
  house: "Хаус",
  pop: "Поп-музыка",
  dance: "Танцевальная",
  rock: "Рок",
  hiphop: "Хип-хоп",
  jazz: "Джаз",
  classical: "Классическая",
};

const categoryName = computed(() => {
  return categoryNames[categoryId] || categoryId;
});

watch([tracks, categoryTracks], () => {
  if (categoryTracks.value.length > 0) {
    playerStore.setPlaylist(categoryTracks.value);
  }
});

let searchTimeout = null;

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    if (!searchQuery.value.trim()) {
      return;
    }

    loading.value = true;
    try {
      console.log("Поиск в категории:", searchQuery.value);
    } catch (e) {
      console.error("Ошибка поиска:", e);
    } finally {
      loading.value = false;
    }
  }, 300);
};

const retryLoading = () => {
  error.value = null;
  fetchTracks();
};

const goToCategory = (newCategoryId) => {
  router.push(`/category/${newCategoryId}`);
};

onMounted(() => {
  fetchTracks();
});
</script>

<style scoped>
.category-header {
  margin-bottom: 40px;
  text-align: center;
}

.category-title {
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.8px;
  margin-bottom: 16px;
  color: #ffffff;
}

.category-subtitle {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #b672ff;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(182, 114, 255, 0.1);
  border-radius: 12px;
  border: 1px solid #b672ff;
}

.tracks-count {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
}

.category-navigation {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navigation-label {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #696969;
}

.category-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-tag {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #4e4e4e;
  border-radius: 20px;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tag:hover {
  border-color: #b672ff;
  color: #b672ff;
}

.category-tag--active {
  background: #b672ff;
  border-color: #b672ff;
  color: #ffffff;
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
  margin-bottom: 20px;
}
</style>
