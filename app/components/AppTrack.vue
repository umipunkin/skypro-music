<template>
  <div class="playlist__item" @click="onPlay">
    <div class="playlist__track track">
      <div class="track__title">
        <div class="track__title-image">
          <svg class="track__title-svg">
            <use xlink:href="/img/icon/sprite.svg#icon-note" />
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#">
            {{ track.title }}
            <span class="track__title-span">{{ track.subtitle }}</span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="#">{{ track.author }}</a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">{{ track.album }}</a>
      </div>
      <div class="track__time">
        <button class="favorite-btn" @click.stop="toggleFavorite">
          <svg
            class="track__time-svg"
            :class="{ 'favorite-active': isTrackFavorite }"
          >
            <use xlink:href="/img/icon/sprite.svg#icon-like" />
          </svg>
        </button>
        <span class="track__time-text">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePlayerStore } from "~/stores/player";

const playerStore = usePlayerStore();

const { track, playlist } = defineProps({
  track: {
    type: Object,
    default: () => ({}),
  },
  playlist: {
    type: Array,
    default: () => [],
  },
});

const { playTrack } = useAudioPlayer();

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

const isTrackFavorite = computed(() => {
  return favoriteTracks.value.some((fav) => fav.id === track.id);
});

const toggleFavorite = () => {
  if (isTrackFavorite.value) {
    const index = favoriteTracks.value.findIndex((fav) => fav.id === track.id);
    favoriteTracks.value.splice(index, 1);
  } else {
    favoriteTracks.value.push(track);
  }
  saveFavorites();
};

const onPlay = () => {
  if (playlist && playlist.length > 0) {
    playerStore.setPlaylist(playlist);
  } else if (!playerStore.playlist.some((t) => t.id === track.id)) {
    playerStore.setPlaylist([track]);
  }

  playTrack(track);
};

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
}

.playlist__item:hover {
  opacity: 0.7;
}

.playlist__track {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.track__title {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 447px;
}

.track__title-image {
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 17px;
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track__title-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.track__title-span {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e4e4e;
}

.track__author {
  width: 321px;
  display: flex;
  justify-content: flex-start;
}

.track__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: left;
}

.track__album {
  width: 245px;
}

.track__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
}

.track__time {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
}

.track__time-svg {
  width: 14px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
  transition: all 0.3s ease;
}

.track__time-svg:hover {
  stroke: #acacac;
}

.favorite-active {
  fill: #b672ff !important;
  stroke: #b672ff !important;
}

.track__time-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #696969;
}
</style>
