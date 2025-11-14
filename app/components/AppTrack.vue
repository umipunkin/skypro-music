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
            {{ track.title }} <span class="track__title-span">{{ track.subtitle }}</span>
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
        <svg class="track__time-svg">
          <use xlink:href="/img/icon/sprite.svg#icon-like" />
        </svg>
        <span class="track__time-text">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const {track} = defineProps({

  track: {
    type: {id: Number, title: String, author: String, album: String, duration: String, release_date: String, url: String, genre: Array},
    default: null,
  }
});

const {playTrack} = useAudioPlayer()

const onPlay = () => {
  playTrack(track)
}
</script>

<style scoped>
.playlist__item {
  width: 100%;
  display: block;
  margin-bottom: 12px;
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

.track__time-svg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
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
