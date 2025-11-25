<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>

    <div class="filter__buttons">
      <div class="filter__button-container">
        <button
          class="filter__button button-author _btn-text"
          :class="{ 'filter__button--active': activeFilter === 'author' }"
          @click.stop="toggleFilter('author')"
        >
          исполнителю
        </button>
        <AuthorFilter
          :is-open="activeFilter === 'author'"
          :authors="uniqueAuthors"
          :selected-authors="filters.authors"
          @update:selected-authors="updateAuthors"
          @apply="applyFilters"
        />
      </div>

      <div class="filter__button-container">
        <button
          class="filter__button button-year _btn-text"
          :class="{ 'filter__button--active': activeFilter === 'year' }"
          @click.stop="toggleFilter('year')"
        >
          году выпуска
        </button>
        <YearFilter
          :is-open="activeFilter === 'year'"
          :years="uniqueYears"
          :selected-years="filters.years"
          @update:selected-years="updateYears"
          @apply="applyFilters"
        />
      </div>

      <div class="filter__button-container">
        <button
          class="filter__button button-genre _btn-text"
          :class="{ 'filter__button--active': activeFilter === 'genre' }"
          @click.stop="toggleFilter('genre')"
        >
          жанру
        </button>
        <GenreFilter
          :is-open="activeFilter === 'genre'"
          :genres="uniqueGenres"
          :selected-genres="filters.genres"
          @update:selected-genres="updateGenres"
          @apply="applyFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["filter-change"]);

const activeFilter = ref(null);
const filters = ref({
  authors: [],
  years: [],
  genres: [],
});

const uniqueAuthors = computed(() => {
  const authors = props.tracks.map((track) => track.author).filter(Boolean);
  return [...new Set(authors)].sort();
});

const uniqueYears = computed(() => {
  const years = props.tracks
    .map((track) => {
      if (track.release_date) {
        return new Date(track.release_date).getFullYear();
      }
      return null;
    })
    .filter((year) => year !== null);

  return [...new Set(years)].sort((a, b) => b - a);
});

const uniqueGenres = computed(() => {
  const genres = props.tracks
    .map((track) => {
      let genre = track.genre;
      if (Array.isArray(genre)) {
        genre = genre[0] || "Неизвестный жанр";
      }
      return genre;
    })
    .filter(Boolean);

  return [...new Set(genres)].sort();
});

const toggleFilter = (filterType) => {
  activeFilter.value = activeFilter.value === filterType ? null : filterType;
};

const updateAuthors = (authors) => {
  filters.value.authors = authors;
};

const updateYears = (years) => {
  filters.value.years = years;
};

const updateGenres = (genres) => {
  filters.value.genres = genres;
};

const applyFilters = () => {
  activeFilter.value = null;
  emit("filter-change", filters.value);
};

const onClickOutside = () => {
  activeFilter.value = null;
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<style scoped>
.centerblock__filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 51px;
  position: relative;
}

.filter__title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-right: 15px;
  color: #ffffff;
}

.filter__buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.filter__button-container {
  position: relative;
}

.filter__button {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ffffff;
  border-radius: 60px;
  padding: 6px 20px;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter__button:hover {
  border-color: #b672ff;
  color: #b672ff;
}

.filter__button--active {
  border-color: #b672ff;
  color: #b672ff;
}
</style>
