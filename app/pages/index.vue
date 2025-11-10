<script setup>
useSeoMeta({
  title: 'Музыкальный сервис - Главная',
  description: 'Слушайте лучшую музыку'
})

const { tracks, loading, error, fetchTracks } = useTracks()
const searchQuery = ref('')

const fallbackTracks = ref([
  {
    id: 1,
    title: "Guilt",
    subtitle: "",
    author: "Nero",
    album: "Welcome Reality", 
    duration: "4:44"
  },
  {
    id: 2,
    title: "Elektro",
    subtitle: "",
    author: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22"
  },
  {
    id: 3,
    title: "I'm Fire",
    subtitle: "",
    author: "Ali Bakgor", 
    album: "I'm Fire",
    duration: "2:22"
  }
])

const displayTracks = computed(() => {
  return tracks.value.length > 0 ? tracks.value : fallbackTracks.value
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await fetchTracks()
    return
  }
  
  loading.value = true
  try {
    const filteredTracks = tracks.value.filter(track => 
      track.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      track.author?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    tracks.value = filteredTracks
  } catch (e) {
    console.error('Ошибка поиска:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTracks()
})
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
                class="search__text"
                type="search"
                placeholder="Поиск"
                name="search"
                @input="handleSearch"
              >
            </div>
            <h2 class="centerblock__h2">Треки</h2>

            <FilterControls />

            <div v-if="tracks.length > 0" class="data-source">
               Загружено с сервера: {{ tracks.length }} треков
            </div>
            <div v-else class="data-source">
               Используются тестовые данные
            </div>

            <div v-if="error" class="error-message">
              Ошибка: {{ error }}
            </div>

            <div v-if="loading" class="loading">Загрузка треков...</div>

            <PlayList v-else-if="displayTracks.length > 0">
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
              Треки не найдены
            </div>
          </div>

          <div class="main__sidebar sidebar">
            <div class="sidebar__personal">
              <p class="sidebar__personal-name">Sergey.Ivanov</p>
              <div class="sidebar__icon">
                <svg>
                  <use xlink:href="/img/icon/sprite.svg#logout"/>
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

        <footer class="footer"/>
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

.loading {
  color: #ffffff;
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  font-size: 16px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.no-tracks {
  color: #696969;
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.data-source {
  color: #696969;
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
  padding: 5px;
  background: rgba(105, 105, 105, 0.1);
  border-radius: 4px;
}
</style>