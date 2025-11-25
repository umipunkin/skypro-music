
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0,
    volume: 50,
    audioRef: null,
  }),

  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    setPlaylist(tracks) {
      this.playlist = tracks;
    },

    setProgress(progress) {
      this.progress = progress;
    },

    setVolume(volume) {
      this.volume = volume;
    },

    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

    setAudioRef(element) {
      this.audioRef = element;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
      }
    },
  },
});